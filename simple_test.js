const sessionId = '68ae8acf01080d4dab45ddd5';
const userId = '68ae8a3d01080d4dab45ddcd';

console.log('=== Basic ObjectId Test ===');
console.log('Session ID:', sessionId);
console.log('Session ID length:', sessionId.length);
console.log('User ID:', userId); 
console.log('User ID length:', userId.length);

// Check hex pattern
const hexPattern = /^[0-9a-fA-F]{24}$/;
console.log('Session ID hex pattern:', hexPattern.test(sessionId));
console.log('User ID hex pattern:', hexPattern.test(userId));

console.log('Are IDs equal?', sessionId === userId);
