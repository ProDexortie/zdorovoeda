import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { CartContext } from '../../context/CartContext';
import './Header.css';

const Header = () => {
  const { userInfo, logout } = useContext(AuthContext);
  const { getTotalItems } = useContext(CartContext);
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="header">
      <div className="container header-container">
        <div className="logo">
          <Link to="/">
            <h1>ЗдоровоЕда</h1>
          </Link>
        </div>
        
        {/* Мобильное меню кнопка */}
        <button 
          className="mobile-menu-button" 
          onClick={toggleMobileMenu}
          aria-label={mobileMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
        >
          <span className={`hamburger ${mobileMenuOpen ? 'open' : ''}`}></span>
        </button>
        
        {/* Навигация */}
        <nav className={`nav-menu ${mobileMenuOpen ? 'open' : ''}`}>
          <ul className="nav-list">
            <li className="nav-item">
              <Link to="/" onClick={() => setMobileMenuOpen(false)}>Главная</Link>
            </li>
            <li className="nav-item">
              <Link to="/meal-plan" onClick={() => setMobileMenuOpen(false)}>Рацион</Link>
            </li>
            {userInfo ? (
              <>
                <li className="nav-item">
                  <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>Профиль</Link>
                </li>
                <li className="nav-item">
                  <Link to="/orders" onClick={() => setMobileMenuOpen(false)}>Заказы</Link>
                </li>
                {userInfo.role === 'admin' && (
                  <li className="nav-item">
                    <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>Админ</Link>
                  </li>
                )}
                <li className="nav-item">
                  <button className="nav-link-button" onClick={handleLogout}>
                    Выйти
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>Войти</Link>
                </li>
                <li className="nav-item">
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)}>Регистрация</Link>
                </li>
              </>
            )}
            <li className="nav-item cart-icon">
              <Link to="/cart" onClick={() => setMobileMenuOpen(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                {getTotalItems() > 0 && (
                  <span className="cart-badge">{getTotalItems()}</span>
                )}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;