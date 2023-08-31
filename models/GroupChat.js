const mongoose = require("mongoose");

const GroupChatSchema = new mongoose.Schema(
    {
        members:{
            type:Array,
        },
        personalityType: {
            type: String,
            enum: ['Introvert-Stable', 'Introvert-Unstable', 'Extrovert-Stable', 'Extrovert-Unstable'],
            required: true,
        },
        year:{
            type:Number,
            require:true,
        },
        course:{
            type:String,
            require:true
        }
    },
    {
        timestamps:true,    
    }
);

module.exports = mongoose.model("GroupChat",GroupChatSchema);