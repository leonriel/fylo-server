const express = require('express');
const Session = require('../models/Session');

const sessionRouter = express.Router();

sessionRouter.post('/create', async (req, res) => {
    const name = req.body.name;
    const isActive = req.body.isActive;
    const owner = req.body.owner;

    const data = new Session({
        name: name,
        isActive: isActive,
        owner: owner,
        contributors: [owner]
    });

    try {
        const dataToSave = await data.save();
        res.status(200).json(dataToSave);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
})

sessionRouter.post('/getMany', async (req, res) => {
    const sessionIds = req.body.sessionIds;

    try {
        const sessions = await Session.find({_id: {$in: sessionIds}});
        res.status(200).json(sessions);
    } catch (error) {
        res.status(400),json({message: error.message});
    }
})

sessionRouter.post('/end', async (req, res) => {
    const sessionId = req.body.sessionId;

    try {
        const session = await Session.findOneAndUpdate({_id: sessionId}, {isActive: false});
        res.status(200).json(session);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
})

sessionRouter.post('/addContributor', async (req, res) => {
    const sessionId = req.body.sessionId;
    const username = req.body.username;
    
    try {
        const session = await Session.findOneAndUpdate({_id: sessionId}, {$push: {contributors: username}});
        res.status(200).json(session);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
})

sessionRouter.post('/update', async (req, res) => {

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

module.exports = sessionRouter;