import styles from './ModalGallery.module.css'
export default function ModalGallery({ handleCompSelect }) {
    const component = { newComponentType: 'Gallery' }
    return (
        <div className={styles.headingContainer}>
            <div className={styles.compSelectActions}>
                <h2>Галерия</h2>
                <button onClick={() => handleCompSelect(component)}>Избери</button>
            </div>
            <div className={styles.headingComp}>
                <img src='/assets/examplegallery.webp' alt='exampleGallery' />
            </div>
        </div>
    )
}