import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const team = await prisma.team.findFirst();
    if (team) {
        console.log('Team name:', team.name);
        const users = await prisma.user.findMany({ where: { teamId: team.id } });
        console.log('Users:', users.map(u => u.email));
    }
}
main().finally(() => prisma.$disconnect());
