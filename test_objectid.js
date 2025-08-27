// Test ObjectId validation
const { Types } = require('mongoose');

const testId = '68ae8acf01080d4dab45ddd5';
console.log('Testing ObjectId:', testId);
console.log('Length:', testId.length);
console.log('Is valid:', Types.ObjectId.isValid(testId));

// Test với ObjectId khác
const validId = '507f1f77bcf86cd799439011';
console.log('\nTesting known valid ObjectId:', validId);
console.log('Length:', validId.length);
console.log('Is valid:', Types.ObjectId.isValid(validId));

// Tạo ObjectId mới
const newId = new Types.ObjectId();
console.log('\nGenerated new ObjectId:', newId.toString());
console.log('Length:', newId.toString().length);
console.log('Is valid:', Types.ObjectId.isValid(newId.toString()));
