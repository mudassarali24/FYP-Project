const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
    {
        userID: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
        items: [
            {
                itemID: { type: mongoose.Schema.Types.ObjectId, ref: "Items", required: true },
                quantity: { type: Number, required: true, min: 1 },
                price: { type: Number, required: true },
            },
        ],
        totalAmount: { type: Number, required: true },
        transactionDate: { type: Date, default: Date.now },
    }
);

module.exports = mongoose.model('Transactions', transactionSchema);