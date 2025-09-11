// Simple JavaScript launcher for production
const { spawn } = require('child_process');

// Set environment
process.env.NODE_ENV = 'production';

console.log('🚀 Starting production server with ts-node...');

// Start ts-node with minimal checks
const tsNode = spawn('ts-node', [
    '--transpile-only',
    '--skip-project', 
    '--compiler-options', '{"skipLibCheck":true,"strict":false,"noImplicitAny":false}',
    'app.ts'
], {
    stdio: 'inherit',
    env: process.env
});

tsNode.on('error', (err) => {
    console.error('❌ Failed to start ts-node:', err);
    process.exit(1);
});

tsNode.on('exit', (code) => {
    console.log(`🔄 ts-node exited with code ${code}`);
    process.exit(code);
});
