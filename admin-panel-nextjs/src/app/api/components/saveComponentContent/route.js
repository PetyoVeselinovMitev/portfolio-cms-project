import pool from "@/lib/db";

export async function POST(req) {
    try {
        const body = await req.json();

        const { id, container_id, type, content_bg, content_en, order_id } = body;

        if (!id) {
            return new Response(JSON.stringify({ error: "ID is missing" }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

        const content_bg_json = JSON.stringify(content_bg);
        const content_en_json = JSON.stringify(content_en);

        const query = `
            UPDATE components 
            SET type = ?, content_bg = ?, content_en = ?, order_id = ?
            WHERE id = ?;
        `;

        const values = [type, content_bg_json, content_en_json, order_id, id];

        const [rows] = await pool.query(query, values);

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: "Database query failed" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}