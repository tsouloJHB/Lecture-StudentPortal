
const resourcesModel = require("../models/resources");

module.exports.resources = async (req, res) => {
    const documents = await this.getDocuments(req.user);
    console.log(req.user)
    console.log(documents);
    return res.render('resources',{documents,user:req.user});
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
        return this.resources(req,res);
    } catch (error) {
        console.log(error)
        
    }
}

module.exports.getDocuments = async(user)=>{
    //get documents for course and year from user info
    try {
        let documents  = [];
        if(user.lecture){
            documents = await resourcesModel.find()
            .sort({ createdAt: -1 }) // Sort by createdAt in descending order (latest first)
            .limit(20);
        }else{
          documents = await resourcesModel.find({
                course:user.course,
                year:user.year
            });
        }

        return documents
    } catch (error) {
     
        console.log(error);
        return [];
    }

}


module.exports.deleteDocument = async (req, res) => {
    try {
        const user = req.user;
        const { documentId } = req.params; // Get documentId from the URL parameter

        // Ensure that the user is the owner of the document (by checking the 'user' field)
        const documentToDelete = await resourcesModel.findOne({ user, _id: documentId });

        if (!documentToDelete) {
            // If the document doesn't exist or doesn't belong to the user, return an error message
            return res.status(404).json({ success: false, message: 'Document not found or unauthorized.' });
        }

        // Delete the document
        await resourcesModel.deleteOne({ _id: documentId });

        // Return a success message
        return res.status(200).json({ success: true, message: 'Document deleted successfully.' });
    } catch (error) {
        console.error(error);
        // Return an error message in case of an exception
        return res.status(500).json({ success: false, message: 'An error occurred while deleting the document.' });
    }
};

