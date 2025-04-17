import styles from './TextBox.module.css'

export default function TextBox(data) {

    const content = data.currentLanguage === 'bg'
        ? data?.content_bg?.text
        : data?.content_en?.text;

    if (!content) return null;

    return (
        <div className={styles.textBox} dangerouslySetInnerHTML={{ __html: content }}></div>
    )
}