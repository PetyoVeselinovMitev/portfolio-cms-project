import { useLoading } from '@/app/context/LoadingContext';
import styles from './RouteModal.module.css'
import { useInfoModal } from '@/app/context/InfoModalContext';

export default function RouteModal(
    {
        routeFormData,
        setRouteFormData,
        toggleNewRouteModal,
        fetchRoutes,
        routeForEdit
    }
) {
    const { setIsLoading } = useLoading();
    const { showModal } = useInfoModal();

    const validateRouteInput = (event) => {
        event.preventDefault();

        const symbolRegex = /[<>+=_,\.';":\]\[}{+_)(*&^%$#@!?~`|\\]/
        const cyrilicRegex = /[\u0400-\u04FF]/;

        const errors = [];

        if (routeFormData.path.includes(' ')) {
            errors.push('Пътят към страницата не трябва да съдържа интервали');
        }

        if (symbolRegex.test(routeFormData.path)) {
            errors.push('Пътят към страницата не трябва да съдържа символи');
        }

        if (routeFormData.path.startsWith("/") && routeFormData.path.slice(1).includes("/")) {
            errors.push('Пътят към страницата може да има "/" само в началото')
        }

        if (cyrilicRegex.test(routeFormData.path)) {
            errors.push('Пътят към страницата не трябва да съдържа кирилица');
        }

        if (!routeFormData.name_bg || !routeFormData.name_en || !routeFormData.path) {
            errors.push('Всички полета са задължителни');
        }

        if (!routeFormData.path.startsWith('/')) {
            errors.push('Пътят към страницата трябва да започва с "/"');
        }

        if (routeFormData.path.length < 2) {
            errors.push('Пътят към страницата трябва да бъде поне 2 символа');
        }

        if (errors.length === 0) {
            if (routeForEdit) {
                updateRoute();
            } else {
                createRoute();
            }
        } else {
            errors.map(error => showModal(error, 'error'))
        }
    }

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setRouteFormData((prev) => ({ ...prev, [name]: value }));
    }

    async function translate() {
        try {
            if (!routeFormData.name_en) {
                return
            }

            setIsLoading(true)

            const response = await fetch('/api/utils/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: routeFormData.name_en })
            })

            if (response.status === 401) {
                window.location.href = '/login';
                showModal('Сесията ви изтече', 'error')
                setIsLoading(false);
                return;
            };

            if (response.ok) {
                const { translatedText } = await response.json();

                setRouteFormData((prev) => ({
                    ...prev,
                    name_en: translatedText
                }));
            } else {
                showModal('Грешка с връзката към преводача', 'error')
            }


        } catch (error) {
            console.error(error);
            showModal('Системна грешка', 'error')
        } finally {
            setIsLoading(false)
        }
    }

    const createRoute = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/routes/createRoute', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(routeFormData)
            })

            if (response.status === 401) {
                window.location.href = '/login';
                showModal('Сесията ви изтече', 'error')
                setIsLoading(false);
                return;
            };

            if (!response.ok) {
                const errorData = await response.json();
                if (errorData.error.errno === 1062) {
                    const dublicate = errorData.error.sqlMessage.split(' ')[2];
                    showModal(`Страница с този запис вече съществува: ${dublicate}`)
                } else {
                    showModal(errorData.error || 'Грешка при създаването на страница', 'error')
                }
                return;
            }

            toggleNewRouteModal();
            fetchRoutes();
            setRouteFormData({ path: '', name_bg: '', name_en: '' });
            showModal('Успешно създаване на страница', 'success')

        } catch (error) {
            console.error("Error creating route", error);
            showModal('Системна грешка', 'error')
        } finally {
            setIsLoading(false);
        }
    }

    const updateRoute = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/routes/updateRoute', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...routeFormData, id: routeForEdit })
            });

            if (response.status === 401) {
                window.location.href = '/login';
                showModal('Сесията ви изтече', 'error')
                setIsLoading(false);
                return;
            }

            if (!response.ok) {
                const errorData = await response.json();
                if (errorData.error.errno === 1062) {
                    const duplicate = errorData.error.sqlMessage.split(' ')[2];
                    showModal(`Страница с този запис вече съществува: ${duplicate}`)
                } else {
                    showModal(errorData.error || 'Грешка при създаването на страница', 'error')
                }
                return;
            }

            toggleNewRouteModal();
            fetchRoutes();
            setRouteFormData({ path: '', name_bg: '', name_en: '' });
            showModal('Успешно запазване на страницата', 'success')

        } catch (error) {
            console.error(error)
            showModal('Системна грешка', 'error')
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.newRouteModal}>
            <div className={styles.routeModalContent}>
                {
                    routeForEdit
                        ? <h2>Редактиране на страница</h2>
                        : <h2>Създаване на нова страница</h2>
                }

                <form onSubmit={validateRouteInput}>
                    <div>
                        <label htmlFor="name_bg">Име Български</label>
                        <input
                            type="text"
                            id="name_bg"
                            name="name_bg"
                            value={routeFormData.name_bg}
                            onChange={handleInputChange}
                            placeholder="Например: За нас"
                            autoComplete='off'
                        />
                    </div>
                    <div className={styles.enInput}>
                        <label htmlFor="path">Име Английски</label>
                        <input
                            type="text"
                            id="name_en"
                            name="name_en"
                            value={routeFormData.name_en}
                            onChange={handleInputChange}
                            placeholder="Например: About"
                            autoComplete='off'
                        />
                        <button type="button" onClick={translate} className={styles.translateBtn}>
                            <img className="svgBtn" src="/assets/translate-wh.svg" />
                        </button>
                    </div>
                    <div>
                        <label htmlFor="path">Път в линка</label>
                        <input
                            type="text"
                            id="path"
                            name="path"
                            value={routeFormData.path}
                            onChange={handleInputChange}
                            placeholder="Например: /about"
                            autoComplete='off'
                        />
                    </div>
                    <button type="submit">{routeForEdit ? 'Запази' : 'Създай'}</button>
                    <button type="button" onClick={toggleNewRouteModal}>Отказ</button>
                </form>
            </div>
        </div>
    )
}