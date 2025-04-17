"use client";
import styles from "./LangSwitcher.module.css";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function LanguageSwitcher({ currentLanguage }) {
    const [language, setLanguage] = useState(currentLanguage || "bg");
    const router = useRouter();

    useEffect(() => {
        setLanguage(currentLanguage)
    }, [currentLanguage])

    const handleLangToggleChange = () => {
        const newLanguage = language === "en" ? "bg" : "en";
        setLanguage(newLanguage);
        Cookies.set("language", newLanguage, {
            expires: 365,
            path: "/",
            sameSite: "strict",
        });
        router.refresh();
    };

    return (
        <div className={styles.langSwitch}>
            <img className={`${language === 'bg' && styles.grayedOutFlag}`} src="/ukFlag.webp" alt="English Flag" />
            <div className={styles.languageSlider}>
                <input
                    type="checkbox"
                    className={styles.languageToggle}
                    checked={language === "bg"}
                    onChange={handleLangToggleChange}
                    id="language-toggle"
                />
                <label htmlFor="language-toggle" className={styles.sliderLabel}>
                    <div className={styles.toggleTrack}>
                        <span className={`${styles.langText} ${styles.langEn}`}>EN</span>
                        <span className={`${styles.langText} ${styles.langBg}`}>BG</span>
                    </div>
                    <div className={styles.toggleThumb}></div>
                </label>
            </div>
            <img className={`${language === 'en' && styles.grayedOutFlag}`} src="/bgFlag.webp" alt="Bulgarian Flag" />
        </div>
    );
}

