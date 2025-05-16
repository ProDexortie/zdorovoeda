import React, { useState } from 'react';
import './AddMealModal.css';

const AddMealModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageUrl: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    ingredients: [],
    dietaryCategories: [],
    mealType: 'Завтрак',
    preparationTime: '',
    price: '',
    available: true
  });

  const [currentIngredient, setCurrentIngredient] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Категории диетических ограничений
  const dietaryOptions = [
    'Веган', 'Вегетарианец', 'Без глютена', 'Без лактозы', 'Без орехов', 'Без морепродуктов'
  ];

  // Обработчик изменения полей формы
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      if (name.startsWith('dietary-')) {
        const category = name.replace('dietary-', '');
        
        if (checked) {
          setFormData({
            ...formData,
            dietaryCategories: [...formData.dietaryCategories, category]
          });
        } else {
          setFormData({
            ...formData,
            dietaryCategories: formData.dietaryCategories.filter(item => item !== category)
          });
        }
      } else {
        setFormData({
          ...formData,
          [name]: checked
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  // Добавление ингредиента
  const addIngredient = () => {
    if (currentIngredient.trim()) {
      setFormData({
        ...formData,
        ingredients: [...formData.ingredients, currentIngredient.trim()]
      });
      setCurrentIngredient('');
    }
  };

  // Удаление ингредиента
  const removeIngredient = (index) => {
    const updatedIngredients = [...formData.ingredients];
    updatedIngredients.splice(index, 1);
    setFormData({
      ...formData,
      ingredients: updatedIngredients
    });
  };

  // Отправка формы
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Проверка обязательных полей
    if (!formData.name || !formData.description || !formData.imageUrl || 
        !formData.calories || !formData.protein || !formData.carbs || 
        !formData.fat || formData.ingredients.length === 0 || 
        !formData.preparationTime || !formData.price) {
      setErrorMessage('Пожалуйста, заполните все обязательные поля');
      return;
    }

    // Преобразование числовых значений
    const mealData = {
      ...formData,
      calories: Number(formData.calories),
      protein: Number(formData.protein),
      carbs: Number(formData.carbs),
      fat: Number(formData.fat),
      preparationTime: Number(formData.preparationTime),
      price: Number(formData.price)
    };

    setIsLoading(true);
    try {
      await onSubmit(mealData);
      onClose(); // Закрываем модальное окно после успешного добавления
    } catch (error) {
      setErrorMessage(error.message || 'Произошла ошибка при добавлении блюда');
    } finally {
      setIsLoading(false);
    }
  };

  // Если модальное окно закрыто, не рендерим его содержимое
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Добавление нового блюда</h2>
          <button className="modal-close-btn" onClick={onClose}>
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <form className="meal-form" onSubmit={handleSubmit}>
          {errorMessage && (
            <div className="alert alert-danger">{errorMessage}</div>
          )}
          
          <div className="form-grid">
            <div className="form-section">
              <h3>Основная информация</h3>
              
              <div className="form-group">
                <label htmlFor="name">Название*</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-control"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="description">Описание*</label>
                <textarea
                  id="description"
                  name="description"
                  className="form-control"
                  value={formData.description}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              
              <div className="form-group">
                <label htmlFor="imageUrl">URL изображения*</label>
                <input
                  type="url"
                  id="imageUrl"
                  name="imageUrl"
                  className="form-control"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="mealType">Тип блюда*</label>
                <select
                  id="mealType"
                  name="mealType"
                  className="form-control"
                  value={formData.mealType}
                  onChange={handleChange}
                  required
                >
                  <option value="Завтрак">Завтрак</option>
                  <option value="Обед">Обед</option>
                  <option value="Ужин">Ужин</option>
                  <option value="Перекус">Перекус</option>
                </select>
              </div>
            </div>
            
            <div className="form-section">
              <h3>Пищевая ценность</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="calories">Калории (ккал)*</label>
                  <input
                    type="number"
                    id="calories"
                    name="calories"
                    className="form-control"
                    value={formData.calories}
                    onChange={handleChange}
                    min="0"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="protein">Белки (г)*</label>
                  <input
                    type="number"
                    id="protein"
                    name="protein"
                    className="form-control"
                    value={formData.protein}
                    onChange={handleChange}
                    min="0"
                    step="0.1"
                    required
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="carbs">Углеводы (г)*</label>
                  <input
                    type="number"
                    id="carbs"
                    name="carbs"
                    className="form-control"
                    value={formData.carbs}
                    onChange={handleChange}
                    min="0"
                    step="0.1"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="fat">Жиры (г)*</label>
                  <input
                    type="number"
                    id="fat"
                    name="fat"
                    className="form-control"
                    value={formData.fat}
                    onChange={handleChange}
                    min="0"
                    step="0.1"
                    required
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="preparationTime">Время приготовления (мин)*</label>
                  <input
                    type="number"
                    id="preparationTime"
                    name="preparationTime"
                    className="form-control"
                    value={formData.preparationTime}
                    onChange={handleChange}
                    min="1"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="price">Цена (₽)*</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    className="form-control"
                    value={formData.price}
                    onChange={handleChange}
                    min="0"
                    step="10"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="form-section">
            <h3>Ингредиенты</h3>
            
            <div className="ingredients-container">
              <div className="ingredients-input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Введите ингредиент"
                  value={currentIngredient}
                  onChange={(e) => setCurrentIngredient(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addIngredient())}
                />
                <button
                  type="button"
                  className="btn btn-sm"
                  onClick={addIngredient}
                >
                  Добавить
                </button>
              </div>
              
              {formData.ingredients.length > 0 ? (
                <ul className="ingredients-list">
                  {formData.ingredients.map((ingredient, index) => (
                    <li key={index} className="ingredient-item">
                      <span>{ingredient}</span>
                      <button
                        type="button"
                        className="remove-ingredient-btn"
                        onClick={() => removeIngredient(index)}
                      >
                        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="no-ingredients-message">Добавьте ингредиенты для блюда</p>
              )}
            </div>
          </div>
          
          <div className="form-section">
            <h3>Диетические категории</h3>
            
            <div className="dietary-categories">
              {dietaryOptions.map((category, index) => (
                <div key={index} className="category-checkbox">
                  <input
                    type="checkbox"
                    id={`category-${index}`}
                    name={`dietary-${category}`}
                    checked={formData.dietaryCategories.includes(category)}
                    onChange={handleChange}
                  />
                  <label htmlFor={`category-${index}`}>{category}</label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="form-section">
            <div className="form-group checkbox-group">
              <input
                type="checkbox"
                id="available"
                name="available"
                checked={formData.available}
                onChange={handleChange}
              />
              <label htmlFor="available">Блюдо доступно для заказа</label>
            </div>
          </div>
          
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Отмена
            </button>
            <button
              type="submit"
              className="btn"
              disabled={isLoading}
            >
              {isLoading ? 'Сохранение...' : 'Сохранить блюдо'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMealModal;