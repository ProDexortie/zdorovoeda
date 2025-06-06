import mongoose from 'mongoose';
import { config } from 'dotenv';

config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB подключена: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Ошибка: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;