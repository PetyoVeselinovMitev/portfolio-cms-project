import pool from "../../../../lib/db";
import speakeasy from "speakeasy";

export async function GET() {
  try {
    const [rows] = await pool.query(`SELECT id, username, otp_secret FROM users ORDER BY id;`);

    const usersWithOtpUrl = rows
    .filter(user => user.username !== "system-admin")
    .map(user => ({
      id: user.id,
      username: user.username,
      otpauthUrl: user.otp_secret
        ? speakeasy.otpauthURL({
            secret: user.otp_secret,
            label: `admin-panel: ${user.username}`,
            issuer: "portal",
            encoding: "base32",
          })
        : null,
    }));

    return new Response(JSON.stringify(usersWithOtpUrl), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Database query failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
