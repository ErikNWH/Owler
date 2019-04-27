const HttpStatus = require('http-status-codes')
const User = require('../models/User')

module.exports = {
    followUser(req, res) {
        const followUser = async () => {
            await User.updateOne({
                _id: req.user._id,
                "following.userFollowed": {$ne: req.body.userFollowed}
            }, {
                $push: {
                    following: {
                        userFollowed: req.body.userFollowed
                    }
                }
            })

            await User.updateOne({
                _id: req.body.userFollowed,
                "following.follower": {$ne: req.user._id}
            }, {
                $push: {
                    followers: {
                        follower: req.user._id
                    }
                }
            })
        };

        followUser()
        .then(() => {
            res.status(HttpStatus.OK).json({message: 'Following user'})
        })
        .catch((err) => {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Error occured'})
        });
    },

    unFollowUser(req, res) {
        const unFollowUser = async () => {
            await User.updateOne({
                _id: req.user._id,
            }, {
                $pull: {
                    following: {
                        userFollowed: req.body.userFollowed
                    }
                }
            })

            await User.updateOne({
                _id: req.body.userFollowed,
                "following.follower": {$ne: req.user._id}
            }, {
                $pull: {
                    followers: {
                        follower: req.user._id
                    }
                }
            })
        };

        unFollowUser()
        .then(() => {
            res.status(HttpStatus.OK).json({message: 'unfollowing user'})
        })
        .catch((err) => {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Error occured'})
        });
    }
}