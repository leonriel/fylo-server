const express = require('express');
const User = require('../models/User');
const Session = require('../models/Session');

const router = express.Router();

router.post('/createUser', async (req, res) => {
    const data = new User({
        username: req.body.username.toLowerCase(),
    });

    try {
        const dataToSave = await data.save();
        res.status(200).json(dataToSave);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
});

router.post('/getUser', async (req, res) => {
    try {
        const user = await User.findOne({username: req.body.username});
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
})

router.post('/addSessionToUser', async(req, res) => {
    try {
        const user = await User.findOneAndUpdate({username: req.body.username}, {$push: {sessions: req.body.sessionId}});
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
})

router.post('/setUserActiveSession', async (req, res) => {
    try {
        const user = await User.findOneAndUpdate({username: req.body.username}, {hasActiveSession: true});
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
})

router.post('/setUsersInactiveSession', async (req, res) => {
    try {
        const user = await User.updateMany({username: {$in: req.body.contributors}}, {hasActiveSession: false});
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
})

router.post('/updateUser', async (req, res) => {

    const filter = {
        username: req.body.username
    }

    const update = req.body.fields;

    try {
        const user = await User.findOneAndUpdate(filter, update);
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
})

router.post('/createSession', async (req, res) => {
    const data = new Session({
        name: req.body.name,
        isActive: req.body.isActive,
        owner: req.body.owner,
        contributors: [req.body.owner]
    });

    try {
        const dataToSave = await data.save();
        res.status(200).json(dataToSave);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
})

router.post('/getSessions', async (req, res) => {
    try {
        const sessions = await Session.find({owner: req.body.owner});
        res.status(200).json(sessions);
    } catch (error) {
        res.status(400),json({message: error.message});
    }
})

router.post('/setSessionInactive', async (req, res) => {
    const sessionId = req.body.sessionId;

    try {
        const session = await Session.findOneAndUpdate({_id: sessionId}, {isActive: false});
        res.status(200).json(session);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
})

router.post('/addUserToSession', async (req, res) => {
    try {
        const session = await Session.findOneAndUpdate({_id: req.body.sessionId}, {$push: {contributors: req.body.username}});
        res.status(200).json(session);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
})

router.post('/updateSession', async (req, res) => {

    const filter = {
        sessionId: req.body.sessionId
    }

    const update = req.body.fields;

    try {
        const user = await Session.findOneAndUpdate(filter, update);
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
})

module.exports = router;