import { useEffect, useState } from 'react'
import styles from './MainContent.module.css'
import Container from '../Container/Container'
import { useLoading } from '@/app/context/LoadingContext';
import { useInfoModal } from '@/app/context/InfoModalContext';

export default function MainContent({ updateSelectedRoute, selectedRoute }) {
    const [containers, setContainers] = useState([])
    const [contNumber, setContNumber] = useState(0);
    const [isOrderLocked, setIsOrderLocked] = useState(false);
    const { setIsLoading } = useLoading();
    const { showModal } = useInfoModal();

    useEffect(() => {
        fetchBoxes();
    }, [selectedRoute]);

    const fetchBoxes = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/containers/getBoxes', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ route_id: selectedRoute.id })
            });

            if (response.status === 401) {
                window.location.href = '/login';
                showModal('Сесията ви изтече', 'error')
                setIsLoading(false);
                return;
            };

            if (response.ok) {
                const data = await response.json();
                setContainers(data);
                setContNumber(data.length)
            } else {
                showModal('Системна грешка', 'error')
            }
        } catch (error) {
            console.error(error);
            showModal('Системна грешка', 'error')
        } finally {
            setIsLoading(false);
        };
    };

    const fetchBox = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/containers/getBox', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ route_id: selectedRoute.id })
            });

            if (response.status === 401) {
                window.location.href = '/login';
                showModal('Сесията ви изтече', 'error')
                setIsLoading(false);
                return;
            };

            const data = await response.json();

            if (response.ok) {
                setContainers((prevState) => [...prevState, data]);
                setContNumber((prevState) => prevState + 1)
            } else {
                showModal(data.error || 'Системна грешка', 'error')
            }
        } catch (error) {
            console.error(error);
            showModal('Системна грешка', 'error')
        } finally {
            setIsLoading(false);
        };
    };

    const addNewBox = async () => {
        try {
            setIsLoading(true);
            const response = await fetch("/api/containers/createBox", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(selectedRoute.id)
            });
            if (response.status === 401) {
                window.location.href = '/login';
                showModal('Сесията ви изтече', 'error')
            };
            if (response.ok) {
                fetchBox();
            } else {
                showModal('Системна грешка', 'error');
            };
        } catch (error) {
            console.error(error);
            showModal('Системна грешка', 'error')
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <div className={styles.mainContent}>

                {Object.keys(selectedRoute).length > 0
                    ? <div className={styles.selectedRouteInfo}>
                        <h2>Избрана страница за редактиране:</h2>
                        <div className={styles.selectedRouteText}>
                            <p>{selectedRoute.path}</p>
                            <p>{selectedRoute.name_bg}</p>
                            <p>{selectedRoute.name_en}</p>
                        </div>
                    </div>
                    : ''}

                {containers.map((container) => {
                    return (
                        <Container
                            key={container.id}
                            container={container}
                            selectedRoute={selectedRoute}
                            fetchBoxes={fetchBoxes}
                            contNumber={contNumber}
                            setIsOrderLocked={setIsOrderLocked}
                            isOrderLocked={isOrderLocked}
                        />
                    )
                })}

                <div className={styles.contentBtns}>
                    {Object.keys(selectedRoute).length > 0 ? (
                        <button onClick={addNewBox}>Добавяне на нов контейнер</button>
                    ) : (
                        <h2>Изберете страница за редактиране от навигацията.</h2>
                    )}

                    {Object.keys(selectedRoute).length > 0
                        ? <button
                            className={styles.endBtn}
                            onClick={() => updateSelectedRoute({})}>Приключване на страницата
                        </button>
                        : ''
                    }
                </div>
            </div>
        </>
    )

}