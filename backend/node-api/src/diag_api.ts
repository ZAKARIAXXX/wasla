import axios from 'axios';
import { PrismaClient } from '@prisma/client';
import { generateToken } from './middleware/auth';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

const prisma = new PrismaClient();

async function checkApi() {
    const user = await prisma.user.findUnique({ where: { email: 'alice@alpha.com' } });
    if (!user) {
        console.error('Alice not found');
        return;
    }

    const token = generateToken({ 
        id: user.id, 
        email: user.email, 
        name: user.name || 'Alice', 
        role: user.role, 
        teamId: user.teamId! 
    });

    try {
        const res = await axios.get('http://localhost:3000/api/contacts', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        console.log('API Response count:', res.data.length);
        const zakaria = res.data.find((c: any) => c.phone.includes('212776987827') || c.name === 'Zakaria');
        if (zakaria) {
            console.log('Zakaria FOUND in API response:', JSON.stringify(zakaria, null, 2));
        } else {
            console.log('Zakaria NOT FOUND in API response');
            console.log('IDs available:', res.data.map((c: any) => c.id));
        }
    } catch (e: any) {
        console.error('API Error:', e.message);
    }
    
    await prisma.$disconnect();
}
checkApi();
