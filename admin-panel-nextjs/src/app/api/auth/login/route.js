import bcrypt from 'bcryptjs';
import speakeasy from 'speakeasy';
import pool from '../../../../lib/db';
import { cookies } from 'next/headers';
import { SignJWT } from 'jose';

export async function POST(req) {
    try {
        const { username, password, token } = await req.json();

        if (!username || !password) {
            return new Response(
                JSON.stringify({ error: 'Потребител и парола са задължителни.' }),
                { status: 400 }
            );
        }

        const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
        const user = rows[0];

        if (!user) {
            return new Response(
                JSON.stringify({ error: 'Невалиден потребител или парола' }),
                { status: 401 }
            );
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return new Response(
                JSON.stringify({ error: 'Невалиден потребител или парола' }),
                { status: 401 }
            );
        }

        if (user.otp_secret) {
            if (!token) {
                return new Response(
                    JSON.stringify({ error: '2FA парола е задължителна.' }),
                    { status: 400 }
                );
            }

            const isTokenValid = speakeasy.totp.verify({
                secret: user.otp_secret,
                encoding: 'base32',
                token: token,
            });

            if (!isTokenValid) {
                return new Response(
                    JSON.stringify({ error: 'Невалидна 2FA парола' }),
                    { status: 401 }
                );
            }
        }

        const authToken = await new SignJWT({username})
        .setProtectedHeader({alg: 'HS256'})
        .setIssuer('urn:portal:issuer')
        .setAudience('urn:portal:audience')
        .setExpirationTime('8h')
        .sign(new TextEncoder().encode(process.env.JWT_SECRET));

        const cookieStore = await cookies();
        cookieStore.set('token', authToken, { path: '/', httpOnly: true, secure: true, maxAge: '2h' })

        return new Response(JSON.stringify({ message: 'Успешен вход.' }))

    } catch (error) {
        console.error('Error during login:', error);
        return new Response(
            JSON.stringify({ error: 'Грешка! Опитай пак.' }),
            { status: 500 }
        );
    }
}
