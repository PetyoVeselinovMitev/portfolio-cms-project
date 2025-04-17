import Link from "next/link";
import styles from './Navigation.module.css'

export default function Navigation({ routes, currentPath, currentLanguage }) {
    return (
        <nav className={styles.naviagtion}>
            <ul>
                {routes.map((route) => (
                    <li key={route.name_en}>
                        <div className={`${route.path === currentPath ? `${styles.selected}` : `${styles.notSelected}`}`}>
                           {currentLanguage === 'bg'
                            ?  <Link href={route.path}>{route.name_bg}</Link>
                            :  <Link href={route.path}>{route.name_en}</Link>}
                        </div>
                    </li>
                ))}
            </ul>
        </nav>
    );
}