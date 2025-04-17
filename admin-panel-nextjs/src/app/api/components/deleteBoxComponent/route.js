import pool from "@/lib/db";

export async function DELETE(req) {
    try {
        const data = await req.json();
        await pool.query(
            `DELETE FROM Components WHERE id = ?`,
            [data.componentId]
        );
        return new Response(JSON.stringify({ message: 'success' }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ message: 'failed', error: error.message }), { status: 500 });  
    }
}