import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ProfileForm from '../components/Profile/ProfileForm';
import './ProfilePage.css';

const ProfilePage = () => {
  const { userInfo } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // Если пользователь не авторизован, перенаправляем на страницу входа
  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    }
  }, [userInfo, navigate]);
  
  if (!userInfo) {
    return null; // Ничего не рендерим, пока идет перенаправление
  }
  
  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>Мой профиль</h1>
        <p>Управляйте своими данными и предпочтениями питания</p>
      </div>
      
      <ProfileForm />
    </div>
  );
};

export default ProfilePage;