const User = require('../models/User')
const httpStatus = require('http-status-codes')

module.exports = {
    async GetAllUsers(req, res) {
        await User.find({})
        .populate('post.postId')
        .then((result) => {
            res.status(httpStatus.OK).json({message: 'All users', result});
        }).catch( err => {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message: 'Error occured' })
        })
    }
};