import { useEffect, useState } from 'react'
import styles from './Container.module.css'
import CompSelector from '../CompSelectorModal/CompSelector';
import { useLoading } from '@/app/context/LoadingContext';
import { useInfoModal } from '@/app/context/InfoModalContext';

export default function Container({
    container,
    selectedRoute,
    fetchBoxes,
    contNumber,
    setIsOrderLocked,
    isOrderLocked
}) {
    const [lang, setLang] = useState('bg');
    const [containerContent, setContainerContent] = useState([]);
    const [isCompNumModalOpen, setIsCompNumModalOpen] = useState(false);
    const [componentToDeleteState, setComponentToDeleteState] = useState([]);
    const [containerToDelete, setContainerToDelete] = useState('');
    const [isContainerDeleteModalOpen, setIsContainerDeleteModalOpen] = useState(false);
    const { isLoading, setIsLoading } = useLoading();
    const { showModal } = useInfoModal();

    useEffect(() => {
        fetchContainerContent();
    }, []);

    const changeLang = () => {
        if (lang === 'bg') {
            setLang('en')
        } else {
            setLang('bg')
        };
    };

    const swapOrderUp = async (containerId, selectedRouteId) => {
        try {
            setIsOrderLocked(true);
            setIsLoading(true);
            const contId = containerId.id;
            const routeId = selectedRouteId.id;

            const response = await fetch('/api/containers/shiftContainerDown', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ contId, routeId })
            });

            if (response.status === 401) {
                window.location.href = '/login';
                showModal('Сесията ви изтече', 'error')
                setIsLoading(false);
                return;
            };

            if (response.ok) {   
                await fetchBoxes();
                await fetchContainerContent();
            } else {
                showModal('Системна грешка', 'error')
            };
        } catch (error) {
            console.error(error);
            showModal('Системна грешка', 'error')
        } finally {
            setIsOrderLocked(false);
            setIsLoading(false);
        };
    };

    const swapOrderDown = async (containerId, selectedRouteId) => {
        try {
            setIsLoading(true);
            setIsOrderLocked(true);
            const contId = containerId.id;
            const routeId = selectedRouteId.id;

            const response = await fetch('/api/containers/shiftContainerUp', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ contId, routeId })
            });

            if (response.status === 401) {
                window.location.href = '/login';
                showModal('Сесията ви изтече', 'error')
                setIsLoading(false);
                return;
            };

            if (response.ok) {
                await fetchBoxes();
                await fetchContainerContent();
            } else {
                showModal('Системна грешка', 'error')
            }

        } catch (error) {
            console.error(error);
            showModal('Системна грешка', 'error')
        } finally {
            setIsOrderLocked(false);
            setIsLoading(false);
        };
    };

    const fetchContainerContent = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/components/getBoxComponents', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ containerId: container.id })
            });

            if (response.status === 401) {
                window.location.href = '/login';
                showModal('Сесията ви изтече', 'error')
                setIsLoading(false);
                return;
            };

            const data = await response.json();

            if (response.ok) {
                setContainerContent(data);
                return data;
            } else {
                showModal('Системна грешка', 'error')
            };
        } catch (error) {
            console.error(error);
            showModal('Системна грешка', 'error')
        } finally {
            setIsLoading(false);
        };
    };

    const increaseSubCompCount = async () => {
        try {
            if (containerContent.length >= 3) {
                return
            };

            setIsLoading(true);
            setIsOrderLocked(true);

            const order_id = containerContent.length + 1;
            const response = await fetch('/api/components/createBoxComponent', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ containerId: container.id, order_id })
            });

            if (response.status === 401) {
                window.location.href = '/login';
                showModal('Сесията ви изтече', 'error')
                setIsLoading(false);
                return;
            };

            if (response.ok) {
                await fetchContainerContent();
            } else {
                showModal('Системна грешка', 'error')
            };

        } catch (error) {
            console.error(error);
            showModal('Системна грешка', 'error')
        } finally {
            setIsOrderLocked(false);
            setIsLoading(false);
        };
    };

    const decreaseSubCompCount = async () => {
        try {
            const data = await fetchContainerContent();
            if (data.length == 1) {
                return
            };

            setIsOrderLocked(true);
            setIsLoading(true);

            const componentToDelete = data[data.length - 1];

            if (componentToDelete.type !== 'Empty') {
                setComponentToDeleteState(componentToDelete)
                setIsCompNumModalOpen(true);
                setIsLoading(false);
                return;
            };

            await deleteBoxContent(componentToDelete);
        } catch (error) {
            console.error(error);
            showModal('Системна грешка', 'error')
        } finally {
            setIsOrderLocked(false);
            setIsLoading(false);
        };
    };

    const deleteBoxContent = async (componentToDelete) => {
        try {
            setIsLoading(true);
            if (componentToDelete.type === 'Image') {
                await fetch(`/api/utils/image/${componentToDelete.content_bg?.image}`, {
                    method: 'DELETE'
                });
            };

            if (componentToDelete.type === 'Gallery') {
                for (let img of componentToDelete.content_bg.images) {
                    await fetch(`/api/utils/image/${img}`, {
                        method: 'DELETE'
                    });
                };
            };

            const response = await fetch('/api/components/deleteBoxComponent', {
                method: 'DELETE',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ componentId: componentToDelete.id })
            });

            if (response.status === 401) {
                window.location.href = '/login';
                showModal('Сесията ви изтече', 'error')
                setIsLoading(false);
                return;
            };

            if (response.ok) {
                await fetchContainerContent();
            } else {
                showModal('Системна грешка', 'error')
            };

        } catch (error) {
            console.error(error);
            showModal('Системна грешка', 'error')
        } finally {
            setIsLoading(false);
        };
    };

    const numCompDeleteFromDecreseModalConfirm = () => {
        deleteBoxContent(componentToDeleteState);
        setIsCompNumModalOpen(false);
    };

    const numCompDeleteFromDecreseModalCancel = () => {
        setComponentToDeleteState([]);
        setIsCompNumModalOpen(false);
    };

    const deleteContianer = async (id) => {
        try {
            setIsLoading(true);
            const data = await fetchContainerContent();
            data.map(async (comp) => {
                if (comp.type === 'Image') {
                    await fetch(`/api/utils/image/${comp.content_bg?.image}`, {
                        method: 'DELETE',
                    });
                };

                if (comp.type === 'Gallery') {
                    comp.content_bg?.images.map(async (img) => {
                        await fetch(`/api/utils/image/${img}`, {
                            method: 'DELETE',
                        });
                    });
                };
            });

            const response = await fetch('/api/containers/deleteBox', {
                method: 'DELETE',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ containerId: id })
            });

            if (response.status === 401) {
                window.location.href = '/login';
                showModal('Сесията ви изтече', 'error')
                setIsLoading(false);
                return;
            };

            if (response.ok) {
                await fetchBoxes();
            } else {
                showModal('Системна грешка', 'error')
            };

        } catch (error) {
            console.error(error);
            showModal('Системна грешка', 'error')
        } finally {
            setIsLoading(false);
        };
    };

    const toggleContainerDeleteModal = (id) => {
        if (id) {
            setContainerToDelete(id);
        };
        setIsContainerDeleteModalOpen(prev => !prev);
    };

    const onContainerDeleteConfirm = () => {
        deleteContianer(containerToDelete);
        toggleContainerDeleteModal();
    };

    const onContainerDeleteCancel = () => {
        toggleContainerDeleteModal();
        setContainerToDelete([]);
    };

    return (
        <div className={styles.newContainer}>
            <div className={styles.containerActions}>
                <div className={styles.left}>
                    <button
                        className={styles.deleteBtn}
                        onClick={() => toggleContainerDeleteModal(container.id)}>
                        <img className='svgBtn' src="/assets/waste-bin-wh.svg" />
                    </button>
                    <div className={styles.componentActions}>
                        <button
                            className={styles.minusBtn}
                            disabled={isLoading || containerContent.length == 1}
                            onClick={decreaseSubCompCount}>-</button>
                        <p>Брой компоненти: {containerContent.length}</p>
                        <button className={styles.plusBtn} disabled={isLoading || containerContent.length >= 3} onClick={increaseSubCompCount}>+</button>
                    </div>

                    <div className={styles.langSelect}>
                        <button className={styles.langBtn} onClick={changeLang}>Език:
                            {lang === 'bg'
                                ? <img src='/assets/bgFlag.webp'></img>
                                : <img src='/assets/ukFlag.webp'></img>}
                        </button>
                    </div>

                </div>

                <div className={styles.right}>
                    {container.order_id !== 1 &&
                        <button disabled={isOrderLocked || isLoading} onClick={() => swapOrderUp(container, selectedRoute)}>↑</button>
                    }
                    {container.order_id !== contNumber &&
                        <button disabled={isOrderLocked || isLoading} onClick={() => swapOrderDown(container, selectedRoute)}>↓</button>
                    }

                    <p>Контейнер: №{container.order_id}</p>
                </div>
            </div>
            <div className={styles.containerContent}>
                {
                    containerContent.map((compContent) => {
                        return (
                            <CompSelector
                                key={compContent.order_id}
                                lang={lang}
                                compContent={compContent}
                                fetchContainerContent={fetchContainerContent}
                            />
                        )
                    })
                }
            </div>

            {isCompNumModalOpen
                ? <div className={styles.modalBackdrop}>
                    <div className={styles.modalContent}>
                        <h2>Намалянето броя на компонентите ще изтрие съдържанието на последния компонент в този контейнер!</h2>
                        <h2>Сигурни ли сте че искате да продължите?</h2>
                        <div className={styles.modalActions}>
                            <button onClick={numCompDeleteFromDecreseModalConfirm}>OK</button>
                            <button onClick={numCompDeleteFromDecreseModalCancel}>Отказ</button>
                        </div>
                    </div>
                </div>
                : ''
            }

            {isContainerDeleteModalOpen
                ? <div className={styles.modalBackdrop}>
                    <div className={styles.modalContent}>
                        <h2>Изтриването на контейнера ще изтрие и прилежащите му компоненти!</h2>
                        <h2>Сигурни ли сте че искате да продължите?</h2>
                        <div className={styles.modalActions}>
                            <button onClick={onContainerDeleteConfirm}>OK</button>
                            <button onClick={onContainerDeleteCancel}>Отказ</button>
                        </div>
                    </div>
                </div>
                : ''
            }
        </div>
    )
}