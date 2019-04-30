const Joi = require("joi");
const httpStatus = require("http-status-codes");
const Post = require("../models/Post");
const User = require("../models/User");

module.exports = {
  addPost(req, res) {
    const Schema = Joi.object().keys({
      post: Joi.string().required()
    });
    const body = {
      post: req.body.post
    };
    const { error } = Joi.validate(body, Schema);
    if (error && error.details) {
      return res.status(httpStatus.BAD_REQUEST).json({
        msg: error.details
      });
    }
    const bodyObj = {
      user: req.user._id,
      username: req.user.username,
      post: req.body.post,
      created: new Date()
    };

    Post.create(bodyObj)
      .then(async post => {
        await User.updateOne(
          {
            _id: req.user._id
          },
          {
            $push: {
              posts: {
                postId: post._id,
                post: req.body.post,
                created: new Date()
              }
            }
          }
        );
        res.status(httpStatus.OK).json({
          message: "Post created",
          post
        });
      })
      .catch(err => {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
          message: "Error occured"
        });
      });
  },

  async GetAllPosts(req, res) {
    try {
      const posts = await Post.find({})
        .populate("user")
        .sort({
          created: -1
        });

      return res.status(httpStatus.OK).json({
        message: "All posts",
        posts
      });
    } catch (err) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        message: "Error occured"
      });
    }
  },

  async addLike(req, res) {
    const postId = req.body._id;
    await Post.updateOne(
      {
        _id: postId,
        "likes.username": {
          $ne: req.user.username
        }
      },
      {
        $push: {
          likes: {
            username: req.user.username
          }
        },
        $inc: {
          totalLikes: 1
        }
      }
    )
      .then(() => {
        res.status(httpStatus.OK).json({
          message: "You Liked the post"
        });
      })
      .catch(err => {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
          message: "Error occured"
        });
      });
  },

  async addComment(req, res) {
    const postId = req.body.postId;
    await Post.updateOne(
      {
        _id: postId
      },
      {
        $push: {
          comments: {
            userId: req.user._id,
            username: req.user.username,
            comment: req.body.comment,
            createdAt: new Date()
          }
        }
      }
    )
      .then(() => {
        res.status(httpStatus.OK).json({
          message: "Comment added to post"
        });
      })
      .catch(err => {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
          message: "Error occured"
        });
      });
  },

  async GetPost(req, res) {
    await Post.findOne({
      _id: req.params.id
    })
      .populate("user")
      .populate("comments.userId")
      .then(post => {
        res.status(httpStatus.OK).json({
          message: "Post found ",
          post
        });
      })
      .catch(err =>
        res.status(httpStatus.NOT_FOUND).json({
          message: "Post not found ",
          post
        })
      );
  },

  EditPost(req, res) {
    console.log(req.body);
    const Schema = Joi.object().keys({
      post: Joi.string().required(),
      id: Joi.string().optional()
    });
    const { error } = Joi.validate(body, Schema);
    if (error && error.details) {
      return res.status(httpStatus.BAD_REQUEST).json({
        msg: error.details
      });
    }
    const body = {
      post: req.body.post,
      created: new Date()
    };

    Post.findOneAndUpdate({ _id: req.body.id }, body, { new: true })
      .then(post => {
        res
          .status(httpStatus.OK)
          .json({ message: "Post updated successfully", post });
      })
      .catch(err => {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
          message: err
        });
      });
  },

  async DeletePost(req, res) {
    try {
      const { id } = req.params;
      const result = await Post.findByIdAndRemove(id);
      console.log(result);
      if(!result) {
        return res.status(HttpStatus.NOT_FOUND).json({message: 'could not delete post'})
      } else {
        await User.update({
          _id: req.user._id
        }, {
          $pull: {posts: {
            postId: result._id
          }}
        });
        return res.status(httpStatus.OK).json({ message: 'post succesfully deleted' })
      }
    } catch (err) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        message: err
      });
    }
  }
};
