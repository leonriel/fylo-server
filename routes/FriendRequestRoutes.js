const express = require('express');
const FriendRequest = require('../models/FriendRequest');
const User = require('../models/User');

const friendRequestRouter = express.Router();

friendRequestRouter.post('/create', async (req, res) => {
    const request = new FriendRequest({
        sender: req.body.sender,
        recipient: req.body.recipient,
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

    const aggregate = [
        {
            "$match": {
                "_id": sender 
            }
        },
        {
            "$lookup": {
                "from": "friendRequests",
                "pipeline": [
                    {
                        "$match": {
                            "sender": sender,
                            "status": "pending"
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
                            "createdAt": "$recipient.createdAt"
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
        }
    ]

    try {
        const requests = await User.aggregate(aggregate).exec();
        res.status(200).json(requests);
    } catch (error) {
        res.status(400).json(error.message);
    }
});

friendRequestRouter.post('/getPendingIncoming', async (req, res) => {
    const recipient = req.body.recipient;

    const aggregate = [
        {
            "$match": {
                "_id": recipient
            }
        },
        {
            "$lookup": {
                "from": "friendRequests",
                "pipeline": [
                    {
                        "$match": {
                            "recipient": recipient,
                            "status": "pending"
                        }
                    }, {
                        "$lookup": {
                            "from": "users",
                            "localField": "sender",
                            "foreignField": "_id",
                            "as": "sender"
                        }
                    }, {
                        "$unwind": "$sender"
                    }, {
                        "$project": {
                            "_id": "$sender._id",
                            "username": "$sender.username",
                            "fullName": "$sender.fullName",
                            "createdAt": "$sender.createdAt"
                        }
                    }, {
                        "$sort": {
                            "createdAt": -1
                        }
                    }
                ],
                "as": "sender" 
            }
        }, {
            "$project": {
                "sender": 1
            }
        }, {
            $unwind: {
                path: "$sender",
                preserveNullAndEmptyArrays: true
            }
        }
    ]

    try {
        const requests = await User.aggregate(aggregate);
        res.status(200).json(requests);
    } catch (error) {
        res.status(400).json(error.message);
    }
});

friendRequestRouter.post('/setStatusPending', async (req, res) => {
    const sender = req.body.sender;
    const recipient = req.body.recipient;

    const filter = {
        sender: sender,
        recipient: recipient
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
    const recipient = req.body.recipient;

    const filter = {
        sender: sender,
        recipient: recipient
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
    const recipient = req.body.recipient;

    const filter = {
        sender: sender,
        recipient: recipient
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
    const recipient = req.body.recipient;

    const filter = {
        sender: sender,
        recipient: recipient
    }

    try {
        const request = await FriendRequest.findOneAndUpdate(filter, {status: "canceled"}, {new: true});
        res.status(200).json(request);
    } catch (error) {
        res.status(400).json(error.message);
    }
});

// Deletes all friend requests between two users (regardless of sender and recipient) and 
// should only be called if a user removes a friend
friendRequestRouter.post('/delete', async (req, res) => {
    const user = req.body.user;
    const friend = req.body.friend;

    const filter1 = {
        sender: user,
        recipient: friend
    }

    const filter2 = {
        sender: friend,
        recipient: user
    }

    try {
        const resp = await FriendRequest.deleteMany({$or: [filter1, filter2]});
        res.status(200).json(resp);
    } catch (error) {
        res.status(400).json(error.message);
    }
});

module.exports = friendRequestRouter;
