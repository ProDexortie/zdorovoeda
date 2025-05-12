import express from 'express';
import { 
  createOrder, 
  getOrderById, 
  getMyOrders, 
  getOrders, 
  updateOrderStatus, 
  updateOrderPaymentStatus 
} from '../controllers/ordersController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Создание заказа и получение заказов (админ)
router.route('/')
  .post(protect, createOrder)
  .get(protect, admin, getOrders);

// Получение заказов текущего пользователя
router.get('/myorders', protect, getMyOrders);

// Получение заказа по ID
router.get('/:id', protect, getOrderById);

// Обновление статуса заказа (админ)
router.put('/:id/status', protect, admin, updateOrderStatus);

// Обновление статуса оплаты (админ)
router.put('/:id/pay', protect, admin, updateOrderPaymentStatus);

export default router;