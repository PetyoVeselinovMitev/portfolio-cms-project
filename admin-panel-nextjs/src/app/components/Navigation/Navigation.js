'use client'
import { useLoading } from "@/app/context/LoadingContext";
import styles from "./Navigation.module.css"
import { useEffect, useState } from "react";
import RouteModal from "./RouteModal/RouteModal";
import DeleteRouteModal from "./DeleteRouteModal/DeleteRouteModal";
import AccModal from "./AccModal/AccModal";
import { useInfoModal } from "@/app/context/InfoModalContext";

export default function AdminNav({ updateSelectedRoute, selectedRoute }) {
    const [routes, setRoutes] = useState([]);
    const [routesNumber, setRoutesNumber] = useState(0);
    const [isRouteModalOpen, setIsRouteModalOpen] = useState(false);
    const [routeFormData, setRouteFormData] = useState({
        path: '', name_bg: '', name_en: ''
    });
    const [routeForEdit, setRouteForEdit] = useState('');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedRouteDelete, setSelectedRouteDelete] = useState('');
    const [deleteRouteInput, setDeleteRouteInput] = useState('');
    const { isLoading, setIsLoading } = useLoading();
    const [isAccModalOpen, setIsAccModalOpen] = useState();
    const { showModal } = useInfoModal();

    useEffect(() => {
        fetchRoutes()
    }, []);

    const fetchRoutes = () => {
        (async () => {
            try {
                setIsLoading(true);
                const response = await fetch('/api/routes/getRoutes', {
                    method: 'GET'
                });

                if (response.status === 401) {
                    window.location.href = '/login';
                    showModal('Сесията ви изтече', 'error')
                    setIsLoading(false);
                    return;
                };

                const data = await response.json();

                if (response.ok) {
                    setRoutes(data);
                    setRoutesNumber(data.length);
                } else {
                    console.error('Failed to fetch routes')
                    showModal(data.error || 'Системна грешка', 'error')
                };

            } catch (error) {
                console.error('Error:', error);
                showModal('Системна грешка', 'error')
            } finally {
                setIsLoading(false);
            };
        })();
    };

    const toggleNewRouteModal = (route) => {
        if (route) {
            setRouteFormData({ path: route.path, name_bg: route.name_bg, name_en: route.name_en });
            setRouteForEdit(route.id);
        } else {
            setRouteFormData({ path: '', name_bg: '', name_en: '' });
            setRouteForEdit('');
        }

        setIsRouteModalOpen(!isRouteModalOpen);
    };

    const toggleDeleteRouteModal = (route) => {
        setDeleteRouteInput('');
        setIsDeleteModalOpen(!isDeleteModalOpen);
        if (route) {
            setSelectedRouteDelete(route)
        }
    };

    const toggleAccModal = () => {
        setIsAccModalOpen(!isAccModalOpen);
    }

    const swapRouteOrderDown = async (route) => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/routes/shiftRouteOrder', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(route)
            })

            if (response.status === 401) {
                window.location.href = '/login';
                showModal('Сесията ви изтече', 'error')
                setIsLoading(false);
                return;
            };

            if (response.ok) {
                fetchRoutes();
                setIsLoading(false);
            } else {
                showModal('Системна грешка', 'error')
            }

        } catch (error) {
            console.error("Error shifting route order_id down", error);
            showModal('Системна грешка', 'error')
        }
    };

    const swapRouteOrderUp = async (route) => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/routes/shiftRouteOrderUp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(route)
            })

            if (response.status === 401) {
                window.location.href = '/login';
                showModal('Сесията ви изтече', 'error')
                setIsLoading(false);
                return;
            };

            if (response.ok) {
                fetchRoutes();
                setIsLoading(false);
            } else {
                showModal('Системна грешка', 'error')
            }

        } catch (error) {
            console.error("Error shifting route order_id up", error);
            showModal('Системна грешка', 'error')
        }
    };

    async function logout() {
        try {
            const response = await fetch('/api/auth/logout', {
                method: 'POST',
            });

            if (response.status === 401) {
                window.location.href = '/login';
                showModal('Сесията ви изтече', 'error')
                setIsLoading(false);
                return;
            };

            if (response.ok) {
                window.location.href = '/login'
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Error during logout:', error);
            showModal('Системна грешка', 'error')
        };
    };

    return (
        <div className={styles.adminNavContainer}>
            <button
                disabled={isLoading}
                onClick={() => toggleNewRouteModal()}>
                Създаване на нова страница
            </button>
            {
                routes.map(route => {
                    return (
                        <div className={styles.adminNavRoute} key={route.id}>
                            <div className={styles.adminRoutesBundle}>
                                <div className={`${styles.adminRoutesInfo} ${selectedRoute.id === route.id
                                    ? styles.selectedRoute
                                    : ''}`}
                                >
                                    <h3>{route.name_bg}</h3>
                                    <h3>{route.name_en}</h3>
                                    <p>{route.path}</p>
                                    <button
                                        disabled={isLoading}
                                        onClick={() =>
                                            updateSelectedRoute(route)}>
                                        Съдържание
                                    </button>
                                    <div className={styles.routeActions}>
                                        <button
                                            disabled={isLoading || selectedRoute.id}
                                            onClick={() => { toggleDeleteRouteModal(route) }}>
                                            <img className='svgBtn' src="/assets/waste-bin-bk.svg" />
                                        </button>
                                        <button
                                            disabled={selectedRoute.id}
                                            onClick={() => toggleNewRouteModal(route)}
                                        >
                                            <img className='svgBtn' src="/assets/pen-bk.svg" />
                                        </button>
                                    </div>
                                </div>
                                <div className={styles.adminRoutesBtnsUpAndDown}>
                                    {route.order_id !== 1 &&
                                        <button disabled={isLoading || Object.keys(selectedRoute).length !== 0}
                                            onClick={() => { swapRouteOrderUp(route.order_id) }}>↑</button>
                                    }
                                    {route.order_id !== routesNumber &&
                                        <button disabled={isLoading || Object.keys(selectedRoute).length !== 0}
                                            onClick={() => { swapRouteOrderDown(route.order_id) }}>↓</button>
                                    }
                                </div>
                            </div>
                        </div>
                    )
                })
            }
            <div className={styles.navActions}>
                <button onClick={toggleAccModal} className={styles.logoutBtn}>Акаунти</button>
                <button onClick={logout} className={styles.logoutBtn}>Изход</button>
            </div>

            {isAccModalOpen &&
                <AccModal
                    toggleAccModal={toggleAccModal}
                />
            }

            {isRouteModalOpen &&
                <RouteModal
                    routeFormData={routeFormData}
                    setRouteFormData={setRouteFormData}
                    toggleNewRouteModal={toggleNewRouteModal}
                    fetchRoutes={fetchRoutes}
                    routeForEdit={routeForEdit}
                />
            }

            {isDeleteModalOpen &&
                <DeleteRouteModal
                    selectedRouteDelete={selectedRouteDelete}
                    deleteRouteInput={deleteRouteInput}
                    toggleDeleteRouteModal={toggleDeleteRouteModal}
                    setDeleteRouteInput={setDeleteRouteInput}
                    setSelectedRouteDelete={setSelectedRouteDelete}
                    fetchRoutes={fetchRoutes}
                />
            }
        </div>
    )
}