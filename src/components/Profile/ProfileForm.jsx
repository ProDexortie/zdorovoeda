import React, { useState, useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../../context/AuthContext';
import DietaryPreferences from './DietaryPreferences';
import './ProfileForm.css';

const ProfileForm = () => {
  const { userInfo, updateProfile, isLoading, error } = useContext(AuthContext);
  const [successMessage, setSuccessMessage] = useState('');
  const [activeTab, setActiveTab] = useState('personal');
  
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  
  // Заполняем форму информацией о пользователе при загрузке
  useEffect(() => {
    if (userInfo) {
      setValue('name', userInfo.name);
      setValue('email', userInfo.email);
      
      if (userInfo.address) {
        setValue('street', userInfo.address.street);
        setValue('city', userInfo.address.city);
        setValue('zipCode', userInfo.address.zipCode);
        setValue('country', userInfo.address.country);
      }
    }
  }, [userInfo, setValue]);
  
  const onSubmit = async (data) => {
    const updatedUserData = {
      name: data.name,
      email: data.email,
      address: {
        street: data.street,
        city: data.city,
        zipCode: data.zipCode,
        country: data.country || 'Россия',
      },
    };
    
    // Если введен пароль, добавляем его в обновляемые данные
    if (data.password) {
      updatedUserData.password = data.password;
    }
    
    try {
      await updateProfile(updatedUserData);
      setSuccessMessage('Профиль успешно обновлен');
      
      // Скрываем сообщение об успехе через 3 секунды
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      console.error('Ошибка при обновлении профиля:', err);
    }
  };
  
  return (
    <div className="profile-form-container">
      <div className="profile-tabs">
        <button 
          className={`tab-button ${activeTab === 'personal' ? 'active' : ''}`}
          onClick={() => setActiveTab('personal')}
        >
          Личные данные
        </button>
        <button 
          className={`tab-button ${activeTab === 'dietary' ? 'active' : ''}`}
          onClick={() => setActiveTab('dietary')}
        >
          Диетические предпочтения
        </button>
      </div>
      
      {activeTab === 'personal' ? (
        <form className="profile-form" onSubmit={handleSubmit(onSubmit)}>
          <h2>Мой профиль</h2>
          
          {successMessage && (
            <div className="alert alert-success">{successMessage}</div>
          )}
          
          {error && (
            <div className="alert alert-danger">{error}</div>
          )}
          
          <div className="form-group">
            <label htmlFor="name" className="form-label">Имя</label>
            <input
              type="text"
              id="name"
              className={`form-control ${errors.name ? 'is-invalid' : ''}`}
              {...register('name', { required: 'Имя обязательно к заполнению' })}
            />
            {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              {...register('email', { 
                required: 'Email обязателен к заполнению',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Некорректный email адрес',
                }
              })}
            />
            {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="password" className="form-label">Пароль (оставьте пустым, чтобы не менять)</label>
            <input
              type="password"
              id="password"
              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
              {...register('password', {
                minLength: {
                  value: 6,
                  message: 'Пароль должен содержать минимум 6 символов',
                }
              })}
            />
            {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
          </div>
          
          <h3 className="address-title">Адрес доставки</h3>
          
          <div className="form-group">
            <label htmlFor="street" className="form-label">Улица и номер дома</label>
            <input
              type="text"
              id="street"
              className="form-control"
              {...register('street')}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="city" className="form-label">Город</label>
            <input
              type="text"
              id="city"
              className="form-control"
              {...register('city')}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="zipCode" className="form-label">Почтовый индекс</label>
            <input
              type="text"
              id="zipCode"
              className="form-control"
              {...register('zipCode')}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="country" className="form-label">Страна</label>
            <input
              type="text"
              id="country"
              className="form-control"
              defaultValue="Россия"
              {...register('country')}
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-block" 
            disabled={isLoading}
          >
            {isLoading ? 'Обновление...' : 'Сохранить изменения'}
          </button>
        </form>
      ) : (
        <DietaryPreferences />
      )}
    </div>
  );
};

export default ProfileForm;