import pool from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(req) {
    try {
        const { userId, newPassword } = await req.json();

        if (!userId || !newPassword) {
            return new Response(JSON.stringify({ error: 'Липсва потребител или нова парола.' }), { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId]);

        return new Response(JSON.stringify({ message: 'Паролата е променена успешно' }), { status: 200 });
    } catch (error) {
        console.error('Error changing password:', error);
        return new Response(
            JSON.stringify({ error: 'Грешка! Опитайте отново.' }),
            { status: 500 }
        );
    }
}
