import styles from './ModalTextBox.module.css'

export default function ModalTextBox({ handleCompSelect }) {
    const component = { newComponentType: 'TextBox' }
    return (
        <div className={styles.textBoxContainer}>
            <div className={styles.compSelectActions}>
                <h2>Текст</h2>
                <button onClick={() => handleCompSelect(component)}>Избери</button>
            </div>
            <div className={styles.textBoxComp}>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
                    nisi ut aliquip ex ea commodo consequat.</p>
            </div>
        </div>
    )
}