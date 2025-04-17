import styles from './NoContent.module.css'

export default function NoContent() {
    return (
        <>
            <div className={styles.noContent}>
                <h1>No Content</h1>
                <p>Sorry, there is no content available at the moment.</p>
            </div>
            <div className={styles.noContent}>
                <h1>Без съдържание</h1>
                <p>Извенете, но в момента няма налично съдържание.</p>
            </div>
        </>
    );
}