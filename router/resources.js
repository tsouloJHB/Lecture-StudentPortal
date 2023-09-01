const express = require('express');
const router = express.Router();
const resourcesController = require('../controllers/resources');
const {verifyToken} = require("../middleware/verifyToken");
const {upload} = require("../middleware/upload");

router.get('/',verifyToken,resourcesController.resources);
router.post('/',verifyToken,upload,resourcesController.uploadDocument);
router.delete('/:documentId', verifyToken, resourcesController.deleteDocument);


module.exports = router