const express = require('express');
const User = require('../models/User');
const Album = require('../models/Album');

const router = express.Router();

router.post('/createUser', async (req, res) => {
    console.log(req.body);
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

router.post('/getUser', async (req, res) => {
    console.log(req.body);
    try {
        const user = await User.findOne({username: req.body.username});
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
})

router.post('/createAlbum', async (req, res) => {
    console.log(req.body);
    const data = new Album({
        name: req.body.name,
        isActive: req.body.isActive || true,
        owner: req.body.owner
    });

    try {
        const dataToSave = await data.save();
        res.status(200).json(dataToSave);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
})

router.post('/getAlbums', async (req, res) => {
    console.log(req.body);
    try {
        const albums = await Album.find({owner: req.body.owner});
        res.status(200).json(albums);
    } catch (error) {
        res.status(400),json({message: error.message});
    }
})

module.exports = router;