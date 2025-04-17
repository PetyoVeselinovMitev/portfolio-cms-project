export const dynamic = 'force-dynamic';

import { redirect } from "next/navigation";
import pool from "../lib/db";
import NoContent from './components/NoContent/NoContent';

export default async function DynamicPage() {
  const [rows] = await pool.query(`
    SELECT * 
    FROM routes 
    ORDER BY order_id ASC 
    LIMIT 1;
  `);

  if (!rows || rows.length === 0 || !rows[0].path) {
    return <NoContent />;
  }

  redirect(rows[0].path);
}
