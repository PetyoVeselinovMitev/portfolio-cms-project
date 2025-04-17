import styles from './UserDeleteModal.module.css'

export default function UserDeleteModal({ toggleUserDeleteModal, userToDelete, deleteUser }) {
    return (
        <div className={styles.modalBackdrop}>
            <div className={styles.modalContent}>
                <h2>Сигурни ли сте че искате да изтриете този потребител?</h2>
                <h1>{userToDelete.username}</h1>
                <div className={styles.modalActions}>
                    <button onClick={deleteUser}>Да</button>
                    <button onClick={toggleUserDeleteModal}>Отказ</button>
                </div>
            </div>
        </div>
    )
}