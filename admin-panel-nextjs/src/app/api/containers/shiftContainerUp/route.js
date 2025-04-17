import pool from "@/lib/db";

export async function POST(req) {
    try {
        const body = await req.json();
        
        if (!body) {
            return new Response(JSON.stringify({ error: 'No data' }),
                { status: 400 })
        }

        await pool.query(' CALL ShiftOrderDown(?)', [body.contId]);

        return new Response(JSON.stringify({ message: 'Route order shifted successfuly' }),
            { status: 200 }
        )
    } catch (error) {
        console.error('Error shifting route order', error)
        return new Response(JSON.stringify({ error: 'Failed to shift route order' }),
            {status: 500}
        )
    }
}