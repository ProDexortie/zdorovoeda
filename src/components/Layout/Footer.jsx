import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-logo">
          <Link to="/">
            <h2>ЗдоровоЕда</h2>
          </Link>
          <p className="tagline">Персонализированное здоровое питание с доставкой</p>
        </div>

        <div className="footer-links">
          <div className="footer-section">
            <h3>Меню</h3>
            <ul>
              <li><Link to="/">Главная</Link></li>
              <li><Link to="/meal-plan">Рацион</Link></li>
              <li><Link to="/profile">Мой профиль</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Информация</h3>
            <ul>
              <li><Link to="/about">О нас</Link></li>
              <li><Link to="/delivery">Доставка</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Контакты</h3>
            <ul>
              <li><a href="tel:+79123456789">+7 (912) 345-67-89</a></li>
              <li><a href="mailto:info@zdorovoeda.ru">info@zdorovoeda.ru</a></li>
            </ul>
            <div className="social-icons">
              <a href="https://vk.com" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="https://telegram.org" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.2 7.78l-2.85 13.5c-.15.67-.8 1.09-1.45.93l-9.5-2.54c-.5-.13-.91-.51-1.09-1L3.1 10.33c-.36-1.02.24-2.12 1.26-2.48l15.5-5.67c1.02-.36 2.12.24 2.48 1.26.11.3.11.63 0 .92l-1.14 3.42z"></path>
                  <path d="M10.5 14.5l-2-2"></path>
                  <path d="M14 11l-7.5 4.5"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <p>&copy; {currentYear} ЗдоровоЕда. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;