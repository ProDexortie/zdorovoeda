import React, { useState, useEffect } from 'react';
import MealCard from './MealCard';
import './MealList.css';

const MealList = ({ title, meals, loading, error, filters = true }) => {
  const [filteredMeals, setFilteredMeals] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  
  useEffect(() => {
    setFilteredMeals(meals);
  }, [meals]);
  
  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    
    if (filter === 'all') {
      setFilteredMeals(meals);
    } else {
      const filtered = meals.filter(meal => meal.mealType === filter);
      setFilteredMeals(filtered);
    }
  };
  
  return (
    <div className="meal-list-container">
      {title && <h2 className="meal-list-title">{title}</h2>}
      
      {filters && (
        <div className="meal-filters">
          <button 
            className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => handleFilterChange('all')}
          >
            Все блюда
          </button>
          <button 
            className={`filter-btn ${activeFilter === 'Завтрак' ? 'active' : ''}`}
            onClick={() => handleFilterChange('Завтрак')}
          >
            Завтраки
          </button>
          <button 
            className={`filter-btn ${activeFilter === 'Обед' ? 'active' : ''}`}
            onClick={() => handleFilterChange('Обед')}
          >
            Обеды
          </button>
          <button 
            className={`filter-btn ${activeFilter === 'Ужин' ? 'active' : ''}`}
            onClick={() => handleFilterChange('Ужин')}
          >
            Ужины
          </button>
          <button 
            className={`filter-btn ${activeFilter === 'Перекус' ? 'active' : ''}`}
            onClick={() => handleFilterChange('Перекус')}
          >
            Перекусы
          </button>
        </div>
      )}
      
      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Загрузка блюд...</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : filteredMeals.length === 0 ? (
        <div className="no-meals-message">
          <p>Блюда по выбранным критериям не найдены</p>
        </div>
      ) : (
        <div className="meals-grid">
          {filteredMeals.map(meal => (
            <div key={meal._id} className="meal-grid-item">
              <MealCard meal={meal} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MealList;