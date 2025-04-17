import Navigation from "../Navigation/Navigation";
import LangSwitch from "../LangSwitcher/LangSwitcher";
import styles from "./DesktopNav.module.css"


export default async function DesktopNav({ routes, currentPath, currentLanguage }) {
    const startYear = 2024

    return (
        <div className={styles.sideNav}>
            <div className={styles.logoContainer}>
                <img src="logo.webp" alt="logo"></img>
            </div>

            <LangSwitch
                currentLanguage={currentLanguage}
            />

            <Navigation
                routes={routes}
                currentPath={currentPath}
                currentLanguage={currentLanguage}
            />

            <div className={styles.copyright}>
                {currentLanguage === 'bg' ? (
                    <p>
                        © {startYear !== new Date().getFullYear()
                            ? `${startYear} - ${new Date().getFullYear()}`
                            : `${startYear}`} Portal ООД. Всички права запазени.
                    </p>
                ) : (
                    <p>
                        © {startYear !== new Date().getFullYear()
                            ? `${startYear} - ${new Date().getFullYear()}`
                            : `${startYear}`} Portal LTD. All rights reserved.
                    </p>
                )}
            </div>
        </div>
    )
}