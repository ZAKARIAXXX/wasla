import { PrismaClient } from '@prisma/client';
import { whatsappService } from './services/whatsapp';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

const prisma = new PrismaClient();

async function testWhatsApp() {
    const targetPhone = '212776987827';
    const targetName = 'Zakaria';
    
    // 1. Find Alice's team
    const user = await prisma.user.findUnique({
        where: { email: 'alice@alpha.com' },
        include: { team: true }
    });

    if (!user || !user.teamId) {
        console.error('Alice or team not found');
        return;
    }

    console.log(`Using team: ${user.team?.name} (ID: ${user.teamId})`);

    // 2. Update team's WABA ID to match env if needed
    const envWabaId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    if (envWabaId && user.team?.whatsappPhoneNumberId !== envWabaId) {
        console.log(`Updating team WABA ID to ${envWabaId}`);
        await prisma.team.update({
            where: { id: user.teamId },
            data: { whatsappPhoneNumberId: envWabaId }
        });
    }

    // 3. Find or create Zakaria contact
    let contact = await prisma.contact.findFirst({
        where: { phone: targetPhone, teamId: user.teamId }
    });

    if (!contact) {
        console.log('Creating contact for Zakaria...');
        contact = await prisma.contact.create({
            data: {
                name: targetName,
                phone: targetPhone,
                status: 'pending',
                teamId: user.teamId
            }
        });
    }

    // 4. Send test message
    console.log(`Sending WhatsApp message to ${targetPhone}...`);
    try {
        const result = await whatsappService.sendWhatsAppMessage(targetPhone, "Test message from Wasla CRM for Zakaria! 🚀");
        console.log('WhatsApp Service Result:', JSON.stringify(result, null, 2));

        if (result.messages || result.success) {
            // Save to database
            await prisma.message.create({
                data: {
                    text: "Test message from Wasla CRM for Zakaria! 🚀",
                    sent: true,
                    contactId: contact.id,
                    teamId: user.teamId,
                    senderId: user.id,
                    senderName: user.name || 'Alice'
                }
            });
            console.log('Message saved to database.');

            // Update contact last message
            await prisma.contact.update({
                where: { id: contact.id },
                data: {
                    lastMessage: "Test message from Wasla CRM for Zakaria! 🚀",
                    timestamp: new Date()
                }
            });
        }
    } catch (error) {
        console.error('Failed to send message:', error);
    }

    await prisma.$disconnect();
}

testWhatsApp();
