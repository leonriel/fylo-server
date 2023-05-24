const express = require('express');
const User = require('../models/User');

const router = express.Router();

router.post('/createUser', async (req, res) => {
    console.log(req.body)
    const data = new User({
        username: req.body.username,
    });

    try {
        const dataToSave = await data.save();
        res.status(200).json(dataToSave);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
});

module.exports = router;