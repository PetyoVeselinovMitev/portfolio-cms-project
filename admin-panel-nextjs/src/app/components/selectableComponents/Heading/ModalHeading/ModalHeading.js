import styles from './ModalHeading.module.css'
export default function ModalHeading({ handleCompSelect }) {
    const component = { newComponentType: 'Heading' }
    return (
        <div className={styles.headingContainer}>
            <div className={styles.compSelectActions}>
                <h2>Заглавие</h2>
                <button onClick={() => handleCompSelect(component)}>Избери</button>
            </div>
            <div className={styles.headingComp}>
                <h1>Примерно заглавие</h1>
            </div>
        </div>
    )
}