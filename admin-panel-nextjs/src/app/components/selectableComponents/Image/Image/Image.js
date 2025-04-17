import { useState } from 'react';
import styles from './Image.module.css';
import StatusDotRed from '@/app/components/StatusDots/StatusDotRed/StatusDotRed';
import StatusDotGreen from '@/app/components/StatusDots/StatusDotGreen/StatusDotGreen';
import { useLoading } from '@/app/context/LoadingContext';
import { useInfoModal } from '@/app/context/InfoModalContext';
import TiptapBg from '@/app/components/TipTapEditor/TipTapEditorBg';
import TiptapEn from '@/app/components/TipTapEditor/TipTapEditorEn';

export default function Image({
    lang,
    tempCompContent,
    setTempCompContent,
    isEdited,
    setIsEdited,
    deleteImage,
    saveContent,
    translate,
    toggleCompDeleteModal
}) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [fileName, setFileName] = useState("Избери файл");
    const { isLoading, setIsLoading } = useLoading();
    const { showModal } = useInfoModal();

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            const shortName = file.name.length > 15 ? file.name.slice(0, 15) + '...' : file.name;
            setFileName(shortName);
        } else {
            setFileName("Избери файл");
        };
    };

    const handleUpload = async () => {
        try {
            setIsEdited(true);
            setIsLoading(true);
            if (tempCompContent.content_bg?.image || tempCompContent.content_en?.image) {
                await deleteImage(tempCompContent.content_bg?.image, true);
            };

            setUploading(true);
            const formData = new FormData();
            formData.append('image', selectedFile);

            const response = await fetch('/api/utils/upload', {
                method: 'POST',
                body: formData,
            });

            if (response.status === 401) {
                window.location.href = '/login';
                showModal('Сесията ви изтече', 'error')
                setIsLoading(false);
                return;
            };

            const data = await response.json();

            if (response.ok) {
                const newData = {
                    ...tempCompContent,
                    content_bg: {
                        ...tempCompContent.content_bg,
                        image: data.path
                    },
                    content_en: {
                        ...tempCompContent.content_en,
                        image: data.path
                    }
                };
                

                setTempCompContent(newData);

                const response = await fetch('/api/components/saveComponentContent', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newData)
                });

                if (response.status === 401) {
                    window.location.href = '/login';
                    showModal('Сесията ви изтече', 'error')
                    setIsLoading(false);
                    return;
                };

                if (response.ok) {
                    setSelectedFile(null);
                    setIsEdited(false);
                    setFileName("Избери файл");
                } else {
                    showModal('Системна грешка', 'error')
                }
            } else {
                showModal('Системна грешка', 'error')
            }
        } catch (error) {
            console.error('Error:', error);
            showModal('Системна грешка', 'error')
        } finally {
            setUploading(false);
            setIsLoading(false);
            setSelectedFile(null);
            setIsEdited(false);
            setFileName("Избери файл");
        };
    };

    return (
        <div className={styles.container}>
            <div className={styles.heading}>
                <h2>Снимка</h2>
                <div className={styles.status} >
                    <div className={styles.statusBox}>
                        <p>Попълнено</p>
                        {
                            !tempCompContent.content_bg?.image || !tempCompContent.content_en?.image
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

            <div className={styles.imgText}>
                {lang === 'bg' ? (
                    <TiptapBg
                        lang={lang}
                        tempCompContent={tempCompContent}
                        setTempCompContent={setTempCompContent}
                        setIsEdited={setIsEdited}
                    />
                ) : (
                    <TiptapEn
                        lang={lang}
                        tempCompContent={tempCompContent}
                        setTempCompContent={setTempCompContent}
                        setIsEdited={setIsEdited}
                        translate={translate}
                    />
                )}
            </div>

            <div className={styles.uploadingActions}>
                <input
                    type="file"
                    id={`fileUpload-${tempCompContent.id}`}
                    name="image"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                />
                <label
                    htmlFor={`fileUpload-${tempCompContent.id}`}
                    className={styles.fileLabel}
                >
                    {fileName}
                </label>
                <button disabled={fileName === 'Избери файл' || uploading} onClick={handleUpload}>
                    {uploading ? 'Качване...' : 'Качи'}
                </button>
                {isEdited &&
                    <button disabled={isLoading} onClick={saveContent}>Запази</button>
                }
            </div>

            <div className={styles.uploadedImg}>
                {tempCompContent?.content_bg?.image && (
                    <img
                        src={`/api/utils/image/${tempCompContent.content_bg?.image}`}
                        alt="Uploaded"
                    />
                )}
            </div>

            <div className={styles.actions}>
                <button disabled={isLoading} className={styles.deleteBtn} onClick={toggleCompDeleteModal}>
                    <img className='svgBtn' src='/assets/waste-bin-wh.svg' />
                </button>
            </div>
        </div>
    );
}