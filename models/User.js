import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  dietaryPreferences: {
    calories: {
      type: Number,
      default: 2000,
    },
    restrictions: [{
      type: String,
      enum: ['Веган', 'Вегетарианец', 'Без глютена', 'Без лактозы', 'Без орехов', 'Без морепродуктов'],
    }],
    allergies: [String],
    goals: {
      type: String,
      enum: ['Похудение', 'Набор массы', 'Поддержание веса', 'Здоровое питание'],
      default: 'Здоровое питание',
    },
  },
  address: {
    street: String,
    city: String,
    zipCode: String,
    country: { type: String, default: 'Россия' },
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Хеширование пароля перед сохранением
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Метод для сравнения паролей
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', UserSchema);
export default User;