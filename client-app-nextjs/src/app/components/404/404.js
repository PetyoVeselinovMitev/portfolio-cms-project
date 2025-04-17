'use client'
import styles from './404.module.css'

export default function NotFound({ lang }) {

    return (
        <div className={styles.notFound}>
            <h1>{lang === 'bg'
                ? 'Страницата не е намерена'
                : 'Page Not Found'}
            </h1>
            <p>{lang === 'bg'
                ? 'Извинете, но страницата, която търсите, не съществува.'
                : 'Sorry, but the page you are looking for does not exist.'}
            </p>
        </div>
    )
}