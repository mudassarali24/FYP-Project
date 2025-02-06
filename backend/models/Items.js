const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, unique: true },
        price: { type: Number, required: true },
        image: { type: String, required: true },
        stock: { type: Number, required: true, min: 0 },
    }
);

module.exports = mongoose.model('Items', itemSchema);