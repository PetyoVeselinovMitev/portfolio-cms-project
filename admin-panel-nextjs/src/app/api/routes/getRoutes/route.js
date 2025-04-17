import pool from "../../../../lib/db";

export async function GET() {
  try {
    const [rows] = await pool.query(`SELECT * FROM routes ORDER BY order_id;`);
    return new Response (JSON.stringify(rows), {
      status: 200,
      headers: {"Content-Type": "application/json"}
    })
  } catch (error) {
    console.error(error);
    return new Response (JSON.stringify({error: "Database query failed"}), {
      status: 500,
      headers: {"Content-Type": "application/json"}
    })
  }
}
