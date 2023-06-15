const express = require('express');
const SessionInvite = require('../models/SessionInvite');
const Session = require('../models/Session');
const User = require('../models/User');
const mongoose = require('mongoose');

const sessionInviteRouter = express.Router();

// Ideally prevent duplicates
sessionInviteRouter.post('/create', async (req, res) => {
    const { sender, recipient, session, status } = req.body;

    const invite = new SessionInvite({
        sender: sender,
        recipient: recipient,
        session: session,
        status: status
    })

    try {
        const createdInvite = await invite.save();
        res.status(200).json(createdInvite);
    } catch (error) {
        res.status(400).json(error.message);
    }
});

// Should return users
sessionInviteRouter.post('/getPendingOutgoing', async (req, res) => {
    const session = new mongoose.Types.ObjectId(req.body.session);

    const aggregate = [
        {
            "$match": {
                "_id": session 
            }
        },
        {
            "$lookup": {
                "from": "sessionInvites",
                "pipeline": [
                    {
                        "$match": {
                            "session": session,
                            $or: [
                                {status: "pending"},
                                {status: "ignored"}
                            ]
                        }
                    }, {
                        "$lookup": {
                            "from": "users",
                            "localField": "recipient",
                            "foreignField": "_id",
                            "as": "recipient"
                        }
                    }, {
                        "$unwind": "$recipient"
                    }, {
                        "$project": {
                            "_id": "$recipient._id",
                            "username": "$recipient.username",
                            "fullName": "$recipient.fullName",
                            "firstName": "$recipient.firstName",
                            "lastName": "$recipient.lastName",
                            "createdAt": 1
                        }
                    }, {
                        "$sort": {
                            "createdAt": -1
                        }
                    }
                ],
                "as": "recipient" 
            }
        }, {
            "$project": {
                "recipient": 1
            }
        }, {
            $unwind: {
                path: "$recipient",
                preserveNullAndEmptyArrays: false
            }
        }
    ]

    try {
        const invites = await Session.aggregate(aggregate);
        res.status(200).json(invites);
    } catch (error) {
        res.status(400).json(error.message);
    }
});

// Should return sessions
sessionInviteRouter.post('/getPendingIncoming', async (req, res) => {
    const recipient = new mongoose.Types.ObjectId(req.body.recipient);

    const aggregate = [
        {
            "$match": {
                "_id": recipient
            }
        },
        {
            "$lookup": {
                "from": "sessionInvites",
                "pipeline": [
                    {
                        "$match": {
                            "recipient": recipient,
                            status: "pending"
                        }
                    }, {
                        "$lookup": {
                            "from": "sessions",
                            "localField": "session",
                            "foreignField": "_id",
                            "as": "session"
                        }
                    }, {
                        "$unwind": "$session"
                    }, {
                        "$project": {
                            "_id": "$session._id",
                            "name": "$session.name",
                            "contributors": "$session.contributors",
                            "updatedAt": 1
                        }
                    }, {
                        "$sort": {
                            "updatedAt": -1
                        }
                    }
                ],
                "as": "session" 
            }
        }, {
            "$project": {
                "session": 1
            }
        }, {
            $unwind: {
                path: "$session",
                preserveNullAndEmptyArrays: false
            }
        }
    ]

    try {
        const invites = await User.aggregate(aggregate);
        res.status(200).json(invites);
    } catch (error) {
        res.status(400).json(error.message);
    }
});

sessionInviteRouter.post('/setStatusPending', async (req, res) => {
    const recipient = req.body.recipient;
    const session = req.body.session;

    const filter = {
        recipient: recipient,
        session: session
    }

    try {
        const invite = await SessionInvite.findOneAndUpdate(filter, {status: "pending"}, {new: true});
        res.status(200).json(invite);
    } catch (error) {
        res.status(400).json(error.message);
    }
});

sessionInviteRouter.post('/setStatusAccepted', async (req, res) => {
    const recipient = req.body.recipient;
    const session = req.body.session;

    const filter = {
        recipient: recipient,
        session: session
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
    const recipient = req.body.recipient;
    const session = req.body.session;

    const filter = {
        sender: sender,
        recipient: recipient,
        session: session
    }

    try {
        const invite = await SessionInvite.findOneAndUpdate(filter, {status: "ignored"}, {new: true});
        res.status(200).json(invite);
    } catch (error) {
        res.status(400).json(error.message);
    }
});

sessionInviteRouter.post('/setStatusCanceled', async (req, res) => {
    const recipient = req.body.recipient;
    const session = req.body.session;

    const filter = {
        recipient: recipient,
        session: session
    }

    try {
        const invite = await SessionInvite.findOneAndUpdate(filter, {status: "canceled"}, {new: true});
        res.status(200).json(invite);
    } catch (error) {
        res.status(400).json(error.message);
    }
});

sessionInviteRouter.post('/accept', async (req, res) => {
    const sender = req.body.sender;
    const recipient = req.body.recipient;
    const session = req.body.session;

    let mongoSession = null;

    try {
        mongoSession = await mongoose.startSession();
        await mongoSession.withTransaction(async () => {
            const user = await User.findById(recipient).session(mongoSession);

            if (user.hasActiveSession) {
                throw new Error("User has ongoing session.")
            }

            if (user.sessions.includes(session)) {
                throw new Error("User is already in session.")
            }

            const filter = {
                sender: sender,
                recipient: recipient,
                session: session
            }

            const sessionInvite = await SessionInvite.findOneAndUpdate(filter, {status: "accepted"}, {new: true}).session(mongoSession);

            user.sessions.push(session);
            user.hasActiveSession = true;
            await user.save();

            await Session.findByIdAndUpdate({_id: session}, {$addToSet: {contributors: recipient}}).session(mongoSession);

            res.status(200).json(sessionInvite);

            return sessionInvite;
        });
    } catch (error) {
        res.status(400).json(error.message);
    } finally {
        mongoSession.endSession();
    }
})

sessionInviteRouter.post('/delete', async (req, res) => {
    const recipient = req.body.recipient;
    const session = req.body.session;

    const filter = {
        recipient: recipient,
        session: session
    }

    try {
        const invite = await SessionInvite.findOneAndDelete(filter);
        res.status(200).json(invite);
    } catch (error) {
        res.status(400).json(error.message);
    }
});

module.exports = sessionInviteRouter;
