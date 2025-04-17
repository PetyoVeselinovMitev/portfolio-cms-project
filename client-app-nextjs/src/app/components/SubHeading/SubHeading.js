import styles from './SubHeading.module.css';

export default async function SubHeading(data) {
    if (!data || !data.currentLanguage) return null;

    const content = data.currentLanguage === 'bg'
        ? data?.content_bg?.text
        : data?.content_en?.text;

    if (!content) return null;

    return <div className={styles.subHeading} dangerouslySetInnerHTML={{ __html: content }} />;
}
