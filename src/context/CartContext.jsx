import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  
  // Загружаем корзину из localStorage при запуске
  useEffect(() => {
    const cartFromStorage = localStorage.getItem('cartItems');
    if (cartFromStorage) {
      setCartItems(JSON.parse(cartFromStorage));
    }
  }, []);
  
  // Обновляем localStorage при изменении корзины
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);
  
  // Добавление товара в корзину
  const addToCart = (meal, quantity = 1) => {
    // Проверяем, есть ли уже этот товар в корзине
    const existingItem = cartItems.find(item => item.meal._id === meal._id);
    
    if (existingItem) {
      // Если товар уже есть, обновляем количество
      setCartItems(
        cartItems.map(item => 
          item.meal._id === meal._id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      // Если товара нет, добавляем новый
      setCartItems([...cartItems, { meal, quantity }]);
    }
  };
  
  // Удаление товара из корзины
  const removeFromCart = (mealId) => {
    setCartItems(cartItems.filter(item => item.meal._id !== mealId));
  };
  
  // Обновление количества товара
  const updateQuantity = (mealId, quantity) => {
    if (quantity <= 0) {
      // Если количество 0 или меньше, удаляем товар
      removeFromCart(mealId);
    } else {
      // Иначе обновляем количество
      setCartItems(
        cartItems.map(item => 
          item.meal._id === mealId ? { ...item, quantity } : item
        )
      );
    }
  };
  
  // Очистка корзины
  const clearCart = () => {
    setCartItems([]);
  };
  
  // Расчет общей стоимости корзины
  const getTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.meal.price * item.quantity, 
      0
    );
  };
  
  // Получение общего количества товаров в корзине
  const getTotalItems = () => {
    return cartItems.reduce(
      (total, item) => total + item.quantity, 
      0
    );
  };
  
  // Значение контекста
  const cartContextValue = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
  };
  
  return (
    <CartContext.Provider value={cartContextValue}>
      {children}
    </CartContext.Provider>
  );
};