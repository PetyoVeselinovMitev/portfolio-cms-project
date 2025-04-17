import pool from "@/lib/db";

export async function POST(req) {
    try {
        const body = await req.json();

        const [rows] = await pool.query(
            `SELECT * FROM components WHERE container_id = ? ORDER BY order_id ASC`,
            [body.containerId]
        );

        return new Response(JSON.stringify(rows), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ message: 'failed', error: error.message }), { status: 500 });
    }
}