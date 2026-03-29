const express = require('express');
const router = express.Router();
const {
    getMenuByRestaurant,
    getMenuItemById,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem
} = require('../controllers/menuController');

// @route   GET /api/restaurants/:restaurantId/menu
router.get('/restaurants/:restaurantId/menu', getMenuByRestaurant);

// @route   POST /api/restaurants/:restaurantId/menu
router.post('/restaurants/:restaurantId/menu', addMenuItem);

// @route   GET /api/menu/:id
router.get('/menu/:id', getMenuItemById);

// @route   PUT /api/menu/:id
router.put('/menu/:id', updateMenuItem);

// @route   DELETE /api/menu/:id
router.delete('/menu/:id', deleteMenuItem);

module.exports = router;