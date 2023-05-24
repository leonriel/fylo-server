require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const routes = require('./routes/routes');
const mongoString = process.env.DATABASE_URL;

mongoose.connect(mongoString);
const db = mongoose.connection;

db.on('error', (error) => {
    console.log(error);
});

db.once('connected', () => {
    console.log('Database Connected');
});

const app = express();

app.use(cors());

app.use(express.json());

app.use('/api', routes);

app.listen(3000, () => {
    console.log('Server started on port 3000')
});