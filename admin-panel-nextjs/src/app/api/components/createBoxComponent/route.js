import pool from "@/lib/db";

export async function POST(req) {
    try {
        const data = await req.json();
        await pool.query(
            `INSERT INTO Components (container_id, type, content_bg, content_en, order_id) 
            VALUES (?, ?, ?, ?, ?)`,
            [data.containerId, 'Empty', null, null, data.order_id]
        );
        return new Response(JSON.stringify({ message: 'success' }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ message: 'failed', error: error.message }), { status: 500 });
    }
}