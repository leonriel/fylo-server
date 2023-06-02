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
    const sessions = req.body.sessions;

    try {
        const retrievedSessions = await Session.find({_id: {$in: sessions}});
        res.status(200).json(retrievedSessions);
    } catch (error) {
        res.status(400),json({message: error.message});
    }
})

sessionRouter.post('/end', async (req, res) => {
    const session = req.body.session;

    try {
        const retrievedSession = await Session.findByIdAndUpdate(session, {isActive: false}, {new: true});
        res.status(200).json(retrievedSession);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
})

sessionRouter.post('/addContributor', async (req, res) => {
    const session = req.body.session;
    const user = req.body.user;
    
    try {
        const retrievedSession = await Session.findByIdAndUpdate(session, {$push: {contributors: user}}, {new: true});
        res.status(200).json(retrievedSession);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
})

sessionRouter.post('/update', async (req, res) => {
    const session = req.body.session;
    const update = req.body.fields;

    try {
        const retrievedSession = await Session.findByIdAndUpdate(session, update, {new: true});
        res.status(200).json(retrievedSession);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
})

module.exports = sessionRouter;