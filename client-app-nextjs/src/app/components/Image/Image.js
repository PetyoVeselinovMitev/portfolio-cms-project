import styles from './Image.module.css';

export default function Image(data) {
    // Ensure content_bg exists before trying to access content_bg.image
    const imageUrl = data.content_bg && data.content_bg.image
        ? `/api/image/${encodeURIComponent(data.content_bg.image)}`
        : null; // Fallback image

    const imgTextJsx = (
        <div
            className={styles.imgText}
            dangerouslySetInnerHTML={{
                __html: data.currentLanguage === 'bg'
                    ? data.content_bg?.text
                    : data.content_en?.text
            }}
        ></div>
    );

    return (
        <>
            {imageUrl && (
                <div className={styles.imageContainer}>
                    {data.content_bg?.text && data.content_en?.text ? (
                        <>
                            <img src={imageUrl} alt="Gallery Image" />
                            {imgTextJsx}
                        </>
                    ) : (
                        <img src={imageUrl} alt="Gallery Image" />
                    )}
                </div>
            )}
        </>
    );
}
