import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Проверяем, есть ли сохранённые данные пользователя при загрузке
  useEffect(() => {
    const userInfoFromStorage = localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : null;
      
    if (userInfoFromStorage) {
      setUserInfo(userInfoFromStorage);
    }
  }, []);

  // Функция регистрации
  const register = async (name, email, password) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Ошибка при регистрации');
      }
      
      setUserInfo(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Функция входа
  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Неверный email или пароль');
      }
      
      setUserInfo(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Функция выхода
  const logout = () => {
    setUserInfo(null);
    localStorage.removeItem('userInfo');
  };

  // Функция обновления профиля
  const updateProfile = async (userData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify(userData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Ошибка при обновлении профиля');
      }
      
      setUserInfo(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Значение контекста
  const authContextValue = {
    userInfo,
    isLoading,
    error,
    login,
    register,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;