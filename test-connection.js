require('dotenv').config();
const mongoose = require('mongoose');

console.log('Testing MongoDB connection...');
console.log('MONGODB_URI:', process.env.MONGODB_URI.substring(0, 50) + '...');

mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 10000
}).then(() => {
  console.log('✅ MongoDB connection successful!');
  process.exit(0);
}).catch((error) => {
  console.error('❌ MongoDB connection failed:', error.message);
  console.error('Full error:', error);
  process.exit(1);
});
