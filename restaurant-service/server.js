const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables FIRST
dotenv.config();

const connectDB = require('./config/db');
const swaggerSetup = require('./swagger');

const app = express();
const PORT = process.env.PORT || 8081;

// Connect to MongoDB Atlas
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger
swaggerSetup(app);

// Routes
app.use('/api/restaurants', require('./routes/restaurantRoutes'));
app.use('/api', require('./routes/menuRoutes'));

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        service: 'restaurant-service',
        database: 'MongoDB Atlas',
        databaseName: 'yumgo',
        timestamp: new Date().toISOString()
    });
});

// Root
app.get('/', (req, res) => {
    res.status(200).json({
        service: 'YumGo Restaurant Service',
        database: 'MongoDB Atlas',
        endpoints: {
            restaurants: 'GET/POST /api/restaurants',
            restaurantById: 'GET/PUT/DELETE /api/restaurants/:id',
            menu: 'GET/POST /api/restaurants/:restaurantId/menu',
            menuItem: 'GET/PUT/DELETE /api/menu/:id',
            swagger: '/api-docs',
            health: '/health'
        }
    });
});

// Start server
app.listen(PORT, () => {
    console.log('');
    console.log('🍕 YumGo - Restaurant Service');
    console.log('═══════════════════════════════');
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📝 Swagger: http://localhost:${PORT}/api-docs`);
    console.log(`🏥 Health: http://localhost:${PORT}/health`);
    console.log('═══════════════════════════════');
    console.log('');
});