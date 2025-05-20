import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import AddMealModal from '../components/Admin/AddMealModal';
import './AdminPage.css';

const AdminPage = () => {
  const { userInfo } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [meals, setMeals] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddMealModalOpen, setIsAddMealModalOpen] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  
  // Проверка наличия доступа администратора
  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
      return;
    }
    
    if (userInfo.role !== 'admin') {
      navigate('/');
    }
  }, [userInfo, navigate]);
  
  // Получение данных в зависимости от активной вкладки
  useEffect(() => {
    if (!userInfo || userInfo.role !== 'admin') return;
    
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        let endpoint;
        
        switch (activeTab) {
          case 'orders':
            endpoint = '/api/orders';
            break;
          case 'meals':
            endpoint = '/api/meals';
            break;
          case 'users':
            endpoint = '/api/users';
            break;
          default:
            endpoint = '/api/orders';
        }
        
        const response = await fetch(endpoint, {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Ошибка при получении данных');
        }
        
        switch (activeTab) {
          case 'orders':
            setOrders(data);
            break;
          case 'meals':
            setMeals(data.meals || []);
            break;
          case 'users':
            setUsers(data);
            break;
          default:
            setOrders(data);
        }
      } catch (err) {
        setError(err.message);
        console.error('Ошибка:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [activeTab, userInfo]);
  
  // Обработчик изменения статуса заказа
  const handleOrderStatusChange = async (orderId, newStatus) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Ошибка при обновлении статуса');
      }
      
      // Обновляем список заказов
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (err) {
      setError(err.message);
      console.error('Ошибка при обновлении статуса:', err);
    }
  };
  
  // Обработчик изменения статуса доступности блюда
  const handleMealAvailabilityChange = async (mealId, isAvailable) => {
    try {
      const response = await fetch(`/api/meals/${mealId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({ available: isAvailable }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Ошибка при обновлении доступности');
      }
      
      // Обновляем список блюд
      setMeals(meals.map(meal => 
        meal._id === mealId ? { ...meal, available: isAvailable } : meal
      ));
    } catch (err) {
      setError(err.message);
      console.error('Ошибка при обновлении доступности:', err);
    }
  };

  // Обработчик создания нового блюда
  const handleCreateMeal = async (mealData) => {
    try {
      const response = await fetch('/api/meals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify(mealData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Ошибка при создании блюда');
      }
      
      // Добавляем новое блюдо в список и закрываем модальное окно
      setMeals([...meals, data]);
      setIsAddMealModalOpen(false);
    } catch (err) {
      console.error('Ошибка при создании блюда:', err);
      throw err; // Перебрасываем ошибку, чтобы обработать ее в форме
    }
  };
  
  const handleEditMeal = async (mealId) => {
    try {
      // First, fetch the current meal data
      const response = await fetch(`/api/meals/${mealId}`, {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });

      const mealData = await response.json();

      if (!response.ok) {
        throw new Error(mealData.message || 'Ошибка при получении данных о блюде');
      }

      // Set up a state to hold the meal data and a modal flag
      setSelectedMeal(mealData);
      setShowEditModal(true);
    } catch (err) {
      setError(err.message);
      console.error('Ошибка при редактировании блюда:', err);
    }
  };

  const handleDeleteMeal = async (mealId) => {
    if (window.confirm('Вы уверены, что хотите удалить это блюдо?')) {
      try {
        const response = await fetch(`/api/meals/${mealId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Ошибка при удалении блюда');
        }

        // Remove the deleted meal from the state
        setMeals(meals.filter(meal => meal._id !== mealId));
      } catch (err) {
        setError(err.message);
        console.error('Ошибка при удалении блюда:', err);
      }
    }
  };
  
  // Форматирование даты
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
  };
  
  if (!userInfo || userInfo.role !== 'admin') {
    return null; // Ничего не рендерим, пока идет перенаправление
  }
  
  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Панель администратора</h1>
      </div>
      
      <div className="admin-tabs">
        <button 
          className={`tab-button ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Заказы
        </button>
        <button 
          className={`tab-button ${activeTab === 'meals' ? 'active' : ''}`}
          onClick={() => setActiveTab('meals')}
        >
          Блюда
        </button>
        <button 
          className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Пользователи
        </button>
      </div>
      
      {error && (
        <div className="alert alert-danger">{error}</div>
      )}
      
      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Загрузка данных...</p>
        </div>
      ) : (
        <div className="admin-content">
          {/* Вкладка "Заказы" */}
          {activeTab === 'orders' && (
            <div className="admin-orders">
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Покупатель</th>
                      <th>Дата</th>
                      <th>Сумма</th>
                      <th>Оплата</th>
                      <th>Статус</th>
                      <th>Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="no-data-message">Заказы не найдены</td>
                      </tr>
                    ) : (
                      orders.map(order => (
                        <tr key={order._id}>
                          <td>#{order._id.substring(order._id.length - 6)}</td>
                          <td>{order.user?.name || 'Нет данных'}</td>
                          <td>{formatDate(order.createdAt)}</td>
                          <td>{order.totalPrice} ₽</td>
                          <td>{order.paymentStatus}</td>
                          <td>
                            <span className={`status-badge ${order.status.toLowerCase()}`}>
                              {order.status}
                            </span>
                          </td>
                          <td>
                            <div className="table-actions">
                              <select 
                                value={order.status}
                                onChange={(e) => handleOrderStatusChange(order._id, e.target.value)}
                                className="status-select"
                              >
                                <option value="Обрабатывается">Обрабатывается</option>
                                <option value="Подтвержден">Подтвержден</option>
                                <option value="Готовится">Готовится</option>
                                <option value="Доставляется">Доставляется</option>
                                <option value="Доставлен">Доставлен</option>
                                <option value="Отменен">Отменен</option>
                              </select>
                              <button className="btn-icon view-btn" title="Просмотреть детали">
                                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                  <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {/* Вкладка "Блюда" */}
          {activeTab === 'meals' && (
            <div className="admin-meals">
              <div className="admin-section-header">
                <h2>Управление блюдами</h2>
                <button className="btn" onClick={() => setIsAddMealModalOpen(true)}>
                  Добавить новое блюдо
                </button>
              </div>
              
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Фото</th>
                      <th>Название</th>
                      <th>Тип</th>
                      <th>Цена</th>
                      <th>Калории</th>
                      <th>Статус</th>
                      <th>Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {meals.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="no-data-message">Блюда не найдены</td>
                      </tr>
                    ) : (
                      meals.map(meal => (
                        <tr key={meal._id}>
                          <td>
                            <div className="meal-thumbnail">
                              <img src={meal.imageUrl} alt={meal.name} />
                            </div>
                          </td>
                          <td>{meal.name}</td>
                          <td>{meal.mealType}</td>
                          <td>{meal.price} ₽</td>
                          <td>{meal.calories} ккал</td>
                          <td>
                            <span className={`status-badge ${meal.available ? 'available' : 'unavailable'}`}>
                              {meal.available ? 'Доступно' : 'Недоступно'}
                            </span>
                          </td>
                          <td>
                            <div className="table-actions">
                              <button 
                                className="btn-icon toggle-btn"
                                onClick={() => handleMealAvailabilityChange(meal._id, !meal.available)}
                                title={meal.available ? 'Сделать недоступным' : 'Сделать доступным'}
                              >
                                {meal.available ? (
                                  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="1" y="5" width="22" height="14" rx="7" ry="7"></rect>
                                    <circle cx="16" cy="12" r="3"></circle>
                                  </svg>
                                ) : (
                                  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="1" y="5" width="22" height="14" rx="7" ry="7"></rect>
                                    <circle cx="8" cy="12" r="3"></circle>
                                  </svg>
                                )}
                              </button>
                              <button className="btn-icon edit-btn" title="Редактировать" onClick={() => handleEditMeal(meal._id)}>
                                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                </svg>
                              </button>
                              <button className="btn-icon delete-btn" title="Удалить"onClick={() => handleDeleteMeal(meal._id)}>
                                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="3 6 5 6 21 6"></polyline>
                                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                  <line x1="10" y1="11" x2="10" y2="17"></line>
                                  <line x1="14" y1="11" x2="14" y2="17"></line>
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {/* Вкладка "Пользователи" */}
          {activeTab === 'users' && (
            <div className="admin-users">
              <div className="admin-section-header">
                <h2>Управление пользователями</h2>
              </div>
              
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Имя</th>
                      <th>Email</th>
                      <th>Роль</th>
                      <th>Дата регистрации</th>
                      <th>Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="no-data-message">Пользователи не найдены</td>
                      </tr>
                    ) : (
                      users.map(user => (
                        <tr key={user._id}>
                          <td>#{user._id.substring(user._id.length - 6)}</td>
                          <td>{user.name}</td>
                          <td>{user.email}</td>
                          <td>
                            <span className={`role-badge ${user.role}`}>
                              {user.role === 'admin' ? 'Администратор' : 'Пользователь'}
                            </span>
                          </td>
                          <td>{formatDate(user.createdAt)}</td>
                          <td>
                            <div className="table-actions">
                              <button className="btn-icon view-btn" title="Просмотреть профиль">
                                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                  <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                              </button>
                              <button className="btn-icon edit-btn" title="Редактировать">
                                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Модальное окно для добавления блюда */}
      <AddMealModal 
        isOpen={isAddMealModalOpen} 
        onClose={() => setIsAddMealModalOpen(false)} 
        onSubmit={handleCreateMeal}
      />
      {showEditModal && selectedMeal && (
  <div className="modal-overlay">
    <div className="modal-content">
      <div className="modal-header">
        <h2>Редактирование блюда</h2>
        <button className="close-btn" onClick={() => setShowEditModal(false)}>×</button>
      </div>
      <form className="meal-edit-form" onSubmit={(e) => {
        e.preventDefault();
        // Implementation for saving the edited meal
        const formData = new FormData(e.target);
        const mealData = {
          name: formData.get('name'),
          description: formData.get('description'),
          price: parseFloat(formData.get('price')),
          calories: parseInt(formData.get('calories')),
          protein: parseInt(formData.get('protein')),
          fat: parseInt(formData.get('fat')),
          carbs: parseInt(formData.get('carbs')),
          mealType: formData.get('mealType'),
          available: formData.get('available') === 'on'
        };
        
        fetch(`/api/meals/${selectedMeal._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`,
          },
          body: JSON.stringify(mealData),
        })
        .then(response => response.json())
        .then(data => {
          if (data._id) {
            // Update the meals list
            setMeals(meals.map(meal => 
              meal._id === data._id ? data : meal
            ));
            setShowEditModal(false);
          } else {
            throw new Error(data.message || 'Ошибка при обновлении блюда');
          }
        })
        .catch(err => {
          setError(err.message);
          console.error('Ошибка при сохранении блюда:', err);
        });
      }}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="name">Название</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              className="form-control" 
              defaultValue={selectedMeal.name} 
              required 
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Описание</label>
          <textarea 
            id="description" 
            name="description" 
            className="form-control" 
            defaultValue={selectedMeal.description} 
            required
          ></textarea>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="price">Цена (₽)</label>
            <input 
              type="number" 
              id="price" 
              name="price" 
              className="form-control" 
              defaultValue={selectedMeal.price} 
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="mealType">Тип блюда</label>
            <select 
              id="mealType" 
              name="mealType" 
              className="form-control" 
              defaultValue={selectedMeal.mealType} 
              required
            >
              <option value="Завтрак">Завтрак</option>
              <option value="Обед">Обед</option>
              <option value="Ужин">Ужин</option>
              <option value="Перекус">Перекус</option>
            </select>
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="calories">Калории</label>
            <input 
              type="number" 
              id="calories" 
              name="calories" 
              className="form-control" 
              defaultValue={selectedMeal.calories} 
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="protein">Белки (г)</label>
            <input 
              type="number" 
              id="protein" 
              name="protein" 
              className="form-control" 
              defaultValue={selectedMeal.protein} 
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="fat">Жиры (г)</label>
            <input 
              type="number" 
              id="fat" 
              name="fat" 
              className="form-control" 
              defaultValue={selectedMeal.fat} 
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="carbs">Углеводы (г)</label>
            <input 
              type="number" 
              id="carbs" 
              name="carbs" 
              className="form-control" 
              defaultValue={selectedMeal.carbs} 
              required 
            />
          </div>
        </div>
        
        <div className="form-group checkbox-group">
          <label>
            <input 
              type="checkbox" 
              name="available" 
              defaultChecked={selectedMeal.available} 
            />
            Доступно для заказа
          </label>
        </div>
        
        <div className="modal-footer">
          <button type="button" className="btn btn-outline" onClick={() => setShowEditModal(false)}>Отмена</button>
          <button type="submit" className="btn">Сохранить</button>
        </div>
      </form>
    </div>
  </div>
)}
    </div>
  );
};

export default AdminPage;