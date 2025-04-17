import pool from "../../../../lib/db";

export async function POST(req) {
    const body = await req.json();
    
    try {
        const containerQuery = `INSERT INTO Containers (route_id) VALUES (${body})`;
        const [containerResult] = await pool.query(containerQuery);
        const containerId = containerResult.insertId || containerResult.id;

        const componentQuery = `
            INSERT INTO Components (container_id, type, content_bg, content_en, order_id) 
            VALUES (${containerId}, 'Empty', null, null, 1)
        `;
        await pool.query(componentQuery);

        return new Response(JSON.stringify({ message: "Creating new box successful" }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ message: 'Creating new box failed', error: error.message }), { status: 500 });
    }
}
