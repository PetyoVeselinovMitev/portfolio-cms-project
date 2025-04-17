import styles from './Toolbar.module.css';

const TiptapToolbar = ({ editor }) => {
    if (!editor) return null;

    return (
        <div className={styles.toolbar}>
            <div className={styles.toolbarGroup}>
                <button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`${styles.toolbarButton} ${editor.isActive('bold') ? styles.isActive : ''}`}
                >
                    <img src='/assets/bold.svg' className={styles.editorBtnImg}/>
                </button>

                <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`${styles.toolbarButton} ${editor.isActive('italic') ? styles.isActive : ''}`}
                >
                    <img src='/assets/italic.svg' className={styles.editorBtnImg}/>
                </button>

                <button
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    className={`${styles.toolbarButton} ${editor.isActive('underline') ? styles.isActive : ''}`}
                >
                    <img src='/assets/underline.svg' className={styles.editorBtnImg}/>
                </button>

                <button
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={`${styles.toolbarButton} ${editor.isActive('orderedList') ? styles.isActive : ''}`}
                >
                    <img src='/assets/list-ol.svg' className={styles.editorBtnImg}/>
                </button>

                <button
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`${styles.toolbarButton} ${editor.isActive('bulletList') ? styles.isActive : ''}`}
                >
                    <img src='/assets/list-ul.svg' className={styles.editorBtnImg}/>
                </button>
            </div>
            <div className={styles.toolbarGroup}>
                <button
                    onClick={() => editor.chain().focus().setTextAlign('left').run()}
                    className={`${styles.toolbarButton} ${editor.isActive({ textAlign: 'left' }) ? styles.isActive : ''}`}
                >
                    <img src='/assets/justify-left.svg' className={styles.editorBtnImg}/>
                </button>

                <button
                    onClick={() => editor.chain().focus().setTextAlign('center').run()}
                    className={`${styles.toolbarButton} ${editor.isActive({ textAlign: 'center' }) ? styles.isActive : ''}`}
                >
                    <img src='/assets/justify-center.svg' className={styles.editorBtnImg}/>
                </button>

                <button
                    onClick={() => editor.chain().focus().setTextAlign('right').run()}
                    className={`${styles.toolbarButton} ${editor.isActive({ textAlign: 'right' }) ? styles.isActive : ''}`}
                >
                    <img src='/assets/justify-right.svg' className={styles.editorBtnImg}/>
                </button>
            </div>
        </div>
    );
};

export default TiptapToolbar;
