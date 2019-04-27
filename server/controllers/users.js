const User = require('../models/User')
const httpStatus = require('http-status-codes')

module.exports = {
    async GetAllUsers(req, res) {
        await User.find({})
        .populate('post.postId')
        .populate('following.userFollowed')
        .populate('folowers.follower')
        .then((result) => {
            res.status(httpStatus.OK).json({message: 'All users', result});
        }).catch( err => {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message: 'Error occured' })
        })
    },

    async GetUser(req, res) {
        await User.findOne({_id: req.params.id})
        .populate('post.postId')
        .populate('following.userFollowed')
        .populate('folowers.follower')
        .then((result) => {
            res.status(httpStatus.OK).json({message: 'User by Id', result});
        }).catch( err => {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message: 'Error occured' })
        })
    },
    
    async GetUserByName(req, res) {
        await User.findOne({username: req.params.username})
        .populate('post.postId')
        .populate('following.userFollowed')
        .populate('folowers.follower')
        .then((result) => {
            res.status(httpStatus.OK).json({message: 'User by name', result});
        }).catch( err => {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message: 'Error occured' })
        })
    }

};