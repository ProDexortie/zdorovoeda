import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import './MealDetail.css';

const MealDetail = ({ meal }) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useContext(CartContext);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    setQuantity(value < 1 ? 1 : value);
  };

  const handleAddToCart = () => {
    addToCart(meal, quantity);
  };

  if (!meal) {
    return <div className="loading-message">Загрузка...</div>;
  }

  return (
    <div className="meal-detail-container">
      <div className="meal-detail-breadcrumbs">
        <Link to="/">Главная</Link> &gt; <span>{meal.name}</span>
      </div>

      <div className="meal-detail-content">
        <div className="meal-detail-image-container">
          <img src={meal.imageUrl} alt={meal.name} className="meal-detail-image" />
          <div className="meal-detail-badges">
            <span className="meal-type-badge detail">{meal.mealType}</span>
            {meal.dietaryCategories && meal.dietaryCategories.map((category, index) => (
              <span key={index} className="dietary-badge detail">{category}</span>
            ))}
          </div>
        </div>

        <div className="meal-detail-info">
          <h1 className="meal-detail-title">{meal.name}</h1>
          <p className="meal-detail-description">{meal.description}</p>

          <div className="meal-nutrition-card">
            <h3>Пищевая ценность</h3>
            <div className="nutrition-grid">
              <div className="nutrition-item">
                <div className="nutrition-value">{meal.calories}</div>
                <div className="nutrition-label">ккал</div>
              </div>
              <div className="nutrition-item">
                <div className="nutrition-value">{meal.protein}</div>
                <div className="nutrition-label">белки (г)</div>
              </div>
              <div className="nutrition-item">
                <div className="nutrition-value">{meal.fat}</div>
                <div className="nutrition-label">жиры (г)</div>
              </div>
              <div className="nutrition-item">
                <div className="nutrition-value">{meal.carbs}</div>
                <div className="nutrition-label">углеводы (г)</div>
              </div>
            </div>
          </div>

          <div className="meal-ingredients">
            <h3>Состав:</h3>
            <ul className="ingredients-list">
              {meal.ingredients.map((ingredient, index) => (
                <li key={index} className="ingredient-item">{ingredient}</li>
              ))}
            </ul>
          </div>

          <div className="meal-preparation-time">
            <h3>Время приготовления:</h3>
            <p>{meal.preparationTime} минут</p>
          </div>

          <div className="meal-detail-purchase">
            <div className="meal-detail-price">{meal.price} ₽</div>
            
            <div className="quantity-control">
              <button 
                className="quantity-btn"
                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                aria-label="Уменьшить количество"
              >
                -
              </button>
              <input
                type="number"
                value={quantity}
                onChange={handleQuantityChange}
                min="1"
                max="20"
                className="quantity-input"
              />
              <button 
                className="quantity-btn"
                onClick={() => setQuantity(prev => prev + 1)}
                aria-label="Увеличить количество"
              >
                +
              </button>
            </div>
            
            <button
              className="btn btn-lg add-to-cart-btn"
              onClick={handleAddToCart}
              disabled={!meal.available}
            >
              {meal.available ? 'Добавить в корзину' : 'Нет в наличии'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealDetail;