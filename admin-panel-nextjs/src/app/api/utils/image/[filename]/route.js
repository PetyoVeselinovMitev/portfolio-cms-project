import fs from 'fs';
import path from 'path';

export const config = {
    api: {
        bodyParser: false,
    },
};

export async function GET(req, { params }) {
    const { filename } = await params;
    const filePath = path.join(process.cwd(), '..', 'uploads', filename);

    if (!fs.existsSync(filePath)) {
        return new Response(
            JSON.stringify({ error: 'File not found' }),
            { status: 404 }
        );
    }

    const file = fs.readFileSync(filePath);
    return new Response(file, {
        status: 200,
        headers: {
            'Content-Type': 'image/webp',
        },
    });
}

export async function DELETE(req, { params }) {
    const { filename } = await params;

    try {
        const filePath = path.join(process.cwd(), '..', 'uploads', filename);

        if (!fs.existsSync(filePath)) {
            return new Response(
                JSON.stringify({ error: 'File not found' }),
                { status: 404 }
            );
        }

        fs.unlinkSync(filePath);

        return new Response(
            JSON.stringify({ message: 'File deleted successfully' }),
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting file:', error);
        return new Response(
            JSON.stringify({ error: 'Failed to delete file', details: error.message }),
            { status: 500 }
        );
    }
}
