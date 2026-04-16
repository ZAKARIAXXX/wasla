import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting MVP multi-tenant database seed...');

    // Hash a common password
    const passwordHash = await bcrypt.hash('password123', 10);

    // Create Team A
    const teamA = await prisma.team.create({
        data: {
            name: 'Alpha E-commerce',
            whatsappPhoneNumberId: '100000000000001'
        }
    });

    // Create Team B
    const teamB = await prisma.team.create({
        data: {
            name: 'Beta Services',
            whatsappPhoneNumberId: '200000000000002'
        }
    });

    // Create User for Team A
    const userA = await prisma.user.upsert({
        where: { email: 'alice@alpha.com' },
        update: { teamId: teamA.id },
        create: {
            email: 'alice@alpha.com',
            name: 'Alice',
            password: passwordHash,
            role: 'Admin',
            teamId: teamA.id,
            settings: {
                create: {
                    businessName: 'Alpha E-commerce',
                    businessPhone: '+1 555-0100',
                }
            }
        }
    });

    // Create User for Team B
    const userB = await prisma.user.upsert({
        where: { email: 'bob@beta.com' },
        update: { teamId: teamB.id },
        create: {
            email: 'bob@beta.com',
            name: 'Bob',
            password: passwordHash,
            role: 'Admin',
            teamId: teamB.id,
            settings: {
                create: {
                    businessName: 'Beta Services',
                    businessPhone: '+1 555-0200',
                }
            }
        }
    });

    // Create Sample Contacts and Messages for Team A
    const contactA1 = await prisma.contact.create({
        data: {
            name: 'Customer A1',
            phone: '15551111111',
            status: 'new-order',
            teamId: teamA.id,
            assignedToId: userA.id,
            messages: {
                create: [
                    { text: 'Hello Alpha! I want to buy shoes.', sent: false, teamId: teamA.id },
                    { text: 'Sure thing, what size?', sent: true, teamId: teamA.id }
                ]
            }
        }
    });

    // Create Sample Contacts and Messages for Team B
    const contactB1 = await prisma.contact.create({
        data: {
            name: 'Customer B1',
            phone: '15552222222',
            status: 'new-order',
            teamId: teamB.id,
            assignedToId: userB.id,
            messages: {
                create: [
                    { text: 'Hi Beta services, I need help.', sent: false, teamId: teamB.id },
                    { text: 'We are here to help!', sent: true, teamId: teamB.id }
                ]
            }
        }
    });

    console.log('Seed completed successfully!');
    console.log(`Team A: ${teamA.name} / ${userA.email}`);
    console.log(`Team B: ${teamB.name} / ${userB.email}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
