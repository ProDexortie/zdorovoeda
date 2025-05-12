import Meal from '../models/Meal.js';
import User from '../models/User.js';

// @desc    Получение всех блюд
// @route   GET /api/meals
// @access  Public
export const getMeals = async (req, res) => {
  try {
    const pageSize = 10;
    const page = Number(req.query.page) || 1;

    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: 'i',
          },
        }
      : {};

    const count = await Meal.countDocuments({ ...keyword });
    const meals = await Meal.find({ ...keyword })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({
      meals,
      page,
      pages: Math.ceil(count / pageSize),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// @desc    Получение одного блюда по ID
// @route   GET /api/meals/:id
// @access  Public
export const getMealById = async (req, res) => {
  try {
    const meal = await Meal.findById(req.params.id);

    if (meal) {
      res.json(meal);
    } else {
      res.status(404).json({ message: 'Блюдо не найдено' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// @desc    Добавление нового блюда
// @route   POST /api/meals
// @access  Private/Admin
export const createMeal = async (req, res) => {
  try {
    const {
      name,
      description,
      imageUrl,
      calories,
      protein,
      carbs,
      fat,
      ingredients,
      dietaryCategories,
      mealType,
      preparationTime,
      price,
    } = req.body;

    const meal = new Meal({
      name,
      description,
      imageUrl,
      calories,
      protein,
      carbs,
      fat,
      ingredients,
      dietaryCategories,
      mealType,
      preparationTime,
      price,
    });

    const createdMeal = await meal.save();
    res.status(201).json(createdMeal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// @desc    Обновление блюда
// @route   PUT /api/meals/:id
// @access  Private/Admin
export const updateMeal = async (req, res) => {
  try {
    const {
      name,
      description,
      imageUrl,
      calories,
      protein,
      carbs,
      fat,
      ingredients,
      dietaryCategories,
      mealType,
      preparationTime,
      price,
      available,
    } = req.body;

    const meal = await Meal.findById(req.params.id);

    if (meal) {
      meal.name = name || meal.name;
      meal.description = description || meal.description;
      meal.imageUrl = imageUrl || meal.imageUrl;
      meal.calories = calories || meal.calories;
      meal.protein = protein || meal.protein;
      meal.carbs = carbs || meal.carbs;
      meal.fat = fat || meal.fat;
      meal.ingredients = ingredients || meal.ingredients;
      meal.dietaryCategories = dietaryCategories || meal.dietaryCategories;
      meal.mealType = mealType || meal.mealType;
      meal.preparationTime = preparationTime || meal.preparationTime;
      meal.price = price || meal.price;
      meal.available = available !== undefined ? available : meal.available;

      const updatedMeal = await meal.save();
      res.json(updatedMeal);
    } else {
      res.status(404).json({ message: 'Блюдо не найдено' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// @desc    Удаление блюда
// @route   DELETE /api/meals/:id
// @access  Private/Admin
export const deleteMeal = async (req, res) => {
  try {
    const meal = await Meal.findById(req.params.id);

    if (meal) {
      await meal.remove();
      res.json({ message: 'Блюдо удалено' });
    } else {
      res.status(404).json({ message: 'Блюдо не найдено' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// @desc    Получение персонализированных рекомендаций блюд
// @route   GET /api/meals/recommendations
// @access  Private
export const getMealRecommendations = async (req, res) => {
  try {
    // Получаем данные пользователя
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    // Формируем запрос на основе диетических предпочтений пользователя
    const query = {};
    
    // Фильтр по калориям (±200 от предпочтений пользователя)
    if (user.dietaryPreferences.calories) {
      const targetCalories = user.dietaryPreferences.calories;
      query.calories = { 
        $gte: targetCalories - 200, 
        $lte: targetCalories + 200 
      };
    }
    
    // Фильтр по диетическим ограничениям
    if (user.dietaryPreferences.restrictions && user.dietaryPreferences.restrictions.length > 0) {
      query.dietaryCategories = { $all: user.dietaryPreferences.restrictions };
    }
    
    // Ищем подходящие блюда
    const recommendations = await Meal.find(query).limit(10);
    
    // Группируем рекомендации по типу приема пищи
    const mealPlan = {
      breakfast: recommendations.filter(meal => meal.mealType === 'Завтрак'),
      lunch: recommendations.filter(meal => meal.mealType === 'Обед'),
      dinner: recommendations.filter(meal => meal.mealType === 'Ужин'),
      snacks: recommendations.filter(meal => meal.mealType === 'Перекус'),
    };
    
    res.json(mealPlan);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};