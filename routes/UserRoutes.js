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
    const user = req.body.user;

    try {
        const retrievedUser = await User.findOne({username: user});
        res.status(200).json(retrievedUser);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
})

userRouter.post('/getMany', async (req, res) => {
    const users = req.body.users;

    try {
        const returnedUsers = await User.find({_id: {$in: users}});
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
        "_id username firstName lastName fullName").limit(5);
        res.status(200).json(returnedUsers);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
})

userRouter.post('/globalSearch', async (req, res) => {
    const query = req.body.query;

    const aggregate = [
        {
            $search: {
                index: "usersSearchIndex",
                compound: {
                    should: [
                        {
                            autocomplete: {
                                path: "username",
                                query: query
                            }
                        }, {
                            autocomplete: {
                                path: "fullName",
                                query: query
                            }
                        }   
                    ]
                }
            }
        }, {
            $project: {
                fullName: 1,
                firstName: 1,
                lastName: 1,
                username: 1
            }
        }
    ];

    try {
        const returnedUsers = await User.aggregate(aggregate);
        res.status(200).json(returnedUsers);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
})

userRouter.post('/addSession', async(req, res) => {
    const user = req.body.user;
    const session = req.body.session;

    try {
        const retrievedUser = await User.findOneAndUpdate({_id: user}, {$push: {sessions: session}}, {new: true});
        res.status(200).json(retrievedUser);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
})

userRouter.post('/hasActiveSession', async (req, res) => {
    const user =  req.body.user;

    try {
        const retrievedUser = await User.findOneAndUpdate({_id: user}, {hasActiveSession: true}, {new: true});
        res.status(200).json(retrievedUser);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
})

userRouter.post('/hasNoActiveSession', async (req, res) => {
    const user =  req.body.user;

    try {
        const retrievedUser = await User.findOneAndUpdate({_id: user}, {hasActiveSession: false}, {new: true});
        res.status(200).json(retrievedUser);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
})

userRouter.post('/endSessionForAll', async (req, res) => {
    const contributors = req.body.contributors;

    try {
        const user = await User.updateMany({_id: {$in: contributors}}, {hasActiveSession: false}, {new: true});
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
})

// Adds friends to each others' friends lists
userRouter.post('/addFriendMutually', async (req, res) => {
    const user = req.body.user;
    const friend = req.body.friend;

    try {
        const resp = await User.bulkWrite([{
            updateOne: {
                filter: {_id: user},
                update: {$addToSet: {friends: friend}}
            }
        }, {
            updateOne: {
                filter: {_id: friend},
                update: {$addToSet: {friends: user}}
            }
        }]);
        res.status(200).json(resp);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
})

// Removes friends from the corresponding users' friends lists
userRouter.post('/removeFriendMutually', async (req, res) => {
    const user = req.body.user;
    const friend = req.body.friend;

    try {
        const resp = await User.updateMany({_id: {$in: [user, friend]}}, {$pull: {friends: {$in: [user, friend]}}}, {new: true});
        res.status(200).json(resp);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
});

userRouter.post('/update', async (req, res) => {

    const filter = {
        _id: req.body.user
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

