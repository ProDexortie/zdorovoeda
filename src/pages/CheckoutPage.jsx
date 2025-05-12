import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const { cartItems, getTotalPrice, clearCart } = useContext(CartContext);
  const { userInfo } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  
  // Перенаправляем на страницу входа, если пользователь не авторизован
  useEffect(() => {
    if (!userInfo) {
      navigate('/login?redirect=checkout');
    }
  }, [userInfo, navigate]);
  
  // Перенаправляем на страницу корзины, если корзина пуста
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);
  
  // Заполняем форму данными пользователя
  useEffect(() => {
    if (userInfo) {
      setValue('name', userInfo.name);
      
      if (userInfo.address) {
        setValue('street', userInfo.address.street);
        setValue('city', userInfo.address.city);
        setValue('zipCode', userInfo.address.zipCode);
        setValue('country', userInfo.address.country || 'Россия');
      }
    }
  }, [userInfo, setValue]);
  
  // Текущая дата + 1 день (минимальная дата доставки)
  const getMinDeliveryDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };
  
  // Текущая дата + 14 дней (максимальная дата доставки)
  const getMaxDeliveryDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 14);
    return maxDate.toISOString().split('T')[0];
  };
  
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError(null);
      
      // Формируем данные заказа
      const orderData = {
        meals: cartItems.map(item => ({
          meal: item.meal._id,
          quantity: item.quantity,
        })),
        deliveryAddress: {
          street: data.street,
          city: data.city,
          zipCode: data.zipCode,
          country: data.country,
        },
        deliveryDate: data.deliveryDate,
        deliveryTime: data.deliveryTime,
        paymentMethod: data.paymentMethod,
      };
      
      // Отправляем заказ на сервер
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify(orderData),
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.message || 'Ошибка при оформлении заказа');
      }
      
      // Очищаем корзину и перенаправляем на страницу успешного оформления заказа
      clearCart();
      navigate(`/orders/${responseData._id}?success=true`);
    } catch (err) {
      setError(err.message);
      console.error('Ошибка при оформлении заказа:', err);
    } finally {
      setLoading(false);
    }
  };
  
  if (!userInfo || cartItems.length === 0) {
    return null; // Ничего не рендерим, пока идет перенаправление
  }
  
  return (
    <div className="checkout-page">
      <div className="checkout-header">
        <h1>Оформление заказа</h1>
      </div>
      
      {error && (
        <div className="alert alert-danger">{error}</div>
      )}
      
      <div className="checkout-content">
        <form className="checkout-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-section">
            <h2>Данные получателя</h2>
            
            <div className="form-group">
              <label htmlFor="name">ФИО</label>
              <input
                type="text"
                id="name"
                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                {...register('name', { required: 'ФИО обязательно к заполнению' })}
              />
              {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
            </div>
          </div>
          
          <div className="form-section">
            <h2>Адрес доставки</h2>
            
            <div className="form-group">
              <label htmlFor="street">Улица и номер дома</label>
              <input
                type="text"
                id="street"
                className={`form-control ${errors.street ? 'is-invalid' : ''}`}
                {...register('street', { required: 'Улица и номер дома обязательны к заполнению' })}
              />
              {errors.street && <div className="invalid-feedback">{errors.street.message}</div>}
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">Город</label>
                <input
                  type="text"
                  id="city"
                  className={`form-control ${errors.city ? 'is-invalid' : ''}`}
                  {...register('city', { required: 'Город обязателен к заполнению' })}
                />
                {errors.city && <div className="invalid-feedback">{errors.city.message}</div>}
              </div>
              
              <div className="form-group">
                <label htmlFor="zipCode">Почтовый индекс</label>
                <input
                  type="text"
                  id="zipCode"
                  className={`form-control ${errors.zipCode ? 'is-invalid' : ''}`}
                  {...register('zipCode', { required: 'Почтовый индекс обязателен к заполнению' })}
                />
                {errors.zipCode && <div className="invalid-feedback">{errors.zipCode.message}</div>}
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="country">Страна</label>
              <input
                type="text"
                id="country"
                className="form-control"
                defaultValue="Россия"
                {...register('country')}
              />
            </div>
          </div>
          
          <div className="form-section">
            <h2>Дата и время доставки</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="deliveryDate">Дата доставки</label>
                <input
                  type="date"
                  id="deliveryDate"
                  className={`form-control ${errors.deliveryDate ? 'is-invalid' : ''}`}
                  min={getMinDeliveryDate()}
                  max={getMaxDeliveryDate()}
                  {...register('deliveryDate', { required: 'Выберите дату доставки' })}
                />
                {errors.deliveryDate && <div className="invalid-feedback">{errors.deliveryDate.message}</div>}
              </div>
              
              <div className="form-group">
                <label htmlFor="deliveryTime">Время доставки</label>
                <select
                  id="deliveryTime"
                  className={`form-control ${errors.deliveryTime ? 'is-invalid' : ''}`}
                  {...register('deliveryTime', { required: 'Выберите время доставки' })}
                >
                  <option value="">Выберите время</option>
                  <option value="10:00-12:00">10:00 - 12:00</option>
                  <option value="12:00-14:00">12:00 - 14:00</option>
                  <option value="14:00-16:00">14:00 - 16:00</option>
                  <option value="16:00-18:00">16:00 - 18:00</option>
                  <option value="18:00-20:00">18:00 - 20:00</option>
                  <option value="20:00-22:00">20:00 - 22:00</option>
                </select>
                {errors.deliveryTime && <div className="invalid-feedback">{errors.deliveryTime.message}</div>}
              </div>
            </div>
          </div>
          
          <div className="form-section">
            <h2>Способ оплаты</h2>
            
            <div className="payment-methods">
              <div className="payment-method">
                <input
                  type="radio"
                  id="card"
                  value="Карта"
                  {...register('paymentMethod', { required: 'Выберите способ оплаты' })}
                />
                <label htmlFor="card">
                  <div className="payment-method-icon">
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                      <line x1="1" y1="10" x2="23" y2="10"></line>
                    </svg>
                  </div>
                  <div className="payment-method-content">
                    <span className="payment-method-title">Оплата картой</span>
                    <span className="payment-method-description">Оплата при получении банковской картой</span>
                  </div>
                </label>
              </div>
              
              <div className="payment-method">
                <input
                  type="radio"
                  id="cash"
                  value="Наличные при получении"
                  {...register('paymentMethod', { required: 'Выберите способ оплаты' })}
                />
                <label htmlFor="cash">
                  <div className="payment-method-icon">
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="6" width="20" height="12" rx="2"></rect>
                      <circle cx="12" cy="12" r="2"></circle>
                      <path d="M6 12h.01M18 12h.01"></path>
                    </svg>
                  </div>
                  <div className="payment-method-content">
                    <span className="payment-method-title">Оплата наличными</span>
                    <span className="payment-method-description">Оплата наличными при получении</span>
                  </div>
                </label>
              </div>
            </div>
            {errors.paymentMethod && <div className="invalid-feedback">{errors.paymentMethod.message}</div>}
          </div>
          
          <button 
            type="submit" 
            className="btn btn-block place-order-btn"
            disabled={loading}
          >
            {loading ? 'Оформление заказа...' : 'Оформить заказ'}
          </button>
        </form>
        
        <div className="order-summary">
          <h2>Ваш заказ</h2>
          
          <div className="order-items">
            {cartItems.map(item => (
              <div key={item.meal._id} className="order-item">
                <div className="order-item-info">
                  <span className="order-item-quantity">{item.quantity} ×</span>
                  <span className="order-item-name">{item.meal.name}</span>
                </div>
                <span className="order-item-price">{item.meal.price * item.quantity} ₽</span>
              </div>
            ))}
          </div>
          
          <div className="order-total">
            <span>Итого</span>
            <span>{getTotalPrice()} ₽</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;