import pool from "@/lib/db";

export async function POST(req) {
    try {
        const body = await req.json();


        if (!body.id) {
            return new Response(JSON.stringify({ error: "ID is missing" }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

        const query = `
            UPDATE components 
            SET type = ?, content_bg = ?, content_en = ?
            WHERE id = ?;
        `;

        const values = ['Empty', JSON.stringify({}), JSON.stringify({}), body.id];

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