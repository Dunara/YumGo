const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'YumGo - Restaurant Service API',
            version: '1.0.0',
            description: 'Restaurant and Menu Management Microservice',
            contact: {
                name: 'YumGo Team'
            }
        },
        servers: [
            {
                url: 'http://localhost:8081',
                description: 'Direct Access'
            },
            {
                url: 'http://localhost:8080/restaurant-service',
                description: 'Via API Gateway'
            }
        ]
    },
    apis: ['./routes/*.js']
};

const specs = swaggerJsdoc(options);

module.exports = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
};