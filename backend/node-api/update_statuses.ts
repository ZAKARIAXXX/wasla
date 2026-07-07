import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    console.log('Updating statuses in DB...');
    
    // new-order -> lead
    const res1 = await prisma.contact.updateMany({
        where: { status: 'new-order' },
        data: { status: 'lead' }
    });
    console.log(`Updated ${res1.count} new-order to lead`);

    // pending -> engaged
    const res2 = await prisma.contact.updateMany({
        where: { status: 'pending' },
        data: { status: 'engaged' }
    });
    console.log(`Updated ${res2.count} pending to engaged`);

    // preparing -> qualified
    const res3 = await prisma.contact.updateMany({
        where: { status: 'preparing' },
        data: { status: 'qualified' }
    });
    console.log(`Updated ${res3.count} preparing to qualified`);

    // delivered -> won
    const res4 = await prisma.contact.updateMany({
        where: { status: 'delivered' },
        data: { status: 'won' }
    });
    console.log(`Updated ${res4.count} delivered to won`);

    // paid -> won
    const res5 = await prisma.contact.updateMany({
        where: { status: 'paid' },
        data: { status: 'won' }
    });
    console.log(`Updated ${res5.count} paid to won`);

    console.log('Done!');
}

main().finally(() => prisma.$disconnect());
