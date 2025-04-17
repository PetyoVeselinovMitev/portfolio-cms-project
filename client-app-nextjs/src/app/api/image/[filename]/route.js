import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
    const { filename } = await params;

    const imageFolderPath = path.join(process.cwd(), '../uploads');

    const filePath = path.join(imageFolderPath, filename);

    try {
        const imageBuffer = fs.readFileSync(filePath);
        const ext = path.extname(filename).toLowerCase();

        const mimeTypes = {
            '.webp': 'image/webp'
        };

        return new NextResponse(imageBuffer, {
            headers: { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' }
        });

    } catch (error) {
        return new NextResponse('Image not found', { status: 404 });
    }
}
