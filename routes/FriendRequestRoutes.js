const express = require('express');
const FriendRequest = require('../models/FriendRequest');

const friendRequestRouter = express.Router();

friendRequestRouter.post('/create', async (req, res) => {
    const request = new FriendRequest({
        sender: req.body.sender,
        receiver: req.body.receiver,
        status: req.body.status
    })

    try {
        const createdRequest = await request.save();
        res.status(200).json(createdRequest);
    } catch (error) {
        res.status(400).json(error.message);
    }
});

friendRequestRouter.post('/getPendingOutgoing', async (req, res) => {
    const sender = req.body.sender;

    try {
        const requests = await FriendRequest.find({sender: sender, status: "pending"});
        res.status(200).json(requests);
    } catch (error) {
        res.status(400).json(error.message);
    }
});

friendRequestRouter.post('/getPendingIncoming', async (req, res) => {
    const receiver = req.body.receiver;

    try {
        const requests = await FriendRequest.find({receiver: receiver, status: "pending"});
        res.status(200).json(requests);
    } catch (error) {
        res.status(400).json(error.message);
    }
});

friendRequestRouter.post('/setStatusPending', async (req, res) => {
    const sender = req.body.sender;
    const receiver = req.body.receiver;

    const filter = {
        sender: sender,
        receiver: receiver
    }

    try {
        const request = await FriendRequest.findOneAndUpdate(filter, {status: "pending"}, {new: true});
        res.status(200).json(request);
    } catch (error) {
        res.status(400).json(error.message);
    }
});

friendRequestRouter.post('/setStatusAccepted', async (req, res) => {
    const sender = req.body.sender;
    const receiver = req.body.receiver;

    const filter = {
        sender: sender,
        receiver: receiver
    }

    try {
        const request = await FriendRequest.findOneAndUpdate(filter, {status: "accepted"}, {new: true});
        res.status(200).json(request);
    } catch (error) {
        res.status(400).json(error.message);
    }
});

friendRequestRouter.post('/setStatusIgnored', async (req, res) => {
    const sender = req.body.sender;
    const receiver = req.body.receiver;

    const filter = {
        sender: sender,
        receiver: receiver
    }

    try {
        const request = await FriendRequest.findOneAndUpdate(filter, {status: "ignored"}, {new: true});
        res.status(200).json(request);
    } catch (error) {
        res.status(400).json(error.message);
    }
});

friendRequestRouter.post('/setStatusCanceled', async (req, res) => {
    const sender = req.body.sender;
    const receiver = req.body.receiver;

    const filter = {
        sender: sender,
        receiver: receiver
    }

    try {
        const request = await FriendRequest.findOneAndUpdate(filter, {status: "canceled"}, {new: true});
        res.status(200).json(request);
    } catch (error) {
        res.status(400).json(error.message);
    }
});

friendRequestRouter.post('/delete', async (req, res) => {
    const sender = req.body.sender;
    const receiver = req.body.receiver;

    const filter = {
        sender: sender,
        receiver: receiver
    }

    try {
        const request = await FriendRequest.findOneAndDelete(filter);
        res.status(200).json(request);
    } catch (error) {
        res.status(400).json(error.message);
    }
});

module.exports = friendRequestRouter;
