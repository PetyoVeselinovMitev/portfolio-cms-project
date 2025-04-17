import { useLoading } from '@/app/context/LoadingContext';
import styles from './DeleteRouteModal.module.css'
import { useInfoModal } from '@/app/context/InfoModalContext';

export default function DeleteRouteModal(
    { selectedRouteDelete,
        deleteRouteInput,
        toggleDeleteRouteModal,
        setDeleteRouteInput,
        setSelectedRouteDelete,
        fetchRoutes,
    }
) {
    const { setIsLoading } = useLoading();
    const { showModal } = useInfoModal();

    const handleDeleteRouteInputChange = (event) => {
        setDeleteRouteInput(event.target.value);
    }

    const validateRouteDeleteInput = (event) => {

        if (deleteRouteInput === selectedRouteDelete.path) {
            deleteRoute(event);
        } else {
            showModal('Въведете правилния път към страницата за да я изтриете', 'error')
        }
    }

    const deleteRoute = async (event) => {
        event.preventDefault();
        try {
            setIsLoading(true);

            const containers = await fetch('/api/containers/getBoxes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ route_id: selectedRouteDelete.id })
            });
            const containersData = await containers.json();

            if (containersData.length > 0) {
                for (const container of containersData) {
                    const response = await fetch('/api/components/getBoxComponents', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ containerId: container.id })
                    });

                    const components = await response.json();

                    for (const component of components) {
                        if (component.type === 'Image') {
                            await fetch(`/api/utils/image/${component.content_bg.image}`, {
                                method: 'DELETE',
                            });
                        } else if (component.type === 'Gallery') {
                            for (const img of component.content_bg.images) {
                                await fetch(`/api/utils/image/${img}`, {
                                    method: 'DELETE',
                                });
                            }
                        }
                    }
                }
            }

            const response = await fetch('/api/routes/deleteRoute', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(selectedRouteDelete.id)
            });

            if (response.status === 401) {
                window.location.href = '/login';
                showModal('Сесията ви изтече', 'error')
                setIsLoading(false);
                return;
            }

            if (!response.ok) {
                showModal('Грешка при изтриването на страница', 'error')
                return;
            }

            setSelectedRouteDelete('');
            toggleDeleteRouteModal();
            setDeleteRouteInput('');
            fetchRoutes();
            showModal('Успешно изтриване на страница', 'success');

        } catch (error) {
            console.error("Error deleting route", error);
            showModal('Системна грешка', 'error');
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className={styles.deleteRouteModal}>
            <div className={styles.deleteRouteContent}>
                <h2>Избрана страница за изтриване</h2>
                <p>страница bg: <strong>{selectedRouteDelete.name_bg}</strong></p>
                <p>страница en: <strong>{selectedRouteDelete.name_en}</strong></p>
                <p>Линк: <strong>{selectedRouteDelete.path}</strong></p>

                <h3>Въведете "
                    <span className={styles.redText}>{selectedRouteDelete.path}</span>
                    " в полето по долу за да изтриете тази страница.</h3>
                <input
                    type="text"
                    id="deleteRouteInput"
                    name="deleteRouteInput"
                    value={deleteRouteInput}
                    onChange={handleDeleteRouteInputChange}
                />
                <div className={styles.deleteRouteModalActions}>
                    <button onClick={toggleDeleteRouteModal}>Отказ</button>
                    <button type="button" onClick={validateRouteDeleteInput}>Изтриване</button>
                </div>
            </div>
        </div>
    )
}