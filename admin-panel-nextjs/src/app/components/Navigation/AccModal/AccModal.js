import { useEffect, useState } from 'react';
import { useLoading } from '@/app/context/LoadingContext';
import styles from './AccModal.module.css';
import Register from '../../Register/Register';
import { QRCodeCanvas } from 'qrcode.react';
import UserDeleteModal from './UserDeleteModal/UserDeleteModal';
import { useInfoModal } from '@/app/context/InfoModalContext';

export default function AccModal({ toggleAccModal }) {
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [visibleQrId, setVisibleQrId] = useState(null);
    const { setIsLoading } = useLoading();
    const [isUserDeleteModalOpen, setIsUserDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState('');

    const [selectedUserForPasswordChange, setSelectedUserForPasswordChange] = useState(null);
    const [newPassword, setNewPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { showModal } = useInfoModal();

    useEffect(() => {
        fetchUsers();
        fetchCurrentUser();
    }, []);

    const fetchUsers = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/auth/users', { method: 'GET' });

            if (response.status === 401) {
                window.location.href = '/login';
                showModal('Сесията ви изтече', 'error')
                setIsLoading(false);
                return;
            }

            const data = await response.json();
            
            if (response.ok) {
                setUsers(data);
            } else { 
                showModal(data.error || 'Системна грешка', 'error')
            }
        } catch (error) {
            console.error('Error:', error);
            showModal('Системна грешка', 'error')
        } finally {
            setIsLoading(false);
        }
    };

    const fetchCurrentUser = async () => {
        try {
            const response = await fetch('/api/auth/currentUser');
            const data = await response.json();

            if (response.ok) {
                setCurrentUser(data);
            } else {
                showModal(data.error || 'Системна грешка', 'error')
            }
        } catch (error) {
            console.error('Error:', error);
            showModal('Системна грешка', 'error')
        }
    };

    const toggleQr = (id) => {
        setVisibleQrId((prevId) => (prevId === id ? null : id));
    };

    const toggleUserDeleteModal = (user) => {
        setIsUserDeleteModalOpen(!isUserDeleteModalOpen);
        if (user) {
            setUserToDelete(user);
        } else {
            setUserToDelete('');
        }
    };

    const togglePasswordChangeForm = (user) => {
        setSelectedUserForPasswordChange(user.id === selectedUserForPasswordChange ? null : user.id);
        setNewPassword('');
        setShowPassword(false);
    };

    const toggleShowPassword = () => {
        setShowPassword((prev) => !prev);
    };

    const changeUserPassword = async (userId) => {
        if (!newPassword.trim()) {
            showModal('Попълнете нова парола', 'error')
            return;
        }

        try {
            setIsLoading(true);
            const response = await fetch('/api/auth/changeUserPassword', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, newPassword }),
            });

            if (response.status === 401) {
                window.location.href = '/login';
                showModal('Сесията ви изтече', 'error')
                setIsLoading(false);
                return;
            }

            if (response.ok) {
                setSelectedUserForPasswordChange(null);
                setNewPassword('');
                showModal('Паролата е сменена успешно', 'success')
            } else {
                const data = await response.json();
                showModal(data.error || 'Грешка при смяна на паролата', 'error')
            }
        } catch (error) {
            console.error(error);
            showModal('Системна грешка', 'error')
        } finally {
            setIsLoading(false);
        }
    };

    const deleteUser = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/auth/deleteUser', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: userToDelete.id }),
            });

            if (response.status === 401) {
                window.location.href = '/login'
                showModal('Сесията ви изтече', 'error');
                setIsLoading(false);
                return;
            };

            if (response.ok) {
                fetchUsers();
                setUserToDelete('');
                showModal('Успешно изтриване на акаунт', 'success')
            }

        } catch (error) {
            console.error(error);
            showModal('Системна грешка', 'error')
        } finally {
            setIsLoading(false);
            toggleUserDeleteModal();
        }
    };

    return (
        <div className={styles.AccModal}>
            <div className={styles.AccModalContent}>
                <div className={styles.AccContainer}>
                    <div className={styles.regFormContainer}>
                        <Register fetchUsers={fetchUsers} />
                    </div>
                    <div className={styles.adminAccs}>
                        {users.map((user) => (
                            <div key={user.id} className={styles.user}>
                                <p>Потребител: <strong>{user.username}</strong></p>
                                {visibleQrId === user.id && user.otpauthUrl && (
                                    <QRCodeCanvas value={user.otpauthUrl} />
                                )}
                                <div className={styles.accActions}>
                                    {selectedUserForPasswordChange === user.id && (
                                        <div className={styles.passwordChangeForm}>
                                            <div className={styles.passwordInputContainer}>
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    placeholder="Нова парола"
                                                    value={newPassword}
                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                />
                                                <button
                                                    type="button"
                                                    className={styles.eyeButton}
                                                    onClick={toggleShowPassword}
                                                >
                                                    {showPassword
                                                        ? <img className={styles.eyeButtonSvg} src='/assets/eye-slash.svg' />
                                                        : <img className={styles.eyeButtonSvg} src='/assets/eye.svg' />
                                                    }
                                                </button>
                                                <button onClick={() => changeUserPassword(user.id)}>Запази</button>
                                            </div>
                                        </div>
                                    )}
                                    <button onClick={() => togglePasswordChangeForm(user)}>
                                        {selectedUserForPasswordChange === user.id ? 'Откажи' : 'Смяна на парола'}
                                    </button>
                                    <button onClick={() => toggleQr(user.id)}>
                                        {visibleQrId === user.id ? 'Скрий QR' : 'Покажи QR'}
                                    </button>
                                    <button
                                        className={styles.deleteBtn}
                                        onClick={() => toggleUserDeleteModal(user)}
                                        disabled={currentUser?.id === user.id}
                                    >
                                        Изтрий
                                    </button>
                                </div>


                            </div>
                        ))}
                    </div>
                </div>
                <button className={styles.closeBtn} onClick={toggleAccModal}>X</button>
            </div>

            {isUserDeleteModalOpen && (
                <UserDeleteModal
                    toggleUserDeleteModal={toggleUserDeleteModal}
                    userToDelete={userToDelete}
                    deleteUser={deleteUser}
                />
            )}
        </div>
    );
}
