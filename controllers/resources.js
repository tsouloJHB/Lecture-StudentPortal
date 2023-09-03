
const resourcesModel = require("../models/resources");
const fs = require('fs');
const pdf = require('pdf-parse');

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


// Function to search for text in the PDF
async function searchPdf(searchTerm,pdfPath) {
    try {
      // Read the PDF file
      const dataBuffer = fs.readFileSync(pdfPath);
  
      // Convert the PDF to text
      const data = await pdf(dataBuffer);
  
      // Extracted text from the PDF
      const pdfText = data.text;
  
      // Split the PDF text into paragraphs based on empty lines
      const paragraphs = pdfText.split(/\n\s*\n/);
  
      // Initialize an array to store matching paragraphs
      const matchingParagraphs = [];
  
      // Loop through paragraphs to find matches
      for (const paragraph of paragraphs) {
        if (paragraph.includes(searchTerm)) {
          // Include the paragraph containing the search term
          matchingParagraphs.push(paragraph);
        }
      }
  
      return matchingParagraphs;
    } catch (error) {
      throw error;
    }
  }
  
  // Controller function to search for text in the PDF
  module.exports.researchPdf = async (req, res) => {
    try {
        const resourceId = req.params.resourceId; // Get the resource ID from request parameters
        const searchText = req.query.searchText; // Get the search text from query parameters
    
        // Find the resource by ID
        const resource = await resourcesModel.findById(resourceId);
    
        if (!resource) {
          // If the resource doesn't exist, return an error response
          return res.status(404).json({ message: 'Resource not found.' });
        }

  
      if (!searchText) {
        return res.status(400).json({ message: 'Search term is required.' });
      }
      const path = "public"+resource.path;
      // Call the searchPdf function to perform the search
      const matchingParagraphs = await searchPdf(searchText,path);
  
      if (matchingParagraphs.length > 0) {
        res.status(200).json({ matchingParagraphs });
      } else {
        res.status(404).json({ message: 'No matching paragraphs found.' });
      }
    } catch (error) {
      console.error('Error searching PDF:', error);
      res.status(500).json({ message: 'An error occurred while searching the PDF.' });
    }
  };