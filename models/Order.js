import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  meals: [{
    meal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Meal',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
    },
  }],
  totalPrice: {
    type: Number,
    required: true,
  },
  deliveryAddress: {
    street: String,
    city: String,
    zipCode: String,
    country: { type: String, default: 'Россия' },
  },
  deliveryDate: {
    type: Date,
    required: true,
  },
  deliveryTime: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Обрабатывается', 'Подтвержден', 'Готовится', 'Доставляется', 'Доставлен', 'Отменен'],
    default: 'Обрабатывается',
  },
  paymentMethod: {
    type: String,
    enum: ['Карта', 'Наличные при получении'],
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ['Ожидание', 'Оплачено', 'Отменено'],
    default: 'Ожидание',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.model('Order', OrderSchema);
export default Order;