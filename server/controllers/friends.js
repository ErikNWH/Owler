const HttpStatus = require("http-status-codes");
const User = require("../models/User");

module.exports = {
  followUser(req, res) {
    const followUser = async () => {
      await User.updateOne(
        {
          _id: req.user._id,
          "following.userFollowed": { $ne: req.body.userFollowed }
        },
        {
          $push: {
            following: {
              userFollowed: req.body.userFollowed
            }
          }
        }
      );

      await User.updateOne(
        {
          _id: req.body.userFollowed,
          "following.follower": { $ne: req.user._id }
        },
        {
          $push: {
            followers: {
              follower: req.user._id
            },
            notifications: {
              senderId: req.user._id,
              message: `${req.user.username} is now following you!`,
              created: new Date(),
              viewProfile: false
            }
          }
        }
      );
    };

    followUser()
      .then(() => {
        res.status(HttpStatus.OK).json({ message: "Following user" });
      })
      .catch(err => {
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: "Error occured" });
      });
  },

  unFollowUser(req, res) {
    const unFollowUser = async () => {
      await User.updateOne(
        {
          _id: req.user._id
        },
        {
          $pull: {
            following: {
              userFollowed: req.body.userFollowed
            }
          }
        }
      );

      await User.updateOne(
        {
          _id: req.body.userFollowed,
          "following.follower": { $ne: req.user._id }
        },
        {
          $pull: {
            followers: {
              follower: req.user._id
            }
          }
        }
      );
    };

    unFollowUser()
      .then(() => {
        res.status(HttpStatus.OK).json({ message: "unfollowing user" });
      })
      .catch(err => {
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: "Error occured" });
      });
  },

  async MarkNotifications(req, res) {
    // console.log(req.body)
    if (!req.body.deleteVal) {
      await User.updateOne(
        {
          _id: req.user._id,
          "notifications._id": req.params.id
        },
        {
          $set: { "notifications.$.read": true }
        }
      )
        .then(() => {
          res.status(HttpStatus.OK).json({ message: "Marked as read" });
        })
        .catch(err => {
          res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ message: "Error occured" });
        });
    } else {
      await User.updateOne(
        {
          _id: req.user._id,
          "notifications._id": req.params.id
        },
        {
          $pull: {
            notifications: { _id: req.params.id }
          }
        }
      )
        .then(() => {
          res.status(HttpStatus.OK).json({ message: "Post deleted" });
        })
        .catch(err => {
          res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ message: "Error occured" });
        });
    }
  },

  async MarkAllNotifications(req, res) {
    await User.update(
      {
        _id: req.user._id
      },
      {
        $set: { "notifications.$[elem].read": true }
      },
      {
        arrayFilters: [{ "elem.read": false }],
        multi: true
      }
    )
      .then(() => {
        res.status(HttpStatus.OK).json({ message: "All notifications marked" });
      })
      .catch(err => {
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: "Error occured" });
      });
  }
};
