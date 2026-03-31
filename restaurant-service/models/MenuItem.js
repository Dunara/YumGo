const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        default: ''
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        default: 'Main Course'
    },
    isAvailable: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    collection: 'menuitems'
});

module.exports = mongoose.model('MenuItem', menuItemSchema);