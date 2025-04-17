import pool from "../../../../lib/db";

export async function POST(req) {
    try {
        const orderId = await req.json();
        
        if (!orderId) {
            return new Response(JSON.stringify({ error: 'Order ID is required' }),
                { status: 400 })
        }

        await pool.query('CALL SwapRouteOrder(?)', [orderId]);

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