const GroupChatModel = require("../models/GroupChat");
const MessageModel = require("../models/Message");

module.exports.addMessage = async(req,res) =>{
    const {groupChatId,senderId,text} = req.body;
    console.log(req.body);
    try {
       console.log(groupChatId);
        const groupChatModel = await GroupChatModel.findById(groupChatId);
        
        if(groupChatModel){
            //console.log(groupChatModel)
            const message = new MessageModel({

                groupChat:groupChatModel._id,           
                senderId,
                text
           
            });
            
      
            const result = await message.save();
            res.status(200).json(result);
        }else{
            console.log("Group chat not found");
            res.status(401).json("Group chat not found");
        }
       
    } catch (err) {
        res.status(500).json(err);
    }
}


module.exports.getGroupMessages = async (groupChatId) =>{

    try {
        const messages = await MessageModel.find({groupChat:groupChatId});
        return messages;
    } catch (error) {
        console.log(error);
        return []
    }
}
