import express from 'express';
import { 
  getMeals, 
  getMealById, 
  createMeal, 
  updateMeal, 
  deleteMeal, 
  getMealRecommendations 
} from '../controllers/mealsController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Получение всех блюд (публичный доступ)
router.get('/', getMeals);

// Получение персонализированных рекомендаций (только для авторизованных пользователей)
router.get('/recommendations', protect, getMealRecommendations);

// Получение блюда по ID (публичный доступ)
router.get('/:id', getMealById);

// Управление блюдами (только для администраторов)
router.post('/', protect, admin, createMeal);
router.put('/:id', protect, admin, updateMeal);
router.delete('/:id', protect, admin, deleteMeal);

export default router;