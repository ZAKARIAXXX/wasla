import cron from 'node-cron';
import prisma from '../db';

/**
 * Follow-up Scheduler — runs every hour.
 * For each active FollowUpRule, finds contacts that match the trigger and
 * haven't been messaged within the delayHours window, then fires the N8N webhook.
 */
export function startFollowupScheduler() {
    console.log('[Scheduler] Follow-up scheduler initialized.');

    // Run every hour at minute 0
    cron.schedule('0 * * * *', async () => {
        console.log('[Scheduler] Running follow-up check…');

        let rules: any[] = [];
        try {
            rules = await prisma.followUpRule.findMany({ where: { isActive: true } });
        } catch (err) {
            console.error('[Scheduler] Failed to fetch follow-up rules:', err);
            return;
        }

        for (const rule of rules) {
            try {
                const cutoff = new Date(Date.now() - rule.delayHours * 60 * 60 * 1000);

                // Find contacts that haven't had a message since cutoff
                const staleContacts = await prisma.contact.findMany({
                    where: {
                        status: { notIn: ['paid', 'delivered'] },
                        timestamp: { lt: cutoff }
                    },
                    take: 50 // batch cap per run
                });

                if (staleContacts.length === 0) {
                    await logExecution(rule, null, 'skipped', `No contacts matched trigger "${rule.triggerType}"`);
                    continue;
                }

                // Fire the N8N webhook (actionText stores the webhook URL or the message)
                const webhookUrl = rule.actionText.startsWith('http')
                    ? rule.actionText
                    : process.env.N8N_FOLLOWUP_WEBHOOK_URL;

                if (webhookUrl) {
                    try {
                        const response = await fetch(webhookUrl, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                rule: { id: rule.id, name: rule.name, triggerType: rule.triggerType },
                                contacts: staleContacts.map(c => ({ id: c.id, name: c.name, phone: c.phone })),
                                message: rule.actionText
                            }),
                            signal: AbortSignal.timeout(10000)
                        });

                        const success = response.ok;
                        await logExecution(rule, null, success ? 'success' : 'failed',
                            success
                                ? `Triggered for ${staleContacts.length} contact(s)`
                                : `Webhook returned ${response.status}`
                        );
                    } catch (webhookErr: any) {
                        await logExecution(rule, null, 'failed', `Webhook error: ${webhookErr.message}`);
                    }
                } else {
                    await logExecution(rule, null, 'skipped', 'No webhook URL configured (set N8N_FOLLOWUP_WEBHOOK_URL in .env)');
                }

            } catch (ruleErr: any) {
                console.error(`[Scheduler] Error processing rule "${rule.name}":`, ruleErr);
                try {
                    await logExecution(rule, null, 'failed', `Internal error: ${ruleErr.message}`);
                } catch {}
            }
        }

        console.log(`[Scheduler] Follow-up check complete. Processed ${rules.length} rule(s).`);
    });
}

async function logExecution(rule: any, contactId: string | null, status: string, message: string) {
    await prisma.automationLog.create({
        data: {
            ruleType: 'followup',
            ruleId: rule.id,
            ruleName: rule.name,
            contactId,
            status,
            message
        }
    });
}
