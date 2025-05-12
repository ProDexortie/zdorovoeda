import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MealDetail from '../components/Meals/MealDetail';
import MealList from '../components/Meals/MealList';
import './MealDetailPage.css';

const MealDetailPage = () => {
  const { id } = useParams();
  const [meal, setMeal] = useState(null);
  const [similarMeals, setSimilarMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Получение информации о блюде по ID
  useEffect(() => {
    const fetchMeal = async () => {
      try {
        setLoading(true);
        
        const response = await fetch(`/api/meals/${id}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Ошибка при получении информации о блюде');
        }
        
        setMeal(data);
        
        // После получения информации о блюде, загружаем похожие блюда
        fetchSimilarMeals(data);
      } catch (err) {
        setError(err.message);
        console.error('Ошибка:', err);
      } finally {
        setLoading(false);
      }
    };
    
    const fetchSimilarMeals = async (currentMeal) => {
      if (!currentMeal) return;
      
      try {
        // Получаем все блюда того же типа
        const response = await fetch(`/api/meals?keyword=${currentMeal.mealType}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Ошибка при получении похожих блюд');
        }
        
        // Фильтруем, чтобы исключить текущее блюдо и ограничить до 4 блюд
        const filtered = data.meals
          .filter(m => m._id !== currentMeal._id)
          .slice(0, 4);
        
        setSimilarMeals(filtered);
      } catch (err) {
        console.error('Ошибка при получении похожих блюд:', err);
      }
    };
    
    if (id) {
      fetchMeal();
    }
  }, [id]);
  
  return (
    <div className="meal-detail-page">
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Загрузка информации о блюде...</p>
          </div>
        </div>
      ) : error ? (
        <div className="error-container">
          <div className="alert alert-danger">{error}</div>
        </div>
      ) : (
        <>
          <MealDetail meal={meal} />
          
          {similarMeals.length > 0 && (
            <div className="similar-meals-section">
              <h2 className="similar-meals-title">Похожие блюда</h2>
              <MealList meals={similarMeals} loading={false} error={null} filters={false} />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MealDetailPage;