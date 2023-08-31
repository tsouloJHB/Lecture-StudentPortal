
const resourcesModel = require("../models/resources");

module.exports.resources = async (req, res) => {
    res.render('resources');
}

module.exports.uploadDocument = async(req,res)=>{
    // courseImage:'/images/courseimages/'+req.file.filename,
    const {module,course} = req.body;
    const path = '/documents/'+req.file.filename;
    try {
        const resources = new resourcesModel({
            user:req.user,
            course,
            module,
            path,
            name:req.file.filename
        });
        await resources.save();
        res.status(200).json("True");
    } catch (error) {
        console.log(error)
        
    }
}
