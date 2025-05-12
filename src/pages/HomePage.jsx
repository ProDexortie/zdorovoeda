import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import MealList from '../components/Meals/MealList';
import './HomePage.css';

const HomePage = () => {
  const { userInfo } = useContext(AuthContext);
  const [featuredMeals, setFeaturedMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Получение рекомендуемых блюд
  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await fetch('/api/meals');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Ошибка при получении блюд');
        }

        setFeaturedMeals(data.meals || []);
      } catch (err) {
        setError(err.message);
        console.error('Ошибка:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMeals();
  }, []);

  return (
    <div className="home-page">
      {/* Hero секция */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Персонализированное здоровое питание</h1>
          <p>Подберите идеальный рацион с учетом ваших предпочтений и целей</p>
          <div className="hero-buttons">
            {userInfo ? (
              <Link to="/meal-plan" className="btn btn-lg">Мой рацион</Link>
            ) : (
              <Link to="/register" className="btn btn-lg">Начать сейчас</Link>
            )}
            <a href="#how-it-works" className="btn btn-outline btn-lg">Как это работает</a>
          </div>
        </div>
        <div className="hero-image"></div>
      </section>

      {/* Как это работает */}
      <section id="how-it-works" className="how-it-works-section">
        <h2 className="section-title">Как это работает</h2>
        <div className="steps-container">
          <div className="step-card">
            <div className="step-icon">1</div>
            <h3>Создайте профиль</h3>
            <p>Укажите ваши предпочтения, диетические ограничения и цели питания</p>
          </div>
          <div className="step-card">
            <div className="step-icon">2</div>
            <h3>Получите рекомендации</h3>
            <p>Наша система подберет для вас идеальный рацион питания</p>
          </div>
          <div className="step-card">
            <div className="step-icon">3</div>
            <h3>Заказывайте блюда</h3>
            <p>Выбирайте блюда из рекомендованного рациона и оформляйте доставку</p>
          </div>
          <div className="step-card">
            <div className="step-icon">4</div>
            <h3>Наслаждайтесь</h3>
            <p>Получайте свежие и вкусные блюда прямо к вашей двери</p>
          </div>
        </div>
      </section>

      {/* Популярные блюда */}
      <section className="featured-meals-section">
        <h2 className="section-title">Популярные блюда</h2>
        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Загрузка блюд...</p>
          </div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : featuredMeals.length > 0 ? (
          <MealList meals={featuredMeals.slice(0, 8)} loading={false} error={null} filters={false} />
        ) : (
          <p className="no-meals-message">Популярные блюда не найдены</p>
        )}
        <div className="view-all-container">
          <Link to="/meal-plan" className="btn">Посмотреть все блюда</Link>
        </div>
      </section>

      {/* Преимущества */}
      <section className="benefits-section">
        <h2 className="section-title">Почему выбирают нас</h2>
        <div className="benefits-container">
          <div className="benefit-card">
            <div className="benefit-icon">
              <svg viewBox="0 0 24 24" width="48" height="48" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <h3>Качественные ингредиенты</h3>
            <p>Мы используем только свежие и качественные ингредиенты для приготовления наших блюд</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">
              <svg viewBox="0 0 24 24" width="48" height="48" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
            <h3>Быстрая доставка</h3>
            <p>Доставляем заказы в удобное для вас время с точностью до минуты</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">
              <svg viewBox="0 0 24 24" width="48" height="48" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </div>
            <h3>Индивидуальный подход</h3>
            <p>Учитываем все ваши пожелания и диетические ограничения при подборе рациона</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">
              <svg viewBox="0 0 24 24" width="48" height="48" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <h3>Профессиональная команда</h3>
            <p>Наши шеф-повара и диетологи создают блюда, которые не только полезны, но и вкусны</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Готовы начать свой путь к здоровому питанию?</h2>
          <p>Присоединяйтесь к тысячам людей, которые уже улучшили свой рацион с нашим сервисом</p>
          {userInfo ? (
            <Link to="/meal-plan" className="btn btn-lg">Перейти к рациону</Link>
          ) : (
            <Link to="/register" className="btn btn-lg">Зарегистрироваться</Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;