const express = require('express');
const cors = require('cors');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const userRoutes = require('./routes/userRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger Configuration
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'User Service API',
            version: '1.0.0',
            description: 'User Service for Food Delivery Application',
            contact: {
                name: 'Your Name',
                email: 'your@email.com'
            }
        },
        servers: [
            {
                url: 'http://localhost:3001',
                description: 'User Service - Direct Access'
            },
            {
                url: 'http://localhost:3000/api/users',
                description: 'Via API Gateway'
            }
        ],
        components: {
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        user_id: { type: 'string', example: 'USR0001' },
                        name: { type: 'string', example: 'John Doe' },
                        email: { type: 'string', example: 'john@example.com' },
                        address: { type: 'string', example: '123 Main St' },
                        createdAt: { type: 'string', format: 'date-time' }
                    }
                },
                RegisterInput: {
                    type: 'object',
                    required: ['name', 'email', 'password', 'address'],
                    properties: {
                        name: { type: 'string' },
                        email: { type: 'string' },
                        password: { type: 'string' },
                        address: { type: 'string' }
                    }
                },
                LoginInput: {
                    type: 'object',
                    required: ['email', 'password'],
                    properties: {
                        email: { type: 'string' },
                        password: { type: 'string' }
                    }
                }
            }
        }
    },
    apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/swagger.json', (req, res) => res.json(swaggerSpec));

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', service: 'User Service', timestamp: new Date() });
});

// Routes
app.use('/api/users', userRoutes);

// Error Handler
app.use(errorHandler);

// Default root route
app.get('/', (req, res) => {
    res.send('User Service is running 🚀');
});

module.exports = app;