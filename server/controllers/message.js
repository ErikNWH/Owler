const HttpStatus = require("http-status-code");
const Message = require("../models/Message");
const Conversation = require("../models/Conversation");
const User = require("../models/User");

module.exports = {
  SendMessage(req, res) {
    //console.log(req.body)

    /**
     * @description Checks if conversation already exists
     */
    const { sender_Id, receiver_Id } = req.params;

    Conversation.find({
      $or: [
        {
          participants: {
            $elemMatch: { senderId: sender_Id, receiverId: receiver_Id }
          }
        },
        {
          participants: {
            $elemMatch: { senderId: receiver_Id, receiverId: sender_Id }
          }
        }
      ]
    }, async (err, result) => {
        if (result.length > 0) {

        } else {
            
        }
    });
  }
};
