import pool from "../../../../lib/db";

export async function DELETE(req) {
    try {
        const id = await req.json();
        
        if (!id) {
            return new Response(JSON.stringify({ error: 'ID is required' }),
                { status: 400 })
        }

        await pool.query('DELETE FROM routes WHERE id = ?', [id]);
        await pool.query('CALL AdjustOrderId()')

        return new Response(JSON.stringify({ message: 'Route deleted successfuly' }),
            { status: 200 }
        )
    } catch (error) {
        console.error('Error deleting route', error)
        return new Response(JSON.stringify({ error: 'Failed to delete route' }),
            {status: 500}
        )
    }
}