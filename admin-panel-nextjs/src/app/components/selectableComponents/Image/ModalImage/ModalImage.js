import styles from './ModalImage.module.css'
export default function ModalImage({ handleCompSelect }) {
    const component = { newComponentType: 'Image' }
    return (
        <div className={styles.headingContainer}>
            <div className={styles.compSelectActions}>
                <h2>Снимка</h2>
                <button onClick={() => handleCompSelect(component)}>Избери</button>
            </div>
            <div className={styles.headingComp}>
                <img src='/assets/exampleImage.webp' alt='exampleImage' />
            </div>
        </div>
    )
}