import DesktopNav from "../components/DesktopNav/DesktopNav";
import MobileNav from "../components/MobileNav/MobileNav";
import { cookies } from "next/headers";
import pool from "../../lib/db";

function stripHtml(html) {
    if (!html) return null;
    return html.replace(/<[^>]+>/g, '').trim();
}

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const [route] = await pool.query(`SELECT * FROM routes WHERE path = ?`, [`/${slug}`]);

    if (!route || route.length === 0) {
        return {
            title: "Страницата не е намерена",
            description: "Заявената страница не съществува.",
        };
    }

    const [containers] = await pool.query(`SELECT * FROM containers WHERE route_id = ?`, [route[0].id]);
    const [components] = await pool.query(
        `SELECT * FROM components WHERE container_id IN (?)`,
        [containers.map(container => container.id)
        ]);

    const firstImage = components.find(c => c.type === 'Image')?.content_bg.image;
    const texts = [
        stripHtml(components.find(c => c.type === 'Heading')?.content_bg.text),
        stripHtml(components.find(c => c.type === 'SubHeading')?.content_bg.text),
        stripHtml(components.find(c => c.type === 'TextBox')?.content_bg.text),
        stripHtml(components.find(c => c.type === 'Image')?.content_bg.text),
    ]

    const validTexts = texts.filter(text => text && text.trim() !== '');
    const maxTextLength = Math.floor(160 / validTexts.length || 1);

    const snippets = validTexts.map(text => {
        return text.slice(0, maxTextLength) + (text.length > maxTextLength ? '...' : '');
    })

    const title = route[0].name_bg || 'Заглавие по подразбиране';
    const description = snippets.join(' ');
    const imageUrl = `/api/image/${firstImage}` || '/api/image/Titlepage.webp';

    return {
        title: title,
        description: description,
        keywords: ['words'],
        robots: {
            index: true,
            follow: true,
        },
        authors: [{ name: "Portal", url: "https://www.portalzzdfs.com" }],
        creator: "Portal",
        publisher: "Portal",
        openGraph: {
            title: title,
            description: description,
            url: `https://www.portalzzdfs.com/${slug}`,
            image: imageUrl,
            siteName: 'Portal',
        }
    };
}

export default async function RootLayout({ children, params }) {
    const cookieStore = await cookies();
    const currentLanguage = cookieStore.get("language")?.value || "bg";

    const [routes] = await pool.query(`SELECT * FROM routes ORDER BY order_id;`);
    const { slug } = await params;

    return (
        <>
            <MobileNav
                routes={routes}
                currentPath={`/${slug}`}
                currentLanguage={currentLanguage}
            />
            <DesktopNav
                routes={routes}
                currentPath={`/${slug}`}
                currentLanguage={currentLanguage}
            />
            <main className="mainMain">{children}</main>
        </>
    );
}
