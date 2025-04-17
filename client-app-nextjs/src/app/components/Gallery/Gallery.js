'use client';

import style from "./Gallery.module.css";
import React, { useState, useRef, useEffect } from "react";

const Gallery = ({ content_bg, currentLanguage }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const modalRef = useRef(null);
    const carouselRef = useRef(null);
    const [scrollInterval, setScrollInterval] = useState(null); 

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    useEffect(() => {
        if (isModalOpen) {
            document.body.classList.add("overflow-y-hidden");
        } else {
            document.body.classList.remove("overflow-y-hidden");
        }
    }, [isModalOpen]);

    const handleOutsideClick = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            closeModal();
        }
    };

    const startScrollingLeft = () => {
        if (carouselRef.current) {
            const interval = setInterval(() => {
                carouselRef.current.scrollBy({ left: -250, behavior: "smooth" });
            }, 30); 
            setScrollInterval(interval);
        }
    };

    const startScrollingRight = () => {
        if (carouselRef.current) {
            const interval = setInterval(() => {
                carouselRef.current.scrollBy({ left: 250, behavior: "smooth" });
            }, 30); 
            setScrollInterval(interval);
        }
    };

    const stopScrolling = () => {
        clearInterval(scrollInterval);
        setScrollInterval(null); 
    };

    if (!content_bg || !content_bg.images || content_bg.images.length === 0) {
        return null;
    }

    return (
        <div className={style.galleryContainer}>
            <div className={style.galleryThumbnailContainer} onClick={openModal}>
                <img
                    className={style.thumbnail}
                    src={`/api/image/${encodeURIComponent(content_bg.images[0])}`}
                    alt="Gallery Thumbnail"
                />
                <p className={style.thumbnailText}>
                    {currentLanguage === 'bg' ? 'Разгледай тук' : 'See more'}
                </p>
            </div>

            {isModalOpen && (
                <div className={style.modalOverlay} onClick={handleOutsideClick}>
                    <div ref={modalRef} className={style.modalContent}>
                        <button
                            className={style.scrollButton}
                            onMouseDown={startScrollingLeft}
                            onMouseUp={stopScrolling}
                            onMouseLeave={stopScrolling}
                        >
                            &lt;
                        </button>

                        <div className={style.imagesCarousel} ref={carouselRef}>
                            {content_bg.images.map((image) => (
                                <img
                                    key={image}
                                    className={style.modalImage}
                                    src={`/api/image/${encodeURIComponent(image)}`}
                                />
                            ))}
                        </div>

                        <button
                            className={style.scrollButton}
                            onMouseDown={startScrollingRight}
                            onMouseUp={stopScrolling}
                            onMouseLeave={stopScrolling}
                        >
                            &gt;
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Gallery;
