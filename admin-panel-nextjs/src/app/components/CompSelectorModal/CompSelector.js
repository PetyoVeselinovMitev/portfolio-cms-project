import styles from './CompSelector.module.css'
import ModalHeading from '../selectableComponents/Heading/ModalHeading/ModalHeading';
import Heading from '../selectableComponents/Heading/Heading/Heading';
import ModalTextBox from '../selectableComponents/TextBox/ModalTextBox/ModalTextBox';
import TextBox from '../selectableComponents/TextBox/TextBox/TextBox';
import ModalImage from '../selectableComponents/Image/ModalImage/ModalImage';
import Image from '../selectableComponents/Image/Image/Image';
import Gallery from '../selectableComponents/Gallery/Gallery/Gallery';
import ModalGallery from '../selectableComponents/Gallery/ModalGallery/ModalGallery';

import { useEffect, useState } from 'react';
import { useLoading } from '@/app/context/LoadingContext';
import SubHeading from '../selectableComponents/SubHeading/SubHeading/SubHeading';
import ModalSubHeading from '../selectableComponents/SubHeading/ModalSubHeading/ModalSubHeading';
import { useInfoModal } from '@/app/context/InfoModalContext';

export default function CompSelectorModal({ lang, compContent, fetchContainerContent }) {
    const [isSelectModalOpen, setIsSelectModalOpen] = useState(false);
    const [tempCompContent, setTempCompContent] = useState({
        type: '', content_bg: {}, content_en: {}, order_id: ''
    });
    const [isEdited, setIsEdited] = useState(false);
    const [isCompDeleteModalOpen, setIsCompDeleteModalOpen] = useState(false);
    const { setIsLoading } = useLoading();
    const { showModal } = useInfoModal();

    useEffect(() => {
        setTempCompContent({
            ...compContent,
        });
    }, [compContent]);

    const toggleCompSelector = () => {
        setIsSelectModalOpen((prev) => !prev);
    };

    const handleCompSelect = (component) => {
        setTempCompContent(prev => ({
            ...prev,
            type: component.newComponentType
        }));
        saveContent(component);
        setIsEdited(true);
        toggleCompSelector();
    };

    const saveContent = async (component) => {
        try {
            setIsLoading(true);
            if (component.newComponentType) {
                const response = await fetch('/api/components/saveComponentContent', {
                    method: 'POST',
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ ...tempCompContent, type: component.newComponentType })
                });

                if (response.status === 401) {
                    window.location.href = '/login';
                    showModal('Сесията ви изтече', 'error')
                    setIsLoading(false);
                    return;
                };

                if (response.ok) {
                    setIsEdited(false);
                } else {
                    showModal('Системна грешка', 'error')
                };
            } else {
                const response = await fetch('/api/components/saveComponentContent', {
                    method: 'POST',
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(component.content_bg ? component : tempCompContent)
                });

                if (response.status === 401) {
                    window.location.href = '/login';
                    showModal('Сесията ви изтече', 'error')
                    setIsLoading(false);
                    return;
                };

                if (!response.ok) {
                    showModal('Системна грешка', 'error')
                };
            };
        } catch (error) {
            console.error(error);
            showModal('Системна грешка', 'error')
        } finally {
            setIsLoading(false);
            setIsEdited(false);
        };
    };

    const toggleCompDeleteModal = () => {
        setIsCompDeleteModalOpen((prev) => !prev);
    };

    const deleteComponent = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/components/deleteComponentContent', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(tempCompContent)
            });

            if (response.status === 401) {
                window.location.href = '/login';
                showModal('Сесията ви изтече', 'error')
                setIsLoading(false);
                return;
            };

            if (!response.ok) {
                showModal('Системна грешка', 'error')
            }

            if (tempCompContent.type === 'Image') {
                if (tempCompContent.content_bg?.image) {
                    await deleteImage(tempCompContent.content_bg.image);
                }
            };

            if (tempCompContent.type === 'Gallery' && Array.isArray(tempCompContent.content_bg?.images)) {
                for (let img of tempCompContent.content_bg.images) {
                    await deleteImage(img);
                }
            }

        } catch (error) {
            console.error(error);
            showModal('Системна грешка', 'error')
        } finally {
            fetchContainerContent();
            toggleCompDeleteModal();
            setIsLoading(false);
            setIsEdited(false);
        };
    };

    const translate = async (text) => {
        try {
            setIsLoading(true);
            const response = await fetch("/api/utils/translate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text }),
            });
    
            if (response.status === 401) {
                window.location.href = '/login';
                showModal('Сесията ви изтече', 'error')
                setIsLoading(false);
                return '';
            }
    
            if (response.ok) {
                const data = await response.json();
                return data.translatedText;
            } else {
                showModal('Системна грешка', 'error')
            };
        } catch (error) {
            console.error("Error:", error);
            showModal('Системна грешка', 'error')
            return ''; 
        } finally {
            setIsLoading(false);
        };
    };

    const deleteImage = async (filename, ctx) => {
        try {
            setIsLoading(true);
            const response = await fetch(`/api/utils/image/${filename}`, {
                method: 'DELETE',
            });

            if (response.status === 401) {
                window.location.href = '/login';
                showModal('Сесията ви изтече', 'error')
                setIsLoading(false);
                return;
            };

            if (!response.ok) {
                showModal('Системна грешка', 'error')
            }

        } catch (error) {
            console.error('Error:', error);
            showModal('Системна грешка', 'error')
        } finally {
            if (!ctx) {
                setIsLoading(false);
            }
        };
    };

    const componentMap = {
        Heading: Heading,
        TextBox: TextBox,
        Image: Image,
        Gallery: Gallery,
        SubHeading: SubHeading,
    };

    const ComponentToRender = tempCompContent.type !== 'Empty' ? componentMap[tempCompContent.type] : null;

    return (
        <div key={compContent.order_id} className={styles.componentContainer}>
            {tempCompContent.type === 'Empty'
                ? <button onClick={toggleCompSelector}>Добави компонент</button>
                : ComponentToRender
                    ? <ComponentToRender
                        key={compContent.id}
                        lang={lang}
                        tempCompContent={tempCompContent}
                        setTempCompContent={setTempCompContent}
                        isEdited={isEdited}
                        setIsEdited={setIsEdited}
                        saveContent={saveContent}
                        deleteComponent={deleteComponent}
                        translate={translate}
                        deleteImage={deleteImage}
                        toggleCompDeleteModal={toggleCompDeleteModal}
                    />
                    : ''
            }

            {isSelectModalOpen &&
                <div className={styles.modalBackdrop}>
                    <div className={styles.modalContent}>
                        <div className={styles.modalHeader}>
                            <h1>Моля изберете компонент</h1>
                            <button className={styles.closeButton} onClick={toggleCompSelector}>
                                &times;
                            </button>
                        </div>
                        <div className={styles.modalBody}>
                            <ModalHeading handleCompSelect={handleCompSelect} />
                            <ModalSubHeading handleCompSelect={handleCompSelect} />
                            <ModalTextBox handleCompSelect={handleCompSelect} />
                            <ModalImage handleCompSelect={handleCompSelect} />
                            <ModalGallery handleCompSelect={handleCompSelect} />
                        </div>
                    </div>
                </div>

            }

            {isCompDeleteModalOpen
                ? <div className={styles.deleteModalBackdrop}>
                    <div className={styles.deleteModalContent}>
                        <h2>Сигурни ли сте че искате да изтриете този компонент?</h2>
                        <div className={styles.deleteModalActions}>
                            <button onClick={deleteComponent}>OK</button>
                            <button onClick={toggleCompDeleteModal}>Отказ</button>
                        </div>
                    </div>
                </div>
                : ''
            }
        </div>
    )
}
