const swaggerUi = require('swagger-ui-express');

const swaggerDocument = {
    openapi: '3.0.0',
    info: {
        title: 'YumGo - Restaurant Service API',
        version: '1.0.0',
        description: 'Restaurant and Menu Management Microservice',
    },
    servers: [
        {
            url: 'http://localhost:8081',
            description: 'Direct Access',
        },
    ],
    paths: {
        '/api/restaurants': {
            get: {
                summary: 'Get all restaurants',
                tags: ['Restaurants'],
                responses: {
                    '200': {
                        description: 'Successful response',
                    },
                },
            },
            post: {
                summary: 'Create restaurant',
                tags: ['Restaurants'],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    name: { type: 'string' },
                                    address: { type: 'string' },
                                    phone: { type: 'string' },
                                    cuisineType: { type: 'string' },
                                },
                            },
                        },
                    },
                },
                responses: {
                    '201': { description: 'Created' },
                },
            },
        },
        '/api/restaurants/{id}': {
            get: {
                summary: 'Get restaurant by ID',
                tags: ['Restaurants'],
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: { type: 'string' },
                    },
                ],
                responses: {
                    '200': { description: 'Success' },
                    '404': { description: 'Not found' },
                },
            },
            put: {
                summary: 'Update restaurant',
                tags: ['Restaurants'],
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: { type: 'string' },
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    name: { type: 'string' },
                                    address: { type: 'string' },
                                    phone: { type: 'string' },
                                    cuisineType: { type: 'string' },
                                },
                            },
                        },
                    },
                },
                responses: {
                    '200': { description: 'Updated' },
                },
            },
            delete: {
                summary: 'Delete restaurant',
                tags: ['Restaurants'],
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: { type: 'string' },
                    },
                ],
                responses: {
                    '200': { description: 'Deleted' },
                },
            },
        },
        '/api/restaurants/{restaurantId}/menu': {
            get: {
                summary: 'Get menu by restaurant',
                tags: ['Menu'],
                parameters: [
                    {
                        in: 'path',
                        name: 'restaurantId',
                        required: true,
                        schema: { type: 'string' },
                    },
                ],
                responses: {
                    '200': { description: 'Success' },
                },
            },
            post: {
                summary: 'Add menu item',
                tags: ['Menu'],
                parameters: [
                    {
                        in: 'path',
                        name: 'restaurantId',
                        required: true,
                        schema: { type: 'string' },
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    name: { type: 'string' },
                                    price: { type: 'number' },
                                    description: { type: 'string' },
                                },
                                required: ['name', 'price'],
                            },
                        },
                    },
                },
                responses: {
                    '201': { description: 'Created' },
                },
            },
        },
        '/api/menu/{id}': {
            get: {
                summary: 'Get menu item by ID',
                tags: ['Menu'],
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: { type: 'string' },
                    },
                ],
                responses: {
                    '200': { description: 'Success' },
                },
            },
            put: {
                summary: 'Update menu item',
                tags: ['Menu'],
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: { type: 'string' },
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    name: { type: 'string' },
                                    price: { type: 'number' },
                                    description: { type: 'string' },
                                },
                            },
                        },
                    },
                },
                responses: {
                    '200': { description: 'Updated' },
                },
            },
            delete: {
                summary: 'Delete menu item',
                tags: ['Menu'],
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: { type: 'string' },
                    },
                ],
                responses: {
                    '200': { description: 'Deleted' },
                },
            },
        },
    },
};

module.exports = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};