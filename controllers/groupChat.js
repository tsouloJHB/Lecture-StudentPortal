const GroupChatModel = require("../models/GroupChat");
const UserModel = require("./users");
const messageController = require("./message");

module.exports.insertUserToGroupChat = async (user, type) => {
    try {
        // Find available group chats with less than 5 members
        let group = await GroupChatModel.findOne({
            personalityType: type,
            year: parseInt(user.year),
            course: user.course,
            $expr: { $lte: [ { $size: "$members" }, 5 ] }
        });
  
        if (!group) {
            // Create a new group chat
            group = await GroupChatModel.create({
                members: [user._id], // Insert the user as the first member
                personalityType: type,
                year: user.year,
                course: user.course
            });
            user.groupChat = group._id;
            await user.save();
          
        } else {
            // Insert the user into the existing group
            group.members.push(user._id);
            await group.save();
            user.groupChat = group._id;
            await user.save();
        }

        return group;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

module.exports.groupChat = async (req, res) => {
    //get groupChat 
   try {
     const group = await GroupChatModel.findById(req.user.groupChat);
     const users = await this.getMembers(group.id);
     //get messages
     const messages = await messageController.getGroupMessages(group.id);
   
     res.render('chat',{members:users,currentUser:req.user,messages,groupChatId:group._id});
   } catch (error) {
        console.log(error);
        res.status(500);
   }
}


module.exports.getMembers = async (groupId) =>{
    try {
        const group  = await GroupChatModel.findById(groupId);
        const users = await UserModel.getUsers(group.members);
        return users;
    } catch (error) {
        throw error;
    }
}
