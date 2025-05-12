/**
 * Утилиты для работы с API
 */

// Базовый URL API
const API_URL = '';

/**
 * Выполнение HTTP запроса к API
 * @param {string} endpoint - конечная точка API
 * @param {string} method - HTTP метод (GET, POST, PUT, DELETE)
 * @param {object} data - данные для отправки в теле запроса
 * @param {string} token - JWT токен для авторизации
 * @returns {Promise<any>} - результат запроса
 */
export const fetchFromApi = async (endpoint, method = 'GET', data = null, token = null) => {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    // Добавляем заголовок авторизации, если передан токен
    if (token) {
      options.headers.Authorization = `Bearer ${token}`;
    }

    // Добавляем тело запроса для методов, отличных от GET
    if (data && method !== 'GET') {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(`${API_URL}${endpoint}`, options);
    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || 'Произошла ошибка при выполнении запроса');
    }

    return responseData;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

/**
 * Получение списка блюд с фильтрацией и пагинацией
 * @param {object} params - параметры запроса
 * @returns {Promise<any>} - результат запроса
 */
export const getMeals = async (params = {}) => {
  // Формируем строку запроса из параметров
  const queryParams = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&');

  const endpoint = `/api/meals${queryParams ? `?${queryParams}` : ''}`;
  return fetchFromApi(endpoint);
};

/**
 * Получение информации о блюде по ID
 * @param {string} id - ID блюда
 * @returns {Promise<any>} - результат запроса
 */
export const getMealById = async (id) => {
  return fetchFromApi(`/api/meals/${id}`);
};

/**
 * Получение персонализированных рекомендаций блюд
 * @param {string} token - JWT токен для авторизации
 * @returns {Promise<any>} - результат запроса
 */
export const getMealRecommendations = async (token) => {
  return fetchFromApi('/api/meals/recommendations', 'GET', null, token);
};

/**
 * Создание нового заказа
 * @param {object} orderData - данные заказа
 * @param {string} token - JWT токен для авторизации
 * @returns {Promise<any>} - результат запроса
 */
export const createOrder = async (orderData, token) => {
  return fetchFromApi('/api/orders', 'POST', orderData, token);
};

/**
 * Получение истории заказов пользователя
 * @param {string} token - JWT токен для авторизации
 * @returns {Promise<any>} - результат запроса
 */
export const getMyOrders = async (token) => {
  return fetchFromApi('/api/orders/myorders', 'GET', null, token);
};

/**
 * Получение информации о заказе по ID
 * @param {string} orderId - ID заказа
 * @param {string} token - JWT токен для авторизации
 * @returns {Promise<any>} - результат запроса
 */
export const getOrderById = async (orderId, token) => {
  return fetchFromApi(`/api/orders/${orderId}`, 'GET', null, token);
};

/**
 * Обновление профиля пользователя
 * @param {object} userData - данные пользователя
 * @param {string} token - JWT токен для авторизации
 * @returns {Promise<any>} - результат запроса
 */
export const updateUserProfile = async (userData, token) => {
  return fetchFromApi('/api/auth/profile', 'PUT', userData, token);
};

// Административный API

/**
 * Получение всех заказов (только для администраторов)
 * @param {string} token - JWT токен администратора
 * @returns {Promise<any>} - результат запроса
 */
export const getAllOrders = async (token) => {
  return fetchFromApi('/api/orders', 'GET', null, token);
};

/**
 * Обновление статуса заказа (только для администраторов)
 * @param {string} orderId - ID заказа
 * @param {string} status - новый статус заказа
 * @param {string} token - JWT токен администратора
 * @returns {Promise<any>} - результат запроса
 */
export const updateOrderStatus = async (orderId, status, token) => {
  return fetchFromApi(`/api/orders/${orderId}/status`, 'PUT', { status }, token);
};

/**
 * Создание нового блюда (только для администраторов)
 * @param {object} mealData - данные блюда
 * @param {string} token - JWT токен администратора
 * @returns {Promise<any>} - результат запроса
 */
export const createMeal = async (mealData, token) => {
  return fetchFromApi('/api/meals', 'POST', mealData, token);
};

/**
 * Обновление информации о блюде (только для администраторов)
 * @param {string} mealId - ID блюда
 * @param {object} mealData - обновленные данные блюда
 * @param {string} token - JWT токен администратора
 * @returns {Promise<any>} - результат запроса
 */
export const updateMeal = async (mealId, mealData, token) => {
  return fetchFromApi(`/api/meals/${mealId}`, 'PUT', mealData, token);
};

/**
 * Удаление блюда (только для администраторов)
 * @param {string} mealId - ID блюда
 * @param {string} token - JWT токен администратора
 * @returns {Promise<any>} - результат запроса
 */
export const deleteMeal = async (mealId, token) => {
  return fetchFromApi(`/api/meals/${mealId}`, 'DELETE', null, token);
};