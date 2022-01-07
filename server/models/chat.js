const mongoose = require("mongoose");
//chat room schema, only supporting two participants
//examples for pushing to array
// PersonModel.update(
//     { _id: person._id }, 
//     { $push: { friends: friend } },
//     done
// );

const MessageSchema = new mongoose.Schema({
    from_id: {
      type: String,
      require: true,
      min: 3,
      max: 20
    },
    message: String 
  },
  { timestamps: true}
)
// use _id for chat room indexing and access
const ChatRoomSchema = new mongoose.Schema(
  {
    admin: {
      type: String,
      require: true,
      min: 3,
      max: 20
    },
    participants: [String],
    messages:[MessageSchema]
  },
  {timestamps: true}
);

exports.ChatRoomModel =mongoose.model('ChatRoom', ChatRoomSchema)
exports.MessageModel=mongoose.model('Message', MessageSchema)