require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/db');

const PORT = process.env.PORT || 3001;

// Debug environment variables (without exposing sensitive data)
console.log('\n=========================================');
console.log('[INFO] SERVER STARTUP - Environment Check');
console.log('=========================================');
console.log(`[INFO] NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
console.log(`[INFO] PORT: ${PORT}`);
console.log(`[INFO] MONGODB_URI: ${process.env.MONGODB_URI ? 'Set' : 'NOT SET'}`);
console.log(`[INFO] JWT_SECRET: ${process.env.JWT_SECRET ? 'Set' : 'NOT SET'}`);
console.log('=========================================\n');

// Connect to Database
console.log('[INFO] Attempting to connect to MongoDB...');
connectDB();

// Start Server
const server = app.listen(PORT, () => {
    console.log('\n=========================================');
    console.log('[SUCCESS] SERVER STARTED SUCCESSFULLY');
    console.log('=========================================');
    console.log(`🚀 User Service running on port ${PORT}`);
    console.log(`📚 Swagger Documentation: http://localhost:${PORT}/api-docs`);
    console.log(`✅ Health Check: http://localhost:${PORT}/health`);
    console.log('=========================================\n');
});

// Handle server errors
server.on('error', (error) => {
    console.error('\n=========================================');
    console.error('[ERROR] SERVER ERROR');
    console.error('=========================================');
    console.error(`Error Code: ${error.code}`);
    console.error(`Error Message: ${error.message}`);
    
    if (error.code === 'EADDRINUSE') {
        console.error(`[ERROR] Port ${PORT} is already in use. Please free the port or use a different port.`);
    }
    console.log('=========================================\n');
    process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('\n=========================================');
    console.error('[ERROR] UNHANDLED PROMISE REJECTION');
    console.error('=========================================');
    console.error(`Error: ${err.message}`);
    console.error(`Stack: ${err.stack}`);
    console.log('=========================================\n');
    server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('\n=========================================');
    console.error('[ERROR] UNCAUGHT EXCEPTION');
    console.error('=========================================');
    console.error(`Error: ${err.message}`);
    console.error(`Stack: ${err.stack}`);
    console.log('=========================================\n');
    process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('\n[INFO] SIGTERM received. Closing server gracefully...');
    server.close(() => {
        console.log('[INFO] Server closed. Process terminated.');
        process.exit(0);
    });
});