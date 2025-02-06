const express = require('express');
const Items = require('../models/Items');
const Transactions = require('../models/Transaction');
const router = express.Router();

router.get('/fetch', async (req, res) => {
    console.log("In Fetch");
    try {
        const userID = req.query.userID;
        if (!userID) {
            return res.status(400).json({error:"User ID is required."});
        }
        console.log("User ID (Route): " + userID);
        const transactions = await Transactions.find({userID}).populate('items.itemID');
        
        res.json(transactions);
    } catch (error) {
        res.status(500).json({error: "Error fetching transactions", details: error.message});
    }
});

module.exports = router;