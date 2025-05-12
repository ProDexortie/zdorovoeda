import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../context/AuthContext';
import './AuthPages.css';

const RegisterPage = () => {
  const { register: registerUser, userInfo, isLoading, error } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const password = watch('password', '');
  
  // Перенаправление, если пользователь уже авторизован
  useEffect(() => {
    if (userInfo) {
      navigate('/');
    }
  }, [userInfo, navigate]);
  
  const onSubmit = async (data) => {
    await registerUser(data.name, data.email, data.password);
  };
  
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  
  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  
  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-form-container">
          <h1 className="auth-title">Создание аккаунта</h1>
          
          {error && (
            <div className="alert alert-danger">{error}</div>
          )}
          
          <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <label htmlFor="name">Имя</label>
              <input
                type="text"
                id="name"
                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                {...register('name', {
                  required: 'Имя обязательно к заполнению',
                  minLength: {
                    value: 2,
                    message: 'Имя должно содержать минимум 2 символа',
                  },
                })}
              />
              {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
            </div>
            
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
            
            <div className="form-group">
              <label htmlFor="confirmPassword">Подтверждение пароля</label>
              <div className="password-input-container">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                  {...register('confirmPassword', {
                    required: 'Пожалуйста, подтвердите пароль',
                    validate: value => value === password || 'Пароли не совпадают',
                  })}
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={toggleShowConfirmPassword}
                  aria-label={showConfirmPassword ? 'Скрыть пароль' : 'Показать пароль'}
                >
                  {showConfirmPassword ? (
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
                {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword.message}</div>}
              </div>
            </div>
            
            <div className="checkbox-container">
              <input
                type="checkbox"
                id="termsAndConditions"
                {...register('termsAndConditions', {
                  required: 'Вы должны согласиться с условиями использования',
                })}
              />
              <label htmlFor="termsAndConditions">
                Я соглашаюсь с <Link to="/terms">Условиями использования</Link> и <Link to="/privacy">Политикой конфиденциальности</Link>
              </label>
            </div>
            {errors.termsAndConditions && <div className="invalid-feedback mb-3">{errors.termsAndConditions.message}</div>}
            
            <button
              type="submit"
              className="btn btn-block auth-submit-btn"
              disabled={isLoading}
            >
              {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
            </button>
          </form>
          
          <div className="auth-footer">
            <p>Уже есть аккаунт? <Link to="/login">Войти</Link></p>
          </div>
        </div>
        
        <div className="auth-image">
          <div className="auth-image-overlay">
            <h2>Начните свой путь к здоровому питанию!</h2>
            <p>Создайте аккаунт, чтобы получить персонализированный рацион и доступ к вкусным и полезным блюдам с доставкой на дом.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;