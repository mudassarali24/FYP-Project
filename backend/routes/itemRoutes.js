const express = require('express');
const multer = require('multer');
const path = require('path');
const Items = require('../models/Items');
const Transactions = require('../models/Transaction');
const router = express.Router();
// const fs = require('fs');

// const imagesDir = path.join(__dirname, '../public/images')

const storage = multer.diskStorage(
    {
        destination: (req, file, cb) =>
        {
            const dir = path.join(__dirname, '../../public/images');
            cb(null, dir);
        },
        filename: (req, file, cb) =>
        {
            const uniqueName = Date.now() + "-" + file.originalname;
            cb(null, uniqueName);
        },
    }
);
const upload = multer({ storage });

router.post('/add', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Image is required' });
        }

        const { title, price, stock } = req.body;
        const newItem = new Items({
            title,
            price,
            image: req.file.filename,
            stock,
        });

        await newItem.save();
        res.status(201).json({ message: "Item added successfully!", item: newItem });
    } catch (error) {
        console.error("Error adding item:", error); // Log the error
        res.status(500).json({ error: "Error adding item", details: error.message });
    }
});


router.get('/', async (req, res) =>
{
    try 
    {
        const items = await Items.find();
        res.json(items);
    } catch (error) 
    {
        res.status(500).json({ error: "Error fetching items", details: error.message })
    }
});

router.get('/:id', async (req, res) => {
    console.log('Fetching item with ID:', req.params.id);
    try {
        const item = await Items.findById(req.params.id);
        if (!item)
        {
            return res.status(404).json({message:'Item not found'});
        }
        res.json(item);
    } catch (error) {
        console.error('Error fetching item details:', error);
        res.status(500).json({message:'Error fetching item details', error});
    }
});

router.post('/purchase', async (req, res) =>
{
    try
    {
        const { userID, items } = req.body;

        if (!userID || !items || items.length === 0) {
            return res.status(400).json({error: "Invalid request: Missing userID or items."});
        }

        let totalAmount = 0;
        const updatedItems = await Promise.all(
            items.map(async (item) =>
            {
                const dbItem = await Items.findById(item.id);
                if (!dbItem )
                {
                    throw new Error("Item with ID " + item.id + " not found.");
                }
                if (dbItem.stock < item.quantity)
                {
                    throw new Error("Insufficient stock for item " + dbItem.title);
                }
                dbItem.stock -= item.quantity;
                await dbItem.save();
                totalAmount += dbItem.price * item.quantity;

                return {
                    itemID: dbItem._id,
                    quantity: item.quantity,
                    price: dbItem.price * item.quantity
                }
            })
        );

        // Creat a Transaction
        const transaction = new Transactions({
            userID,
            items: updatedItems,
            totalAmount,
        });
        await transaction.save();
        res.json({ message: "Purchase successfull!", transaction });
    }catch (error)
    {
        console.error("Error during purchase:", error.message);
        res.status(400).json({ error: "Error during purchase", details: error.message });
    }
});

module.exports = router;