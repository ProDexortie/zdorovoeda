import express from 'express';
import { 
  registerUser, 
  loginUser, 
  getUserProfile, 
  updateUserProfile 
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Регистрация нового пользователя
router.post('/register', registerUser);

// Авторизация пользователя
router.post('/login', loginUser);

// Получение и обновление профиля пользователя (защищенные маршруты)
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

export default router;