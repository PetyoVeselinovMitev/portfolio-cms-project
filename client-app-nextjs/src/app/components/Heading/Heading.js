import styles from './Heading.module.css'

export default function Heading(data) {

    const content = data.currentLanguage === 'bg'
        ? data?.content_bg?.text
        : data?.content_en?.text;

    if (!content) return null;

    return (
        <div
            className={styles.heading}
            dangerouslySetInnerHTML={{ __html: content }}>
        </div>
    )
}