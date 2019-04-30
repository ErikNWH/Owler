const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    username: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    posts: [
        {
            postId: { type: mongoose.Schema.Types.ObjectId, ref: 'post' },
            post: { type: String },
            created: { type: Date, default: Date.now() }
        }
    ],
    following: [
        {userFollowed: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }}
    ],
    followers: [
        {follower: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }}
    ],
    chatList: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            msgId: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' }
        }
    ]

})

module.exports = mongoose.model('User', userSchema)