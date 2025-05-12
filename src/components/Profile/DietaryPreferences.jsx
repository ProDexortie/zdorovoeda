import React, { useState, useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../../context/AuthContext';
import './DietaryPreferences.css';

const DietaryPreferences = () => {
  const { userInfo, updateProfile, isLoading, error } = useContext(AuthContext);
  const [successMessage, setSuccessMessage] = useState('');
  
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  
  // Заполняем форму данными пользователя при загрузке
  useEffect(() => {
    if (userInfo && userInfo.dietaryPreferences) {
      const prefs = userInfo.dietaryPreferences;
      
      setValue('calories', prefs.calories || 2000);
      setValue('goals', prefs.goals || 'Здоровое питание');
      
      if (prefs.restrictions && prefs.restrictions.length > 0) {
        prefs.restrictions.forEach(restriction => {
          setValue(`restrictions.${restriction}`, true);
        });
      }
      
      if (prefs.allergies && prefs.allergies.length > 0) {
        setValue('allergies', prefs.allergies.join(', '));
      }
    }
  }, [userInfo, setValue]);
  
  const onSubmit = async (data) => {
    const restrictionsArray = Object.entries(data.restrictions || {})
      .filter(([_, value]) => value)
      .map(([key]) => key);
    
    const allergiesArray = data.allergies
      ? data.allergies.split(',').map(allergy => allergy.trim()).filter(Boolean)
      : [];
    
    const updatedDietaryPreferences = {
      calories: parseInt(data.calories, 10),
      goals: data.goals,
      restrictions: restrictionsArray,
      allergies: allergiesArray,
    };
    
    try {
      await updateProfile({ dietaryPreferences: updatedDietaryPreferences });
      setSuccessMessage('Диетические предпочтения успешно обновлены');
      
      // Скрываем сообщение об успехе через 3 секунды
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      console.error('Ошибка при обновлении диетических предпочтений:', err);
    }
  };
  
  return (
    <form className="dietary-preferences-form" onSubmit={handleSubmit(onSubmit)}>
      <h2>Диетические предпочтения</h2>
      
      {successMessage && (
        <div className="alert alert-success">{successMessage}</div>
      )}
      
      {error && (
        <div className="alert alert-danger">{error}</div>
      )}
      
      <div className="form-group">
        <label htmlFor="calories" className="form-label">Целевое количество калорий в день</label>
        <input
          type="number"
          id="calories"
          className={`form-control ${errors.calories ? 'is-invalid' : ''}`}
          {...register('calories', {
            required: 'Это поле обязательно к заполнению',
            min: {
              value: 1000,
              message: 'Минимальное значение 1000 ккал',
            },
            max: {
              value: 5000,
              message: 'Максимальное значение 5000 ккал',
            },
          })}
        />
        {errors.calories && <div className="invalid-feedback">{errors.calories.message}</div>}
      </div>
      
      <div className="form-group">
        <label htmlFor="goals" className="form-label">Цель питания</label>
        <select
          id="goals"
          className="form-control"
          {...register('goals')}
        >
          <option value="Здоровое питание">Здоровое питание</option>
          <option value="Похудение">Похудение</option>
          <option value="Набор массы">Набор массы</option>
          <option value="Поддержание веса">Поддержание веса</option>
        </select>
      </div>
      
      <div className="form-group">
        <label className="form-label">Диетические ограничения</label>
        <div className="dietary-restrictions">
          <div className="restriction-option">
            <input
              type="checkbox"
              id="vegan"
              {...register('restrictions.Веган')}
            />
            <label htmlFor="vegan">Веган</label>
          </div>
          <div className="restriction-option">
            <input
              type="checkbox"
              id="vegetarian"
              {...register('restrictions.Вегетарианец')}
            />
            <label htmlFor="vegetarian">Вегетарианец</label>
          </div>
          <div className="restriction-option">
            <input
              type="checkbox"
              id="gluten-free"
              {...register('restrictions.Без глютена')}
            />
            <label htmlFor="gluten-free">Без глютена</label>
          </div>
          <div className="restriction-option">
            <input
              type="checkbox"
              id="lactose-free"
              {...register('restrictions.Без лактозы')}
            />
            <label htmlFor="lactose-free">Без лактозы</label>
          </div>
          <div className="restriction-option">
            <input
              type="checkbox"
              id="nut-free"
              {...register('restrictions.Без орехов')}
            />
            <label htmlFor="nut-free">Без орехов</label>
          </div>
          <div className="restriction-option">
            <input
              type="checkbox"
              id="seafood-free"
              {...register('restrictions.Без морепродуктов')}
            />
            <label htmlFor="seafood-free">Без морепродуктов</label>
          </div>
        </div>
      </div>
      
      <div className="form-group">
        <label htmlFor="allergies" className="form-label">Аллергии (через запятую)</label>
        <textarea
          id="allergies"
          className="form-control"
          placeholder="Например: клубника, киви, арахис"
          {...register('allergies')}
        ></textarea>
      </div>
      
      <button 
        type="submit" 
        className="btn btn-block" 
        disabled={isLoading}
      >
        {isLoading ? 'Обновление...' : 'Сохранить предпочтения'}
      </button>
    </form>
  );
};

export default DietaryPreferences;