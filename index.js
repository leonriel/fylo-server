require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const userRoutes = require('./routes/UserRoutes');
const sessionRoutes = require('./routes/SessionRoutes');
const friendRequestRoutes = require('./routes/FriendRequestRoutes');
const sessionInviteRoutes = require('./routes/SessionInviteRoutes');
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

app.use('/user', userRoutes);

app.use('/session', sessionRoutes);

app.use('/friendRequest', friendRequestRoutes);

app.use('/sessionInvite', sessionInviteRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});