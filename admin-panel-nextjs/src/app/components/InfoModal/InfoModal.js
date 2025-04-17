import { useInfoModal } from "../../context/InfoModalContext";
import styles from "./InfoModal.module.css";

const InfoModal = () => {
  const { messages, hideModal } = useInfoModal();

  return (
    <div className={styles.modalContainer}>
      {messages.map(({ id, message, type }) => (
        <div
          key={id}
          className={`${styles.modal} ${type === "success" ? styles.success : styles.error}`}
        >
          <p>{message}</p>
          <button className={styles.btn} onClick={() => hideModal(id)}>✖</button>
        </div>
      ))}
    </div>
  );
};

export default InfoModal;
