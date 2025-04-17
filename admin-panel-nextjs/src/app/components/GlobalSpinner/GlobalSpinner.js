import { useLoading } from '@/app/context/LoadingContext';
import styles from './GlobalSpinner.module.css';

export default function GlobalSpinner() {
    const { isLoading } = useLoading();

    if (!isLoading) return null;

    return (
        <div className={styles.spinnerOverlay}>
            <div className={styles.spinner}></div>
        </div>
    )
}