import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import './CartPage.css';

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useContext(CartContext);
  const { userInfo } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const handleQuantityChange = (mealId, newQuantity) => {
    updateQuantity(mealId, newQuantity);
  };
  
  const handleRemoveItem = (mealId) => {
    removeFromCart(mealId);
  };
  
  const handleCheckout = () => {
    if (!userInfo) {
      navigate('/login?redirect=checkout');
    } else {
      navigate('/checkout');
    }
  };
  
  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1>Корзина</h1>
      </div>
      
      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <div className="empty-cart-icon">
            <svg viewBox="0 0 24 24" width="64" height="64" stroke="currentColor" strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
          </div>
          <h2>Ваша корзина пуста</h2>
          <p>Добавьте блюда в корзину, чтобы оформить заказ</p>
          <Link to="/meal-plan" className="btn">Перейти к меню</Link>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items">
            <div className="cart-items-header">
              <div className="cart-column cart-product">Блюдо</div>
              <div className="cart-column cart-price">Цена</div>
              <div className="cart-column cart-quantity">Количество</div>
              <div className="cart-column cart-total">Сумма</div>
              <div className="cart-column cart-actions"></div>
            </div>
            
            {cartItems.map(item => (
              <div key={item.meal._id} className="cart-item">
                <div className="cart-product">
                  <Link to={`/meals/${item.meal._id}`} className="cart-product-image">
                    <img src={item.meal.imageUrl} alt={item.meal.name} />
                  </Link>
                  <div className="cart-product-info">
                    <Link to={`/meals/${item.meal._id}`} className="cart-product-name">
                      {item.meal.name}
                    </Link>
                    <div className="cart-product-meta">
                      <span className="cart-product-type">{item.meal.mealType}</span>
                      {item.meal.dietaryCategories && item.meal.dietaryCategories.length > 0 && (
                        <span className="cart-product-diet">{item.meal.dietaryCategories.join(', ')}</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="cart-price">
                  {item.meal.price} ₽
                </div>
                
                <div className="cart-quantity">
                  <div className="quantity-control">
                    <button 
                      className="quantity-btn"
                      onClick={() => handleQuantityChange(item.meal._id, item.quantity - 1)}
                      aria-label="Уменьшить количество"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item.meal._id, parseInt(e.target.value) || 1)}
                      min="1"
                      max="20"
                      className="quantity-input"
                    />
                    <button 
                      className="quantity-btn"
                      onClick={() => handleQuantityChange(item.meal._id, item.quantity + 1)}
                      aria-label="Увеличить количество"
                    >
                      +
                    </button>
                  </div>
                </div>
                
                <div className="cart-total">
                  {item.meal.price * item.quantity} ₽
                </div>
                
                <div className="cart-actions">
                  <button 
                    className="remove-btn"
                    onClick={() => handleRemoveItem(item.meal._id)}
                    aria-label="Удалить из корзины"
                  >
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      <line x1="10" y1="11" x2="10" y2="17"></line>
                      <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
            
            <div className="cart-actions-buttons">
              <Link to="/meal-plan" className="btn btn-outline">
                Продолжить покупки
              </Link>
              <button className="btn btn-outline clear-cart-btn" onClick={clearCart}>
                Очистить корзину
              </button>
            </div>
          </div>
          
          <div className="cart-summary">
            <h3>Итого</h3>
            
            <div className="summary-row">
              <span>Блюда ({cartItems.reduce((acc, item) => acc + item.quantity, 0)})</span>
              <span>{getTotalPrice()} ₽</span>
            </div>
            
            <div className="summary-row">
              <span>Доставка</span>
              <span>Бесплатно</span>
            </div>
            
            <div className="summary-total">
              <span>Общая сумма</span>
              <span>{getTotalPrice()} ₽</span>
            </div>
            
            <button 
              className="btn btn-block proceed-btn"
              onClick={handleCheckout}
            >
              Оформить заказ
            </button>
            
            {!userInfo && (
              <div className="cart-auth-notice">
                <p>Для оформления заказа необходимо войти в аккаунт</p>
                <div className="auth-links">
                  <Link to="/login?redirect=checkout">Войти</Link>
                  <span> или </span>
                  <Link to="/register?redirect=checkout">Зарегистрироваться</Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;