"use client";
import { useState } from "react";
import Navigation from "../Navigation/Navigation";
import LangSwitch from "../LangSwitcher/LangSwitcher";
import styles from "./MobileNav.module.css";

export default function DesktopNav({ routes, currentPath, currentLanguage }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleMenuToggle = () => {
        setIsMenuOpen((prevState) => !prevState);
    };

    return (
        <div className={styles.mobileNav}>
            <div className={styles.logoAndLangSwitch}>
                <div className={styles.mobileLogoContainer}>
                    <img src="logo.webp" alt="logo"></img>
                </div>
                <div
                    className={`${styles.burgerIcon} ${isMenuOpen ? styles.open : ""}`}
                    onClick={handleMenuToggle}
                >
                    <span className={styles.burgerLine}></span>
                    <span className={styles.burgerLine}></span>
                    <span className={styles.burgerLine}></span>
                </div>
            </div>
            <div
                className={`${styles.mobileMenu} ${isMenuOpen ? styles.showMenu : ""}`}
            >
                <LangSwitch currentLanguage={currentLanguage} />
                <Navigation routes={routes} currentPath={currentPath} currentLanguage={currentLanguage}/>
            </div>
        </div>
    );
}
