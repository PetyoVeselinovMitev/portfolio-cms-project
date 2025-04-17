import speakeasy from 'speakeasy';
import bcrypt from 'bcryptjs';
import pool from '../../../../lib/db';

export async function POST(req) {
    if (req.method === 'POST') {
        const { username, password } = await req.json()

        const existingUser = await getUserByUsername(username);
        
        if (existingUser[0][0]) {
            return new Response(JSON.stringify({ error: 'Потребителското име е заето' }), {
                status: 400
            })
        }

        const secret = speakeasy.generateSecret({
            name: "admin-panel: Админ",
            issuer: "portal",
            length: 20
        });

        await saveUserToDatabase({
            username,
            password,
            two_factor_secret: secret.base32,
        });

        const otpauthUrl = speakeasy.otpauthURL({
            secret: secret.base32,
            label: `admin-panel: ${username}`,
            issuer: 'portal',
            encoding: 'base32'
        })

        return new Response(JSON.stringify({ otpauthUrl }), {
            status: 200
        })

    } else {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
            status: 405
        })
    }
}

async function saveUserToDatabase({ username, password, two_factor_secret }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = 'INSERT INTO users (username, password, otp_secret) VALUES (?, ?, ?)';
    const values = [username, hashedPassword, two_factor_secret];
    await pool.query(query, values)
}

async function getUserByUsername(username) {
    const query = 'SELECT * FROM users WHERE username = ?;'
    const values = [username];
    return await pool.query(query, values);
}
