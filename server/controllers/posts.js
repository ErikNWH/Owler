const Joi = require('joi');
const httpStatus = require("http-status-codes");
const Post = require('../models/Post')
const User = require('../models/User')

module.exports = {
    addPost(req, res) {
        const Schema = Joi.object().keys({
            post: Joi.string().required(),
        });
        const {
            error
        } = Joi.validate(req.body, Schema);
        if (error && error.details) {
            return res.status(httpStatus.BAD_REQUEST).json({
                msg: error.details
            });
        }
        const body = {
            user: req.user._id,
            username: req.user.username,
            post: req.body.post,
            created: new Date()
        }

        Post.create(body).then(async (post) => {
            await User.updateOne({
                _id: req.user._id
            }, {
                $push: {posts: {
                    postId: post._id,
                    post: req.body.post,
                    created: new Date()
                }}
            })
            res.status(httpStatus.OK).json({
                message: 'Post created',
                post
            });
        }).catch(err => {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                message: 'Error occured'
            });
        })
    },

    async GetAllPosts(req, res) {
        try {
            const posts = await Post.find({})
            .populate('user')
            .sort({created: -1});

            return res.status(httpStatus.OK).json({ message: 'All posts', posts })
        }catch(err) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error occured' })
            
        }
    },

    async addLike(req, res) {
        const postId = req.body._id;
        await Post.update(
            {
            _id: postId,
            'likes.username': { $ne: req.user.username }
        }, {
            $push: { 
                likes: {
                    username: req.user.username
            }
        },
        $inc: {
            totalLikes: 1
        },
        })
        .then(() => {
            res.status(httpStatus.OK).json({ message: 'You Liked the post' });
        })
        .catch(err => {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error occured' })
        })
    }
}