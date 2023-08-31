const express = require('express');
const router = express.Router();
const {verifyToken} = require("../middleware/verifyToken");
const messageController = require("../controllers/message");

router.post('/',verifyToken,messageController.addMessage);

module.exports = router;