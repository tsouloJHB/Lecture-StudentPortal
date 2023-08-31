const multer = require('multer');


// Configure multer storage and upload settings
const Storage = multer.diskStorage({
    destination: "public/documents/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname);
    },
});

const upload = multer({
    storage: Storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: function (req, file, cb) {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed'));
        }
    }
}).single('documentUpload');



// const upload = multer({
//     storage: multer.diskStorage({
//                 destination: "public/documents",  // Storage location
//                 filename: (req, res, (cb) => {
//                         cb(null, Date.now() + path.extname(file.originalname))
//                         // return a unique file name for every file             
//                 })
//         }),
//     limits: {fileSize: 50000000},
//     // This limits file size to 2 million bytes(2mb)    fileFilter: 
//     fileFilter: (req, file, cb) => {
//         // Create regex to match jpg and png
//         const validFileTypes = /pdf|jpg|jpeg|png/

//         // Do the regex match to check if file extenxion match
//         const extname = fileTypes.test(path.extname(file.originalname).toLowerCase())
//             if(mimetype && extname){
//                 // Return true and file is saved
//         return cb(null, true)
//     }else{
//                 // Return error message if file extension does not match
//        return cb("Error: Images Only!")
//     }
//     }
// }).single("documentUpload")


module.exports = {upload}