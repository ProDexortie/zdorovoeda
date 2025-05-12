import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../context/AuthContext';
import './AuthPages.css';

const LoginPage = () => {
  const { login, userInfo, isLoading, error } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  // Перенаправление, если пользователь уже авторизован
  useEffect(() => {
    if (userInfo) {
      navigate('/');
    }
  }, [userInfo, navigate]);
  
  const onSubmit = async (data) => {
    await login(data.email, data.password);
  };
  
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  
  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-form-container">
          <h1 className="auth-title">Вход в аккаунт</h1>
          
          {error && (
            <div className="alert alert-danger">{error}</div>
          )}
          
          <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                {...register('email', {
                  required: 'Email обязателен к заполнению',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Некорректный email адрес',
                  },
                })}
              />
              {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Пароль</label>
              <div className="password-input-container">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                  {...register('password', {
                    required: 'Пароль обязателен к заполнению',
                    minLength: {
                      value: 6,
                      message: 'Пароль должен содержать минимум 6 символов',
                    },
                  })}
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={toggleShowPassword}
                  aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </button>
                {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
              </div>
            </div>
            
            <div className="auth-links">
              <Link to="/forgot-password" className="forgot-password-link">Забыли пароль?</Link>
            </div>
            
            <button
              type="submit"
              className="btn btn-block auth-submit-btn"
              disabled={isLoading}
            >
              {isLoading ? 'Вход...' : 'Войти'}
            </button>
          </form>
          
          <div className="auth-footer">
            <p>Нет аккаунта? <Link to="/register">Зарегистрироваться</Link></p>
          </div>
        </div>
        
        <div className="auth-image">
          <div className="auth-image-overlay">
            <h2>Добро пожаловать в ЗдоровоЕда!</h2>
            <p>Войдите в свой аккаунт, чтобы получить доступ к персонализированному рациону и заказать здоровые блюда с доставкой.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;