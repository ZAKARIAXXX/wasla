import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const contacts = await prisma.contact.findMany({
        include: { team: true }
    });
    console.log('Contacts in DB:');
    contacts.forEach(c => {
        console.log(`- ${c.name} (${c.phone}), Team: ${c.team?.name} (ID: ${c.teamId})`);
    });

    const alice = await prisma.user.findUnique({
        where: { email: 'alice@alpha.com' }
    });
    console.log('Alice:', alice ? `TeamID: ${alice.teamId}` : 'NOT FOUND');
    
    await prisma.$disconnect();
}
main();
