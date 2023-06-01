const express = require('express');
const SessionInvite = require('../models/SessionInvite');

const sessionInviteRouter = express.Router();

sessionInviteRouter.post('/create', async (req, res) => {
    const invite = new SessionInvite({
        sender: req.body.sender,
        receiver: req.body.receiver,
        sessionId: req.body.sessionId,
        status: req.body.status
    })

    try {
        const createdInvite = await invite.save();
        res.status(200).json(createdInvite);
    } catch (error) {
        res.status(400).json(error.message);
    }
});

sessionInviteRouter.post('/getPendingOutgoing', async (req, res) => {
    const sender = req.body.sender;

    try {
        const invites = await SessionInvite.find({sender: sender, status: "pending"});
        res.status(200).json(invites);
    } catch (error) {
        res.status(400).json(error.message);
    }
});

sessionInviteRouter.post('/getPendingIncoming', async (req, res) => {
    const receiver = req.body.receiver;

    try {
        const invites = await SessionInvite.find({receiver: receiver, status: "pending"});
        res.status(200).json(invites);
    } catch (error) {
        res.status(400).json(error.message);
    }
});

sessionInviteRouter.post('/setStatusPending', async (req, res) => {
    const sender = req.body.sender;
    const receiver = req.body.receiver;
    const sessionId = req.body.sessionId;

    const filter = {
        sender: sender,
        receiver: receiver,
        sessionId: sessionId
    }

    try {
        const invite = await SessionInvite.findOneAndUpdate(filter, {status: "pending"}, {new: true});
        res.status(200).json(invite);
    } catch (error) {
        res.status(400).json(error.message);
    }
});

sessionInviteRouter.post('/setStatusAccepted', async (req, res) => {
    const sender = req.body.sender;
    const receiver = req.body.receiver;
    const sessionId = req.body.sessionId;

    const filter = {
        sender: sender,
        receiver: receiver,
        sessionId: sessionId
    }

    try {
        const invite = await SessionInvite.findOneAndUpdate(filter, {status: "accepted"}, {new: true});
        res.status(200).json(invite);
    } catch (error) {
        res.status(400).json(error.message);
    }
});

sessionInviteRouter.post('/setStatusIgnored', async (req, res) => {
    const sender = req.body.sender;
    const receiver = req.body.receiver;
    const sessionId = req.body.sessionId;

    const filter = {
        sender: sender,
        receiver: receiver,
        sessionId: sessionId
    }

    try {
        const invite = await SessionInvite.findOneAndUpdate(filter, {status: "ignored"}, {new: true});
        res.status(200).json(invite);
    } catch (error) {
        res.status(400).json(error.message);
    }
});

sessionInviteRouter.post('/setStatusCanceled', async (req, res) => {
    const sender = req.body.sender;
    const receiver = req.body.receiver;
    const sessionId = req.body.sessionId;

    const filter = {
        sender: sender,
        receiver: receiver,
        sessionId: sessionId
    }

    try {
        const invite = await SessionInvite.findOneAndUpdate(filter, {status: "canceled"}, {new: true});
        res.status(200).json(invite);
    } catch (error) {
        res.status(400).json(error.message);
    }
});

sessionInviteRouter.post('/delete', async (req, res) => {
    const sender = req.body.sender;
    const receiver = req.body.receiver;
    const sessionId = req.body.sessionId;

    const filter = {
        sender: sender,
        receiver: receiver,
        sessionId: sessionId
    }

    try {
        const invite = await SessionInvite.findOneAndDelete(filter);
        res.status(200).json(invite);
    } catch (error) {
        res.status(400).json(error.message);
    }
});

module.exports = sessionInviteRouter;
