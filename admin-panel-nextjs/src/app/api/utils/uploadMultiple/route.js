import { NextResponse } from 'next/server';
import multerConfig from '../../../../lib/multerConfig';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';

export const config = {
    api: {
        bodyParser: false,
    },
};

const upload = multerConfig.array('images', 40);

function runMiddleware(req, res, fn) {
    return new Promise((resolve, reject) => {
        fn(req, res, (result) => {
            if (result instanceof Error) {
                return reject(result);
            }
            return resolve(result);
        });
    });
}

async function toNodeReadableStream(nextRequest) {
    const readable = new Readable();
    readable._read = () => { };
    readable.push(Buffer.from(await nextRequest.arrayBuffer()));
    readable.push(null);
    return readable;
}

export async function POST(req) {
    try {
        const rawReq = await toNodeReadableStream(req);
        rawReq.headers = Object.fromEntries(req.headers);

        const rawRes = {
            end: () => { },
            setHeader: () => { },
        };

        await runMiddleware(rawReq, rawRes, upload);

        if (!rawReq.files || rawReq.files.length === 0) {
            console.error('No files uploaded');
            return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
        }

        const filePaths = [];
        for (const file of rawReq.files) {
            const { buffer, size } = file;

            let quality = 60;

            if (size > 20 * 1024 * 1024) {
                quality = 20;
            } else if (size > 5 * 1024 * 1024) {
                quality = 30;
            } else if (size > 2 * 1024 * 1024) {
                quality = 50;
            } else if (size < 500 * 1024) {
                quality = 70;
            } else if (size < 100 * 1024) {
                quality = 100;
            }

            const webpFilename = `${Date.now()}-${Math.floor(Math.random() * 1000000000)}.webp`;
            const uploadDir = path.join(process.cwd(), '..', 'uploads');

            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            const webpPath = path.join(uploadDir, webpFilename);

            await sharp(buffer)
                .webp({ quality: quality })
                .toFile(webpPath);

            filePaths.push(webpFilename);
        }

        return NextResponse.json(
            {
                message: 'Images converted to WebP and saved successfully',
                filePaths: filePaths,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Upload failed', details: error.message }, { status: 500 });
    }
}
