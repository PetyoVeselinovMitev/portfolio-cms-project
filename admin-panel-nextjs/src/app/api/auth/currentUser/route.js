import { cookies } from 'next/headers';
import { jwtVerify } from 'jose'; 
import pool from '@/lib/db'; 

export async function GET(req) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token');

        if (!token) {
            return new Response(JSON.stringify({ error: 'Не сте влезли в системата' }), { status: 401 });
        }

        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token.value, secret);


        const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [payload.username]);
        const user = rows[0];

        if (!user) {
            return new Response(JSON.stringify({ error: 'Потребителят не е намерен' }), { status: 404 });
        }

        return new Response(
            JSON.stringify({
                id: user.id,
                username: user.username,
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error('Error verifying JWT:', error);
        return new Response(
            JSON.stringify({ error: 'Грешка при извличане на данни за потребителя' }),
            { status: 500 }
        );
    }
}
