import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import './MealCard.css';

const MealCard = ({ meal }) => {
  const { addToCart } = useContext(CartContext);

  const handleAddToCart = () => {
    addToCart(meal, 1);
  };

  return (
    <div className="meal-card">
      <div className="meal-card-image">
        <Link to={`/meals/${meal._id}`}>
          <img src={meal.imageUrl} alt={meal.name} />
        </Link>
        <div className="meal-type-badge">{meal.mealType}</div>
        {meal.dietaryCategories && meal.dietaryCategories.length > 0 && (
          <div className="meal-dietary-badges">
            {meal.dietaryCategories.map((category, index) => (
              <span key={index} className="dietary-badge">
                {category}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="meal-card-content">
        <Link to={`/meals/${meal._id}`} className="meal-title-link">
          <h3 className="meal-title">{meal.name}</h3>
        </Link>
        <p className="meal-description">{meal.description.length > 80 
          ? `${meal.description.substring(0, 80)}...` 
          : meal.description}</p>
        <div className="meal-nutrition">
          <span className="nutrition-item">
            <strong>{meal.calories}</strong> ккал
          </span>
          <span className="nutrition-item">
            <strong>Б:</strong> {meal.protein}г
          </span>
          <span className="nutrition-item">
            <strong>Ж:</strong> {meal.fat}г
          </span>
          <span className="nutrition-item">
            <strong>У:</strong> {meal.carbs}г
          </span>
        </div>
        <div className="meal-card-footer">
          <div className="meal-price">{meal.price} ₽</div>
          <button
            className="btn add-to-cart-btn"
            onClick={handleAddToCart}
            disabled={!meal.available}
          >
            {meal.available ? 'В корзину' : 'Нет в наличии'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MealCard;