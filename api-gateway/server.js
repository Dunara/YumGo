const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express'); // Required for the Master Swagger UI

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(morgan('dev')); // Logs requests to the console

// ==========================================
// 1. MICROSERVICE API ROUTING
// ==========================================

// User Service (Port 3001)
app.use('/api/users', createProxyMiddleware({ 
    target: 'http://localhost:3001', 
    changeOrigin: true 
}));

// Restaurant & Menu Service (Port 3002)
app.use('/api/restaurants', createProxyMiddleware({ 
    target: 'http://localhost:3002', 
    changeOrigin: true 
}));
app.use('/api/menu', createProxyMiddleware({ 
    target: 'http://localhost:3002', 
    changeOrigin: true 
}));

// Order Service (Port 8003)
app.use('/api/orders', createProxyMiddleware({ 
    target: 'http://localhost:3003', 
    changeOrigin: true 
}));

// Review Service (Port 3004)
app.use('/api/reviews', createProxyMiddleware({ 
    target: 'http://localhost:3004', 
    changeOrigin: true 
}));


// ==========================================
// 2. UNIFIED SWAGGER UI (One Place, One Port)
// ==========================================

// A. Proxy the raw JSON definitions from each microservice
app.use('/users/swagger.json', createProxyMiddleware({ 
    target: 'http://localhost:3001/swagger.json', 
    changeOrigin: true 
}));

app.use('/restaurants/swagger.json', createProxyMiddleware({ 
    target: 'http://localhost:3002/swagger.json', 
    changeOrigin: true 
}));

app.use('/orders/swagger.json', createProxyMiddleware({ 
    target: 'http://localhost:3003/swagger.json', 
    changeOrigin: true 
}));

app.use('/reviews/swagger.json', createProxyMiddleware({ 
    target: 'http://localhost:3004/swagger.json', 
    changeOrigin: true 
}));

// B. Configure the Master Swagger UI dropdown menu
const swaggerOptions = {
    explorer: true, // This enables the top search/dropdown bar
    swaggerOptions: {
        urls: [
            { url: '/users/swagger.json', name: '1. User Service API' },
            { url: '/restaurants/swagger.json', name: '2. Restaurant Service API' },
            { url: '/orders/swagger.json', name: '3. Order Service API' },
            { url: '/reviews/swagger.json', name: '4. Review Service API' }
        ]
    }
};

// C. Serve the Master Swagger UI on the gateway
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(null, swaggerOptions));

// ==========================================
// 3. GATEWAY HEALTH & STARTUP
// ==========================================

// Default Gateway Route
app.get('/', (req, res) => {
    res.send('✅ API Gateway is running. All Microservices are routed successfully.');
});

app.listen(PORT, () => {
    console.log(`\n🚀 API Gateway running on http://localhost:${PORT}`);
    console.log(`══════════════════════════════════════════════════`);
    console.log(`🍔 UNIFIED SWAGGER PORTAL: http://localhost:${PORT}/api-docs`);
    console.log(`══════════════════════════════════════════════════`);
    console.log(`--- Active API Routes ---`);
    console.log(`- Users:       http://localhost:${PORT}/api/users`);
    console.log(`- Restaurants: http://localhost:${PORT}/api/restaurants`);
    console.log(`- Menu:        http://localhost:${PORT}/api/menu`);
    console.log(`- Orders:      http://localhost:${PORT}/api/orders`);
    console.log(`- Reviews:     http://localhost:${PORT}/api/reviews\n`);
});