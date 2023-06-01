const express = require('express');
const User = require('../models/User');

const userRouter = express.Router();

userRouter.post('/create', async (req, res) => {
    const username = req.body.username.toLowerCase();
    const firstName = req.body.firstName.charAt(0).toUpperCase() + req.body.firstName.slice(1);
    const lastName = req.body.lastName.charAt(0).toUpperCase() + req.body.lastName.slice(1);
    const fullName = firstName + " " + lastName;

    const data = new User({
        username: username,
        firstName: firstName,
        lastName: lastName,
        fullName: fullName
    });

    try {
        const dataToSave = await data.save();
        res.status(200).json(dataToSave);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
});

userRouter.post('/getOne', async (req, res) => {
    const username = req.body.username;

    try {
        const user = await User.findOne({username: username});
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
})

userRouter.post('/getMany', async (req, res) => {
    const users = req.body.users;

    try {
        const returnedUsers = await User.find({username: {$in: users}});
        res.status(200).json(returnedUsers);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
})

userRouter.post('/search', async (req, res) => {
    const query = req.body.query;

    try {
        const returnedUsers = await User.find({
            $or: [
                {username: {$regex: query, $options: 'i'}},
                {fullName: {$regex: query, $options: 'i'}}
            ]
        },
        "username firstName lastName fullName").limit(5);
        res.status(200).json(returnedUsers);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
})

userRouter.post('/addSession', async(req, res) => {
    const username = req.body.username;
    const sessionId = req.body.sessionId;

    try {
        const user = await User.findOneAndUpdate({username: username}, {$push: {sessions: sessionId}}, {new: true});
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
})

userRouter.post('/hasActiveSession', async (req, res) => {
    const username =  req.body.username;

    try {
        const user = await User.findOneAndUpdate({username: username}, {hasActiveSession: true}, {new: true});
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
})

userRouter.post('/hasNoActiveSession', async (req, res) => {
    const username =  req.body.username;

    try {
        const user = await User.findOneAndUpdate({username: username}, {hasActiveSession: false}, {new: true});
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
})

userRouter.post('/endSessionForAll', async (req, res) => {
    const contributors = req.body.contributors;

    try {
        const user = await User.updateMany({username: {$in: contributors}}, {hasActiveSession: false}, {new: true});
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
})

userRouter.post('/addFriend', async (req, res) => {
    const username = req.body.username;
    const friend = req.body.friend;

    try {
        const user = await User.findOneAndUpdate({username: username}, {$push: {friends: friend}}, {new :true});
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
})

userRouter.post('/removeFriend', async (req, res) => {
    const username = req.body.username;
    const friend = req.body.friend;

    try {
        const user = await User.findOneAndUpdate({username: username}, {$pull: {friends: friend}}, {new: true});
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
})

userRouter.post('/update', async (req, res) => {

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

module.exports = userRouter;

