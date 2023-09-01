
const resourcesModel = require("../models/resources");

module.exports.resources = async (req, res) => {
    const documents = await this.getDocuments(req.user);
    console.log(req.user)
    console.log(documents);
    res.render('resources',{documents,user:req.user});
}

module.exports.uploadDocument = async(req,res)=>{
    // courseImage:'/images/courseimages/'+req.file.filename,
    const {module,course,year} = req.body;
    const path = '/documents/'+req.file.filename;
    try {
        const resources = new resourcesModel({
            user:req.user,
            course,
            module,
            path,
            name:req.file.filename,
            year
        });
        await resources.save();
        res.status(200).json("True");
    } catch (error) {
        console.log(error)
        
    }
}

module.exports.getDocuments = async(user)=>{
    //get documents for course and year from user info
    try {
        const documents  = await resourcesModel.find({
            course:user.course,
            year:user.year
        });
        return documents
    } catch (error) {
     
        console.log(error);
        return [];
    }

}
