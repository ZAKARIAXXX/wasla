import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function migrateStatuses() {
    console.log('Starting CRM status migration...');
    try {
        // Migration Mapping
        // 'new-order' -> 'lead'
        // 'pending' / 'preparing' -> 'engaged'
        // 'delivered' -> 'qualified'
        // 'paid' -> 'won'

        const updates = [
            prisma.contact.updateMany({
                where: { status: 'new-order' },
                data: { status: 'lead' }
            }),
            prisma.contact.updateMany({
                where: { status: { in: ['pending', 'preparing'] } },
                data: { status: 'engaged' }
            }),
            prisma.contact.updateMany({
                where: { status: 'delivered' },
                data: { status: 'qualified' }
            }),
            prisma.contact.updateMany({
                where: { status: 'paid' },
                data: { status: 'won' }
            })
        ];

        const results = await Promise.all(updates);
        
        console.log('Migration successful.');
        console.log(`- new-order -> lead: ${results[0].count} updated`);
        console.log(`- pending/preparing -> engaged: ${results[1].count} updated`);
        console.log(`- delivered -> qualified: ${results[2].count} updated`);
        console.log(`- paid -> won: ${results[3].count} updated`);
        
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

migrateStatuses();
