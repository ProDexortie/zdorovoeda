import mongoose from 'mongoose';

const MealSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  calories: {
    type: Number,
    required: true,
  },
  protein: {
    type: Number,
    required: true,
  },
  carbs: {
    type: Number,
    required: true,
  },
  fat: {
    type: Number,
    required: true,
  },
  ingredients: [{
    type: String,
    required: true,
  }],
  dietaryCategories: [{
    type: String,
    enum: ['Веган', 'Вегетарианец', 'Без глютена', 'Без лактозы', 'Без орехов', 'Без морепродуктов'],
  }],
  mealType: {
    type: String,
    enum: ['Завтрак', 'Обед', 'Ужин', 'Перекус'],
    required: true,
  },
  preparationTime: {
    type: Number, // в минутах
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  available: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Meal = mongoose.model('Meal', MealSchema);
export default Meal;