import Order from '../models/Order.js';
import Meal from '../models/Meal.js';

// @desc    Создание нового заказа
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
  try {
    const {
      meals,
      deliveryAddress,
      deliveryDate,
      deliveryTime,
      paymentMethod,
    } = req.body;

    if (meals && meals.length === 0) {
      return res.status(400).json({ message: 'Заказ не содержит блюд' });
    }

    // Получаем информацию о каждом блюде и рассчитываем общую стоимость
    let totalPrice = 0;
    const orderItems = [];

    for (const item of meals) {
      const meal = await Meal.findById(item.meal);
      
      if (!meal) {
        return res.status(404).json({ message: `Блюдо с ID ${item.meal} не найдено` });
      }
      
      totalPrice += meal.price * item.quantity;
      orderItems.push({
        meal: item.meal,
        quantity: item.quantity,
      });
    }

    // Создаем новый заказ
    const order = new Order({
      user: req.user._id,
      meals: orderItems,
      totalPrice,
      deliveryAddress,
      deliveryDate,
      deliveryTime,
      paymentMethod,
    });

    const createdOrder = await order.save();

    res.status(201).json(createdOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// @desc    Получение заказа по ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate({
        path: 'meals.meal',
        select: 'name price imageUrl',
      });

    if (order) {
      // Проверяем права доступа (пользователь может видеть только свои заказы или админ может видеть все)
      if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Нет прав для доступа к данному заказу' });
      }

      res.json(order);
    } else {
      res.status(404).json({ message: 'Заказ не найден' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// @desc    Получение заказов текущего пользователя
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate({
        path: 'meals.meal',
        select: 'name price imageUrl',
      })
      .sort('-createdAt');
    
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// @desc    Получение всех заказов
// @route   GET /api/orders
// @access  Private/Admin
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'id name')
      .populate({
        path: 'meals.meal',
        select: 'name price',
      })
      .sort('-createdAt');
    
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// @desc    Обновление статуса заказа
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (order) {
      order.status = status || order.status;
      
      if (status === 'Доставлен' && order.paymentMethod === 'Карта') {
        order.paymentStatus = 'Оплачено';
      }

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Заказ не найден' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// @desc    Обновление статуса оплаты
// @route   PUT /api/orders/:id/pay
// @access  Private/Admin
export const updateOrderPaymentStatus = async (req, res) => {
  try {
    const { paymentStatus } = req.body;

    const order = await Order.findById(req.params.id);

    if (order) {
      order.paymentStatus = paymentStatus || order.paymentStatus;

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Заказ не найден' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};