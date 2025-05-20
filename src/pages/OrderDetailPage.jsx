import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './OrderDetailPage.css';

const OrderDetailPage = () => {
  const { id } = useParams();
  const { userInfo } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Check for success parameter in URL
  const success = new URLSearchParams(location.search).get('success') === 'true';
  
  // Redirect if not logged in
  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    }
  }, [userInfo, navigate]);
  
  // Fetch order details
  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!userInfo || !id) return;
      
      try {
        setLoading(true);
        
        const response = await fetch(`/api/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Ошибка при получении информации о заказе');
        }
        
        setOrder(data);
      } catch (err) {
        setError(err.message);
        console.error('Ошибка:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrderDetails();
  }, [userInfo, id]);
  
  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
  };
  
  // Get status class
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
    return null; // Don't render while redirecting
  }
  
  return (
    <div className="order-detail-page">
      <div className="order-detail-header">
        <h1>Информация о заказе</h1>
        {success && (
          <div className="alert alert-success">
            <h3>Заказ успешно оформлен!</h3>
            <p>Спасибо за ваш заказ. Мы отправим вам уведомление, когда он будет подтвержден.</p>
          </div>
        )}
      </div>
      
      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Загрузка информации о заказе...</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : order ? (
        <div className="order-detail-content">
          <div className="order-detail-card">
            <div className="order-header">
              <div className="order-id">
                <h2>Заказ #{order._id.substring(order._id.length - 6)}</h2>
                <span className="order-date">от {formatDate(order.createdAt)}</span>
              </div>
              <div className={`order-status ${getStatusClass(order.status)}`}>
                {order.status}
              </div>
            </div>
            
            <div className="order-items-section">
              <h3>Состав заказа</h3>
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
                    <div className="order-item-total">
                      {item.meal.price * item.quantity} ₽
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="order-delivery-section">
              <h3>Информация о доставке</h3>
              <div className="delivery-details">
                <div className="delivery-address">
                  <p><strong>Адрес доставки:</strong> {order.deliveryAddress.street}, {order.deliveryAddress.city}, {order.deliveryAddress.zipCode}</p>
                </div>
                <div className="delivery-time">
                  <p><strong>Дата:</strong> {formatDate(order.deliveryDate)}</p>
                  <p><strong>Время:</strong> {order.deliveryTime}</p>
                </div>
              </div>
            </div>
            
            <div className="order-payment-section">
              <h3>Оплата</h3>
              <div className="payment-details">
                <p><strong>Способ оплаты:</strong> {order.paymentMethod}</p>
                <p><strong>Статус оплаты:</strong> <span className={order.paymentStatus === 'Оплачено' ? 'paid' : ''}>{order.paymentStatus}</span></p>
              </div>
            </div>
            
            <div className="order-summary-section">
              <div className="order-total">
                <span>Итого:</span>
                <span className="order-total-price">{order.totalPrice} ₽</span>
              </div>
            </div>
            
            <div className="order-actions">
              <Link to="/orders" className="btn btn-outline">
                Вернуться к списку заказов
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
        </div>
      ) : (
        <div className="alert alert-warning">Заказ не найден</div>
      )}
    </div>
  );
};

export default OrderDetailPage;