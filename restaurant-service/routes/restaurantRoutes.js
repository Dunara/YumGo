const express = require('express');
const router = express.Router();
const {
    getAllRestaurants,
    getRestaurantById,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant
} = require('../controllers/restaurantController');

// @route   GET /api/restaurants
router.get('/', getAllRestaurants);

// @route   POST /api/restaurants
router.post('/', createRestaurant);

// @route   GET /api/restaurants/:id
router.get('/:id', getRestaurantById);

// @route   PUT /api/restaurants/:id
router.put('/:id', updateRestaurant);

// @route   DELETE /api/restaurants/:id
router.delete('/:id', deleteRestaurant);

module.exports = router;