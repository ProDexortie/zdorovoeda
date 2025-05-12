import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './OrderHistoryPage.css';

const OrderHistoryPage = () => {
  const { userInfo } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Перенаправление, если пользователь не авторизован
  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    }
  }, [userInfo, navigate]);
  
  // Получение истории заказов
  useEffect(() => {
    const fetchOrders = async () => {
      if (!userInfo) return;
      
      try {
        setLoading(true);
        
        const response = await fetch('/api/orders/myorders', {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Ошибка при получении заказов');
        }
        
        setOrders(data);
      } catch (err) {
        setError(err.message);
        console.error('Ошибка:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, [userInfo]);
  
  // Форматирование даты
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
  };
  
  // Получение статуса заказа с соответствующим классом CSS
  const getStatusClass = (status) => {
    switch (status) {
      case 'Обрабатывается':
        return 'status-processing';
      case 'Подтвержден':
        return 'status-confirmed';
      case 'Готовится':
        return 'status-preparing';
      case 'Доставляется':
        return 'status-delivering';
      case 'Доставлен':
        return 'status-delivered';
      case 'Отменен':
        return 'status-cancelled';
      default:
        return '';
    }
  };
  
  if (!userInfo) {
    return null; // Ничего не рендерим, пока идет перенаправление
  }
  
  return (
    <div className="order-history-page">
      <div className="order-history-header">
        <h1>История заказов</h1>
      </div>
      
      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Загрузка заказов...</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : orders.length === 0 ? (
        <div className="no-orders-message">
          <h3>У вас пока нет заказов</h3>
          <p>Выберите блюда из нашего меню и сделайте первый заказ</p>
          <Link to="/meal-plan" className="btn">Перейти в меню</Link>
        </div>
      ) : (
        <div className="orders-container">
          {orders.map(order => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div className="order-id">
                  <h3>Заказ #{order._id.substring(order._id.length - 6)}</h3>
                  <span className="order-date">{formatDate(order.createdAt)}</span>
                </div>
                <div className={`order-status ${getStatusClass(order.status)}`}>
                  {order.status}
                </div>
              </div>
              
              <div className="order-items">
                {order.meals.map((item, index) => (
                  <div key={index} className="order-item">
                    <div className="order-item-image">
                      <img src={item.meal.imageUrl} alt={item.meal.name} />
                    </div>
                    <div className="order-item-details">
                      <Link to={`/meals/${item.meal._id}`} className="order-item-name">
                        {item.meal.name}
                      </Link>
                      <div className="order-item-meta">
                        <span className="order-item-quantity">Количество: {item.quantity}</span>
                        <span className="order-item-price">{item.meal.price} ₽ / шт.</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="order-footer">
                <div className="order-delivery">
                  <h4>Информация о доставке</h4>
                  <p>
                    {order.deliveryAddress.street}, {order.deliveryAddress.city}, {order.deliveryAddress.zipCode}
                  </p>
                  <p>
                    Дата: {formatDate(order.deliveryDate)} | Время: {order.deliveryTime}
                  </p>
                </div>
                
                <div className="order-summary">
                  <div className="order-payment">
                    <span className="order-payment-method">Оплата: {order.paymentMethod}</span>
                    <span className={`order-payment-status ${order.paymentStatus === 'Оплачено' ? 'paid' : ''}`}>
                      {order.paymentStatus}
                    </span>
                  </div>
                  <div className="order-total">
                    <span>Итого:</span>
                    <span className="order-total-price">{order.totalPrice} ₽</span>
                  </div>
                </div>
              </div>
              
              <div className="order-actions">
                <Link to={`/orders/${order._id}`} className="btn btn-outline">
                  Детали заказа
                </Link>
                {(order.status === 'Обрабатывается' || order.status === 'Подтвержден') && (
                  <button className="btn btn-outline cancel-order-btn">
                    Отменить заказ
                  </button>
                )}
                {order.status === 'Доставлен' && (
                  <button className="btn reorder-btn">
                    Повторить заказ
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;