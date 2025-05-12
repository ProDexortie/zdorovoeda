/**
 * Вспомогательные функции для приложения
 */

/**
 * Форматирование даты в локализованный строковый формат
 * @param {string|Date} dateString - дата в виде строки или объекта Date
 * @param {object} options - опции форматирования
 * @returns {string} - отформатированная дата
 */
export const formatDate = (dateString, options = {}) => {
  const defaultOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric'
  };
  
  const mergedOptions = { ...defaultOptions, ...options };
  return new Date(dateString).toLocaleDateString('ru-RU', mergedOptions);
};

/**
 * Форматирование цены
 * @param {number} price - цена
 * @param {string} currency - валюта (по умолчанию "₽")
 * @returns {string} - отформатированная цена
 */
export const formatPrice = (price, currency = '₽') => {
  return `${price.toLocaleString('ru-RU')} ${currency}`;
};

/**
 * Форматирование времени приготовления
 * @param {number} minutes - время в минутах
 * @returns {string} - отформатированное время
 */
export const formatCookingTime = (minutes) => {
  if (minutes < 60) {
    return `${minutes} мин.`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours} ч.`;
  }
  
  return `${hours} ч. ${remainingMinutes} мин.`;
};

/**
 * Получение цветового класса для статуса заказа
 * @param {string} status - статус заказа
 * @returns {string} - CSS класс
 */
export const getOrderStatusClass = (status) => {
  switch (status) {
    case 'Обрабатывается':
      return 'status-processing';
    case 'Подтвержден':
      return 'status-confirmed';
    case 'Готовится':
      return 'status-preparing';
    case 'Доставляется':
      return 'status-delivering';
    case 'Доставлен':
      return 'status-delivered';
    case 'Отменен':
      return 'status-cancelled';
    default:
      return '';
  }
};

/**
 * Получение русского названия месяца
 * @param {number} month - номер месяца (0-11)
 * @returns {string} - название месяца
 */
export const getMonthName = (month) => {
  const months = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];
  
  return months[month];
};

/**
 * Получение дней недели
 * @param {boolean} short - использовать сокращенные названия
 * @returns {string[]} - массив названий дней недели
 */
export const getWeekDays = (short = false) => {
  const longDays = [
    'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'
  ];
  
  const shortDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  
  return short ? shortDays : longDays;
};

/**
 * Генерация случайного ID
 * @param {number} length - длина ID
 * @returns {string} - сгенерированный ID
 */
export const generateId = (length = 6) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  return result;
};

/**
 * Проверка валидности email
 * @param {string} email - email для проверки
 * @returns {boolean} - результат проверки
 */
export const isValidEmail = (email) => {
  const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return regex.test(email);
};

/**
 * Сортировка массива блюд по указанному полю
 * @param {Array} meals - массив блюд
 * @param {string} field - поле для сортировки
 * @param {boolean} ascending - порядок сортировки (по возрастанию/убыванию)
 * @returns {Array} - отсортированный массив
 */
export const sortMeals = (meals, field, ascending = true) => {
  return [...meals].sort((a, b) => {
    let valueA = a[field];
    let valueB = b[field];
    
    // Для строковых полей используем localeCompare
    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return ascending 
        ? valueA.localeCompare(valueB, 'ru-RU') 
        : valueB.localeCompare(valueA, 'ru-RU');
    }
    
    // Для числовых полей и других типов
    return ascending ? valueA - valueB : valueB - valueA;
  });
};

/**
 * Фильтрация массива блюд по типу блюда
 * @param {Array} meals - массив блюд
 * @param {string} mealType - тип блюда
 * @returns {Array} - отфильтрованный массив
 */
export const filterMealsByType = (meals, mealType) => {
  if (mealType === 'all') {
    return meals;
  }
  
  return meals.filter(meal => meal.mealType === mealType);
};

/**
 * Фильтрация массива блюд по диетическим категориям
 * @param {Array} meals - массив блюд
 * @param {string[]} categories - массив категорий
 * @returns {Array} - отфильтрованный массив
 */
export const filterMealsByDietaryCategories = (meals, categories) => {
  if (!categories || categories.length === 0) {
    return meals;
  }
  
  return meals.filter(meal => {
    if (!meal.dietaryCategories || meal.dietaryCategories.length === 0) {
      return false;
    }
    
    return categories.every(category => 
      meal.dietaryCategories.includes(category)
    );
  });
};

/**
 * Фильтрация массива блюд по ценовому диапазону
 * @param {Array} meals - массив блюд
 * @param {number} minPrice - минимальная цена
 * @param {number} maxPrice - максимальная цена
 * @returns {Array} - отфильтрованный массив
 */
export const filterMealsByPriceRange = (meals, minPrice, maxPrice) => {
  return meals.filter(meal => 
    meal.price >= minPrice && meal.price <= maxPrice
  );
};

/**
 * Фильтрация массива блюд по каллориям
 * @param {Array} meals - массив блюд
 * @param {number} maxCalories - максимальное количество калорий
 * @returns {Array} - отфильтрованный массив
 */
export const filterMealsByCalories = (meals, maxCalories) => {
  return meals.filter(meal => meal.calories <= maxCalories);
};

/**
 * Расчет общего количества калорий для набора блюд
 * @param {Array} meals - массив объектов блюд с полями quantity и calories
 * @returns {number} - общее количество калорий
 */
export const calculateTotalCalories = (meals) => {
  return meals.reduce((total, item) => 
    total + (item.meal.calories * item.quantity), 0
  );
};

/**
 * Расчет общего количества белков, жиров и углеводов для набора блюд
 * @param {Array} meals - массив объектов блюд с полями quantity, protein, fat, carbs
 * @returns {object} - объект с общими значениями белков, жиров и углеводов
 */
export const calculateTotalNutrition = (meals) => {
  return meals.reduce((total, item) => {
    return {
      protein: total.protein + (item.meal.protein * item.quantity),
      fat: total.fat + (item.meal.fat * item.quantity),
      carbs: total.carbs + (item.meal.carbs * item.quantity)
    };
  }, { protein: 0, fat: 0, carbs: 0 });
};