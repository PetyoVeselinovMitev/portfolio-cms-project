import pool from "../../lib/db";
import NotFound from "../components/404/404";
import styles from './page.module.css'
import Container from '../components/Container/Container'
import { cookies } from "next/headers";

export default async function Page({ params }) {
    const { slug } = await params;
    const cookieStore = await cookies();
    const currentLanguage = cookieStore.get("language")?.value || "bg";

    if (slug === '/') {
        return;
    }

    const [routeData] = await pool.query(
        'SELECT * FROM routes WHERE path = ?', [`/${slug}`]
    );

    if (!routeData || routeData.length === 0) {
        return <NotFound lang={currentLanguage} />;
    }

    const [containers] = await pool.query(
        'SELECT * FROM containers WHERE route_id = ? ORDER BY order_id', [routeData[0].id]
    );

    return (
        <div className={styles.mainDiv}>

            {containers.length === 0
                ? <div className={styles.noContent}>
                    <h1>{currentLanguage === 'bg'
                        ? 'Без съдържание'
                        : 'No Content'}
                    </h1>
                    <p>{currentLanguage === 'bg'
                        ? 'Тази страница няма налично съдържание.'
                        : 'Sorry, there is no content available at this page.'}
                    </p>
                </div>
                : containers.map((container) => (
                    <Container
                        key={container.id}
                        container={container}
                        currentLanguage={currentLanguage}
                    />
                ))}
        </div>
    );
}
