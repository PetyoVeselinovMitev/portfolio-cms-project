import pool from "../../../../lib/db";

export async function POST(req) {
    try {
        const body = await req.json();
        const routeId = body.route_id;
        const [rows] = await pool.query(
            `SELECT * FROM Containers WHERE route_id = ? ORDER BY order_id ASC`,
            [routeId]
        );

        return new Response(JSON.stringify(rows), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: "Database query failed" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
