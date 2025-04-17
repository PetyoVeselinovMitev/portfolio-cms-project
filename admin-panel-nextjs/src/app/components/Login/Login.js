"use client";
import { useState } from "react";
import styles from "./Login.module.css";
import { useInfoModal } from "@/app/context/InfoModalContext";
import { useLoading } from "@/app/context/LoadingContext";

export default function Login() {
    const { isLoading, setIsLoading } = useLoading();
    const [loginFormData, setLoginFormData] = useState({
        username: '',
        password: '',
        token: '',
    });
    const { showModal } = useInfoModal();

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setLoginFormData((prev) => ({ ...prev, [name]: value }));
    };

    const validateInputs = async (e) => {
        e.preventDefault();
        const { username, password, token } = loginFormData;

        if (!username || !password || !token) {
            showModal('Всички полета са задължителни', 'error')
            return;
        }
        
        await handleLogin();
    };

    const handleLogin = async () => {
        const { username, password, token } = loginFormData;

        try {
            setIsLoading(true);
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password, token }),
            });

            if (response.ok) {
                window.location.href = '/admin-panel'
            } else {
                const errorData = await response.json();
                showModal(errorData.error || "Грешка при вход", 'error')
                setIsLoading(false);
            }
        } catch (error) {
            showModal('Системна грешка', 'error')
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.loginFormContainer}>
            <h2>Вход в системата</h2>
            <form onSubmit={validateInputs} className={styles.loginForm}>
                <div className={styles.input}>
                    <label htmlFor="username">Потребител:</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={loginFormData.username}
                        onChange={handleInputChange}
                    />
                </div>
                <div className={styles.input}>
                    <label htmlFor="password">Парола:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={loginFormData.password}
                        onChange={handleInputChange}
                    />
                </div>
                <div className={styles.input}>
                    <label htmlFor="token">2FA Парола:</label>
                    <input
                        type="text"
                        id="token"
                        name="token"
                        value={loginFormData.token}
                        onChange={handleInputChange}
                    />
                </div>
                <button disabled={isLoading} type="submit" className={styles.loginBtn}>
                    Вход
                </button>
            </form>
        </div>
    );
}
