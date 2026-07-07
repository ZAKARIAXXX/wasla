import express, { Request, Response } from 'express';
import Stripe from 'stripe';
import prisma from '../db';

const router = express.Router();

// Ensure STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET are set in environment
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock', {
    apiVersion: '2023-10-16' as any,
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

// We need raw body to verify Stripe signature
router.post('/stripe', express.raw({ type: 'application/json' }), async (req: Request, res: Response) => {
    const sig = req.headers['stripe-signature'];

    let event: Stripe.Event;

    try {
        if (endpointSecret && sig) {
            // Verify signature using the raw body
            event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
        } else {
            // Fallback for local testing if no secret is set
            event = JSON.parse(req.body.toString());
        }
    } catch (err) {
        const error = err as Error;
        console.error(`Webhook Error: ${error.message}`);
        return res.status(400).send(`Webhook Error: ${error.message}`);
    }

    // Handle the event
    try {
        switch (event.type) {
            case 'checkout.session.completed':
            case 'payment_intent.succeeded': {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const dataObject = event.data.object as any;

                // Get email from checkout session or payment intent
                const email = dataObject.customer_details?.email || dataObject.receipt_email;
                const amountTotal = (dataObject.amount_total || dataObject.amount_received || 0) / 100; // Convert cents to standard currency unit

                if (email) {
                    console.log(`Processing successful payment for email: ${email}, amount: ${amountTotal}`);

                    // Find the contact by email
                    const contact = await prisma.contact.findFirst({
                        where: { email: email }
                    });

                    if (contact) {
                        // Update the contact's total spent and order status
                        const updatedContact = await prisma.contact.update({
                            where: { id: contact.id },
                            data: {
                                totalSpent: {
                                    increment: amountTotal
                                },
                                orderStatus: 'Paid'
                            }
                        });
                        console.log(`Updated contact ${contact.id} with new totalSpent.`);
                        
                        const io = req.app.get('io');
                        if (io) {
                            const teamId = (updatedContact as any).teamId;
                            if (teamId) {
                                io.to(`team:${teamId}`).emit('contactUpdated', updatedContact);
                            } else {
                                console.warn('Stripe webhook received but no team could be mapped for contact:', contact.id);
                            }
                        }
                    } else {
                        console.log(`No contact found with email: ${email}`);
                    }
                }
                break;
            }
            default:
                console.log(`Unhandled event type ${event.type}`);
        }

        // Return a 200 response to acknowledge receipt of the event
        res.status(200).send();
    } catch (error) {
        console.error('Error processing webhook:', error);
        res.status(500).json({ error: 'Internal server error while processing webhook' });
    }
});

// WhatsApp API Webhook Verification GET
const whatsappGetHandler = (req: Request, res: Response) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token) {
        if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
            console.log('WhatsApp WEBHOOK_VERIFIED');
            return res.status(200).send(challenge);
        } else {
            return res.sendStatus(403);
        }
    }
    return res.sendStatus(400);
};

router.get('/whatsapp', whatsappGetHandler);
router.get('/wasla-secure-webhook', whatsappGetHandler);

// WhatsApp API Incoming Webhook POST
const whatsappPostHandler = async (req: Request, res: Response) => {
    try {
        const body = req.body;
        console.log('[Webhook] Incoming WhatsApp payload:', JSON.stringify(body, null, 2));

        if (body.object === 'whatsapp_business_account') {
            if (body.entry && body.entry[0].changes && body.entry[0].changes[0] && body.entry[0].changes[0].value.messages && body.entry[0].changes[0].value.messages[0]) {
                const message = body.entry[0].changes[0].value.messages[0];
                const contactInfo = body.entry[0].changes[0].value.contacts?.[0];

                const waId = message.from; // Phone number string
                const text = message.text?.body;
                const name = contactInfo?.profile?.name || waId;
                const phoneNumberId = body.entry[0].changes[0].value.metadata?.phone_number_id;

                if (text && phoneNumberId) {
                    console.log(`Received WhatsApp message from ${waId}: ${text} for metadata.phone_number_id: ${phoneNumberId}`);

                    let team = await prisma.team.findFirst({
                        where: { whatsappPhoneNumberId: phoneNumberId }
                    });

                    // Fallback to the first available team if this is a single-tenant instance
                    // and they haven't explicitly set their whatsappPhoneNumberId yet!
                    if (!team) {
                        team = await prisma.team.findFirst();
                        
                        if (!team) {
                            console.log(`No matching team found for WhatsApp Phone Number ID ${phoneNumberId}`);
                            return res.status(200).send('EVENT_RECEIVED');
                        }
                    }

                    const teamId = team.id;

                    // Attempt to find existing contact by phone in this team
                    let contact = await prisma.contact.findFirst({
                        where: { 
                            phone: { contains: waId },
                            teamId: teamId 
                        } 
                    });

                    if (!contact) {
                        contact = await prisma.contact.create({
                            data: {
                                name: name,
                                phone: waId,
                                status: 'lead',
                                lastMessage: text,
                                teamId: teamId
                            }
                        });
                    } else {
                        contact = await prisma.contact.update({
                            where: { id: contact.id },
                            data: {
                                lastMessage: text,
                                unread: { increment: 1 },
                                timestamp: new Date()
                            }
                        });
                    }

                    const savedMessage = await prisma.message.create({
                        data: {
                            text: text,
                            sent: false,
                            contactId: contact.id,
                            teamId: teamId
                        }
                    });

                    // Emit real-time socket events for frontend updates by team
                    const io = req.app.get('io');
                    if (io) {
                        io.to(`team:${teamId}`).emit('newMessage', savedMessage);
                        io.to(`team:${teamId}`).emit('contactUpdated', contact);
                    }
                }
            }
            return res.status(200).send('EVENT_RECEIVED');
        } else {
            return res.sendStatus(404);
        }
    } catch (error) {
        console.error('WhatsApp Webhook Error:', error);
        return res.sendStatus(500);
    }
};

router.post('/whatsapp', express.json(), whatsappPostHandler);
router.post('/wasla-secure-webhook', express.json(), whatsappPostHandler);

export default router;
