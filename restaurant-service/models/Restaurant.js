const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    cuisineType: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    openingTime: {
        type: String,
        default: '09:00'
    },
    closingTime: {
        type: String,
        default: '22:00'
    }
}, {
    timestamps: true,
    collection: 'restaurants'
});

module.exports = mongoose.model('Restaurant', restaurantSchema);