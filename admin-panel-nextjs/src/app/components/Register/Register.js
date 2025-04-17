'use client';

import { useState } from 'react';
import styles from './Register.module.css';
import { useInfoModal } from '@/app/context/InfoModalContext';

export default function Register({ fetchUsers }) {
  const [registerFormData, setRegisterFormData] = useState({
    username: '',
    password: '',
    rePass: '',
  });
  const { showModal } = useInfoModal();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setRegisterFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateInputs = async (e) => {
    e.preventDefault();
    const newErrors = [];

    const { username, password, rePass } = registerFormData;

    if (!username || !password) {
      newErrors.push('Всички полета са задължителни');
      showModal('Всички полета са задължителни', 'error')
    }

    if (newErrors.length > 0) {
      return;
    } else {
      await handleRegister();
    }
  };

  const handleRegister = async () => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: registerFormData.username,
          password: registerFormData.password,
        }),
      });

      if (response.status === 401) {
        window.location.href = '/login';
        showModal('Сесията ви изтече', 'error')
        return;
      }

      const data = await response.json();

      if (response.ok) {
        setRegisterFormData({ username: '', password: '', rePass: '' });
        fetchUsers();
        showModal('Успешна регистрация', 'success')
      } else {
        showModal(data.error || 'Грешка при регистрация', 'error')
      }
    } catch (error) {
      showModal('Грешка при свързване със сървъра', 'error')
    }
  };

  return (
    <div className={styles.registerFormContainer}>
      <h2>Регистрация на админ</h2>
      <form className={styles.registerForm} onSubmit={validateInputs}>
        <div className={styles.input}>
          <label>Потребител:</label>
          <input
            type="text"
            name="username"
            value={registerFormData.username || ''}
            onChange={handleInputChange}
            autoComplete='off'
          />
        </div>
        <div className={styles.input}>
          <label>Парола:</label>
          <input
            type="password"
            name="password"
            value={registerFormData.password || ''}
            onChange={handleInputChange}
            autoComplete='off'
          />
        </div>
        
        <button className={styles.registerBtn} type="submit">
          Регистрация
        </button>
      </form>
    </div>
  );
}
