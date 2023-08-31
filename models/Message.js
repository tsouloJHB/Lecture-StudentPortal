const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
    {
        groupChat:{
            type:mongoose.Schema.Types.ObjectId,
            ref: 'GroupChat',
            required: true
        },
        privateChatId:{
            type:String,
        },
        senderId:{
            type:mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true
        },  
        text:{
            type:String,
        },
    },
    {
        timestamps:true,
    }
);

module.exports = mongoose.model("Messages",MessageSchema);