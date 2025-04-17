export async function POST(req) {
    const { text, from = "bg", to = "en" } = await req.json();

    if (!text) {
        return new Response(
            JSON.stringify({ message: 'No text provided' }),
            { status: 400 }
        );
    }

    try {
        const response = await fetch(
            `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURIComponent(text)}`
        );

        if (!response.ok) {
            throw new Error('Failed to fetch translation');
        }

        const data = await response.json();

        const translatedText = data[0].map((t) => t[0]).join("");

        return new Response(
            JSON.stringify({ translatedText }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ message: 'Failed to complete translation request', error: error.message }),
            { status: 500 }
        );
    }
}
