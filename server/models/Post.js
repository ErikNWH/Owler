/**
 * @params mongoose, user
 * @objects UserId, username, comments, createdAt, likes, totalLikes, created, posts
 * @description Schema for mongoDB 
 */

const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    username: { type: String, default: '' },
    post: { type: String, default: '' },
    comments: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            username: { type: String, default: '' },
            comment: { tpye: String, default: '' },
            createdAt: { type: Date, default: Date.now() }
        }
    ],
    totalLikes: { type: Number, default: 0 },
    likes: [
      {
        username: { type: String, default: '' }
      }
    ],
    created: { type: Date, default: Date.now() }
  });

module.exports = mongoose.model('Post', postSchema)