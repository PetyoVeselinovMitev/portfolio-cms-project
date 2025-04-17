import pool from "../../../../lib/db";

export async function DELETE(req) {
    try {
        const body = await req.json();
        const containerId = body.containerId

        await pool.query(
            `DELETE FROM containers WHERE id = ?`, [containerId]
        )

        await pool.query(
            `CALL UpdateOrderIds()`  // Make sure to pass the routeId along
        );
        return new Response(null, {
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