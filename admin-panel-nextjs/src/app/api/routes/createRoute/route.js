import pool from "../../../../lib/db";

export async function POST(req) {
    const body = await req.json();
    const { path, name_bg, name_en } = body
    const symbolRegex = /[<>+=_,\.';":\]\[}{+_)(*&^%$#@!?~`|\\]/
    const cyrilicRegex = /[\u0400-\u04FF]/;

    try {
        if (symbolRegex.test(path)) {
            return new Response(JSON.stringify({ error: "The path cannot contain symbols" }), {
                status: 400
            })
        }
        if (path.startsWith("/") && path.slice(1).includes("/")) {
            return new Response(JSON.stringify({ error: "The path can contain '/' only at the start" }), {
                status: 400
            })
        }
        if (cyrilicRegex.test(path)) {
            return new Response(JSON.stringify({ error: "The path cannot contain cyrilic" }), {
                status: 400
            })
        }
        if (!path || !name_bg || !name_en) {
            return new Response(JSON.stringify({ error: "All fields are required" }), {
                status: 400
            })
        }
        if (!path.startsWith('/')) {
            return new Response(JSON.stringify({ error: "The path to the page must start with '/'" }), {
                status: 400
            })
        }
        if (path.includes(' ')) {
            return new Response(JSON.stringify({ error: "The path to the page must not contain spaces" }), {
                status: 400
            })
        }
        if (path.length < 2) {
            return new Response(JSON.stringify({ error: "The path to the page must be at least 2 characters long" }), {
                status: 400
            })
        }

        await pool.query(`INSERT INTO routes(path, name_bg, name_en) VALUES (?,?,?)`,
            [path, name_bg, name_en]
        );
        return new Response(null, {
            status: 201
        })
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: "Creating new route failed", error }), {
            status: 500
        }
        )
    }
}