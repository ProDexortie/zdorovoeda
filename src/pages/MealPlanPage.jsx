import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import MealList from '../components/Meals/MealList';
import './MealPlanPage.css';

const MealPlanPage = () => {
  const { userInfo } = useContext(AuthContext);
  const [meals, setMeals] = useState([]);
  const [recommendedMeals, setRecommendedMeals] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  
  // Получение всех блюд
  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await fetch('/api/meals');
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Ошибка при получении блюд');
        }
        
        setMeals(data.meals || []);
      } catch (err) {
        setError(err.message);
        console.error('Ошибка:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMeals();
  }, []);
  
  // Получение персонализированных рекомендаций для авторизованных пользователей
  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!userInfo) return;
      
      try {
        const response = await fetch('/api/meals/recommendations', {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Ошибка при получении рекомендаций');
        }
        
        setRecommendedMeals(data || {});
      } catch (err) {
        console.error('Ошибка при получении рекомендаций:', err);
      }
    };
    
    fetchRecommendations();
  }, [userInfo]);
  
  // Проверка наличия рекомендаций
  const hasRecommendations = userInfo && 
    Object.values(recommendedMeals).some(mealArray => mealArray && mealArray.length > 0);
  
  return (
    <div className="meal-plan-page">
      <div className="meal-plan-header">
        <h1>Меню блюд</h1>
        <p>Выбирайте из широкого ассортимента вкусных и полезных блюд</p>
      </div>
      
      <div className="meal-plan-tabs">
        <button 
          className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          Все блюда
        </button>
        {userInfo && (
          <button 
            className={`tab-button ${activeTab === 'recommended' ? 'active' : ''}`}
            onClick={() => setActiveTab('recommended')}
          >
            Рекомендуемые блюда
          </button>
        )}
      </div>
      
      {activeTab === 'all' ? (
        <div className="all-meals-container">
          <MealList title="Наши блюда" meals={meals} loading={loading} error={error} />
        </div>
      ) : (
        <div className="recommended-meals-container">
          {!userInfo ? (
            <div className="auth-required-message">
              <h3>Для получения персонализированных рекомендаций требуется авторизация</h3>
              <p>Войдите в свой аккаунт или зарегистрируйтесь, чтобы получить индивидуальные рекомендации блюд.</p>
              <div className="auth-buttons">
                <Link to="/login" className="btn">Войти</Link>
                <Link to="/register" className="btn btn-outline">Зарегистрироваться</Link>
              </div>
            </div>
          ) : !hasRecommendations ? (
            <div className="no-recommendations-message">
              <h3>У вас пока нет персональных рекомендаций</h3>
              <p>Для получения рекомендаций заполните информацию о ваших диетических предпочтениях в профиле.</p>
              <Link to="/profile" className="btn">Перейти в профиль</Link>
            </div>
          ) : (
            <>
              {recommendedMeals.breakfast && recommendedMeals.breakfast.length > 0 && (
                <MealList 
                  title="Рекомендуемые завтраки" 
                  meals={recommendedMeals.breakfast} 
                  loading={false} 
                  error={null} 
                  filters={false} 
                />
              )}
              
              {recommendedMeals.lunch && recommendedMeals.lunch.length > 0 && (
                <MealList 
                  title="Рекомендуемые обеды" 
                  meals={recommendedMeals.lunch} 
                  loading={false} 
                  error={null} 
                  filters={false} 
                />
              )}
              
              {recommendedMeals.dinner && recommendedMeals.dinner.length > 0 && (
                <MealList 
                  title="Рекомендуемые ужины" 
                  meals={recommendedMeals.dinner} 
                  loading={false} 
                  error={null} 
                  filters={false} 
                />
              )}
              
              {recommendedMeals.snacks && recommendedMeals.snacks.length > 0 && (
                <MealList 
                  title="Рекомендуемые перекусы" 
                  meals={recommendedMeals.snacks} 
                  loading={false} 
                  error={null} 
                  filters={false} 
                />
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default MealPlanPage;