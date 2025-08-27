const { Types } = require('mongoose');

const sessionId = '68ae8acf01080d4dab45ddd5';
const userId = '68ae8a3d01080d4dab45ddcd';

console.log('=== ObjectId Validation Test ===');
console.log('Session ID:', sessionId);
console.log('Session ID valid:', Types.ObjectId.isValid(sessionId));
console.log('Session ID length:', sessionId.length);

console.log('\nUser ID:', userId);
console.log('User ID valid:', Types.ObjectId.isValid(userId));
console.log('User ID length:', userId.length);

// Test creating ObjectIds
try {
    const sessionObj = new Types.ObjectId(sessionId);
    console.log('\n✅ Session ObjectId created:', sessionObj.toString());
} catch (error) {
    console.log('\n❌ Session ObjectId error:', error.message);
}

try {
    const userObj = new Types.ObjectId(userId);
    console.log('✅ User ObjectId created:', userObj.toString());
} catch (error) {
    console.log('❌ User ObjectId error:', error.message);
}

// Check if they're equal
console.log('\nAre IDs equal?', sessionId === userId);
console.log('Session ID hex pattern:', /^[0-9a-fA-F]{24}$/.test(sessionId));
console.log('User ID hex pattern:', /^[0-9a-fA-F]{24}$/.test(userId));
