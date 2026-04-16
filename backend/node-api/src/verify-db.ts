import prisma from './db';

async function verify() {
    try {
        const contacts = await prisma.contact.findMany();
        console.log(`Found ${contacts.length} contacts.`);

        const messages = await prisma.message.findMany();
        console.log(`Found ${messages.length} messages.`);

        const user = await prisma.user.findUnique({
            where: { email: 'test@example.com' }
        });
        console.log(`User found: ${!!user}`);

        if (contacts.length > 0 && messages.length > 0 && user) {
            console.log('✅ DB Verification Passed!');
        } else {
            console.log('❌ DB Verification Failed!');
        }
    } catch (e) {
        console.error('Verification error:', e);
    } finally {
        await prisma.$disconnect();
    }
}

verify();
