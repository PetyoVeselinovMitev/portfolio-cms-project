import { cookies } from "next/headers";

export async function POST() {
    try {
        const cookieStore = await cookies();
        cookieStore.delete('token')

        return new Response(JSON.stringify({ message: 'Logged out successfully' }), {
            status: 200,
        });
    } catch (error) {
        return new Response(JSON.stringify({ error }), {
            status: 500,
        });
    }

}
