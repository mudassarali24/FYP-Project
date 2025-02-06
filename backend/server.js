require('dotenv').config({path: './dotenv.env'});
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use('/images', express.static(path.join(__dirname, '../public/images')));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

console.log('MONGO_URI: ', process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true, 
    useUnifiedTopology: true})
    .then(() => console.log("MongoDB connected"))
    .catch(error => console.error("MongoDB connection error: ", error));

app.use((req, res, next) =>
{
    console.log('Request Method: ' + req.method + " Request URL: " + req.url);
    next();
});

app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/items', require('./routes/itemRoutes'));
app.use('/api/transactions', require('./routes/transactionRoutes'));

app.post('/api/users/register', (req, res) =>
{
    res.json({message: 'CORS is working!'});
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log("Server running on http://localhost:" + PORT));