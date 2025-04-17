import { useState, useEffect } from 'react';
import styles from './Gallery.module.css';
import { useLoading } from '@/app/context/LoadingContext';
import StatusDotRed from '@/app/components/StatusDots/StatusDotRed/StatusDotRed';
import StatusDotGreen from '@/app/components/StatusDots/StatusDotGreen/StatusDotGreen';
import { useInfoModal } from '@/app/context/InfoModalContext';

export default function Gallery({
    lang,
    tempCompContent,
    setTempCompContent,
    isEdited,
    setIsEdited,
    saveContent,
    deleteComponent,
    translate,
    deleteImage,
    toggleCompDeleteModal
}) {
    const { isLoading, setIsLoading } = useLoading();
    const [fileNames, setFileNames] = useState('Избери файлове');
    const [uploading, setUploading] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState(null);
    const { showModal } = useInfoModal();

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        if (files) {
            setSelectedFiles(files)
            setFileNames(files.map((file) => file.name))
        } else {
            setFileNames("Избери файлове");
        };
    };

    const handleImageUpload = async () => {
        try {
            setIsLoading(true);
            setUploading(true);
            setIsEdited(true);

            const formData = new FormData();
            for (let file of selectedFiles) {
                formData.append('images', file);
            }

            const response = await fetch('/api/utils/uploadMultiple', {
                method: 'POST',
                body: formData,
            });

            if (response.status === 401) {
                window.location.href = '/login';
                showModal('Сесията ви изтече', 'error')
                setIsLoading(false);
                return;
            }

            if (response.ok) {
                const data = await response.json();

                const updatedContent = {
                    ...tempCompContent,
                    content_bg: {
                        ...(tempCompContent?.content_bg || {}),
                        images: [...(tempCompContent?.content_bg?.images || []), ...data.filePaths],
                    },
                    content_en: {
                        ...(tempCompContent?.content_en || {}),
                        images: [...(tempCompContent?.content_en?.images || []), ...data.filePaths],
                    },
                };

                setTempCompContent(updatedContent);

                const saveResponse = await fetch('/api/components/saveComponentContent', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatedContent),
                });

                if (saveResponse.status === 401) {
                    window.location.href = '/login';
                    showModal('Сесията ви изтече', 'error')
                    setIsLoading(false);
                    return;
                }

                if (!response.ok) {
                    showModal('Системна грешка', 'error')
                }
            } else {
                showModal('Системна грешка', 'error')
            };

        } catch (error) {
            console.error(error);
            showModal('Системна грешка', 'error')
        } finally {
            setIsLoading(false);
            setUploading(false);
            setIsEdited(false);
            setFileNames("Избери файлове");
        }
    };

    const handleImageDelete = async (filename) => {
        try {
            setIsLoading(true);
            setIsEdited(true);

            await deleteImage(filename);

            const updatedContent = {
                ...tempCompContent,
                content_bg: {
                    ...tempCompContent.content_bg,
                    images: tempCompContent.content_bg.images.filter((img) => img !== filename),
                },
                content_en: {
                    ...tempCompContent.content_en,
                    images: tempCompContent.content_en.images.filter((img) => img !== filename)
                }
            };

            await saveContent(updatedContent)
            setTempCompContent(updatedContent)

            setIsEdited(true);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
            setIsEdited(false);
        };
    };

    return (
        <div className={styles.container}>
            <div className={styles.heading}>
                <h2>Галерия</h2>
                <div className={styles.status} >
                    <div className={styles.statusBox}>
                        <p>Попълнено</p>
                        {
                            !tempCompContent.content_bg?.images || !tempCompContent.content_en?.images
                                ? <StatusDotRed />
                                : <StatusDotGreen />
                        }
                    </div>
                    <div className={styles.statusBox}>
                        <p>Запазено</p>
                        {
                            isEdited
                                ? <StatusDotRed />
                                : <StatusDotGreen />
                        }
                    </div>
                </div>
            </div>

            <div className={styles.uploadingActions}>
                <input
                    type="file"
                    id={`fileUpload-${tempCompContent.id}`}
                    name="images"
                    accept='image/*'
                    multiple
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                />
                <label
                    htmlFor={`fileUpload-${tempCompContent.id}`}
                    className={styles.fileLabel}
                >
                    {fileNames === 'Избери файлове'
                        ? fileNames
                        : `Избрани - ${fileNames.length}`}
                </label>
                <button disabled={fileNames === 'Избери файлове' || uploading} onClick={handleImageUpload}>
                    {uploading ? 'Качване...' : 'Качи'}
                </button>
            </div>
            <div className={styles.imagePreview}>
                {tempCompContent.content_bg?.images?.map((image, index) => (
                    <div key={index} className={styles.uploadedImg}>
                        <img
                            src={`/api/utils/image/${image}`}
                            alt={`Uploaded ${index}`}
                        />
                        <button onClick={() => handleImageDelete(image)}>Изтрий снимката</button>
                    </div>
                ))}
            </div>
            <div className={styles.actions}>
                <button disabled={isLoading} className={styles.deleteBtn} onClick={toggleCompDeleteModal}>
                    <img className='svgBtn' src='/assets/waste-bin-wh.svg' />
                </button>
            </div>

        </div>
    );
}
