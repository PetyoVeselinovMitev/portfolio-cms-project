import styles from './ModalSubHeading.module.css'
export default function ModalSubHeading({ handleCompSelect }) {
    const component = { newComponentType: 'SubHeading' }
    return (
        <div className={styles.headingContainer}>
            <div className={styles.compSelectActions}>
                <h2>Подзаглавие</h2>
                <button onClick={() => handleCompSelect(component)}>Избери</button>
            </div>
            <div className={styles.headingComp}>
                <h2>Примерно подзаглавие</h2>
            </div>
        </div>
    )
}