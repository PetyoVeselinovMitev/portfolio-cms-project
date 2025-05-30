import styles from './SubHeading.module.css'
import StatusDotRed from '@/app/components/StatusDots/StatusDotRed/StatusDotRed';
import StatusDotGreen from '@/app/components/StatusDots/StatusDotGreen/StatusDotGreen';
import { useLoading } from '@/app/context/LoadingContext';
import TiptapEn from '../../../TipTapEditor/TipTapEditorEn';
import TiptapBg from '../../../TipTapEditor/TipTapEditorBg';

export default function SubHeading({
    lang,
    tempCompContent,
    setTempCompContent,
    isEdited,
    setIsEdited,
    saveContent,
    translate,
    toggleCompDeleteModal
}) {
    const { isLoading } = useLoading();

    return (
        <div className={styles.container}>
            <div className={styles.heading}>
                <h2>Подзаглавие</h2>
                <div className={styles.status} >
                    <div className={styles.statusBox}>
                        <p>Попълнено</p>
                        {
                            !tempCompContent.content_bg?.text || !tempCompContent.content_en?.text
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

            <div className={styles.actions}>
                <button disabled={isLoading} className={styles.deleteBtn} onClick={toggleCompDeleteModal}>
                    <img className='svgBtn' src='/assets/waste-bin-wh.svg' />
                </button>
                {isEdited &&
                    <button disabled={isLoading} onClick={saveContent}>Запази</button>
                }
            </div>
        </div>
    )
}
