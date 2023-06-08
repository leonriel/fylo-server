const express = require('express');
const Session = require('../models/Session');
const User = require('../models/User');
const mongoose = require('mongoose');

// const db = require('../index');

const sessionRouter = express.Router();

sessionRouter.post('/create', async (req, res) => {
    const name = req.body.name;
    const isActive = req.body.isActive;
    const owner = req.body.owner;

    let mongoSession = null;
    let session = null;

    try {
        mongoSession = await mongoose.startSession();
        await mongoSession.withTransaction(async () => {
            const user = await User.findById(owner).session(mongoSession);

            if (user.hasActiveSession) {
                throw {message: "User has active session"}
            }

            const data = new Session({
                name: name,
                isActive: isActive,
                owner: owner,
                contributors: [owner]
            });

            session = await data.save({ mongoSession });

            user.hasActiveSession = true;

            user.sessions.push(session._id);

            await user.save();

            // throw {message: "This is an error"}

            res.status(200).json(session);

            return session;
        });

    } catch (error) {
        if (session) {
            await Session.findByIdAndDelete(session._id);
        }
        res.status(400).json(error.message);
    } finally {
        mongoSession.endSession();
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

    let mongoSession = null;

    try {
        mongoSession = await mongoose.startSession();
        await mongoSession.withTransaction(async () => {
            const retrievedSession = await Session.findByIdAndUpdate(session, {isActive: false}, {new: true}).session(mongoSession);

            const contributors = retrievedSession.contributors;

            await User.updateMany({_id: {$in: contributors}}, {hasActiveSession: false}).session(mongoSession);

            res.status(200).json(retrievedSession);

            return retrievedSession;
        })
    } catch (error) {
        res.status(400).json({message: error.message});
    } finally {
        mongoSession.endSession();
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

sessionRouter.post('/leave', async (req, res) => {
    // Need to decide what permissions users still ahve if they leave
    // Need to decide logic if the owner leaves... probably just randomly assign a new owner
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