const express = require('express');
const router = express.Router();
const {verifyToken} = require("../middleware/verifyToken");
const groupChatController = require("../controllers/groupChat");

router.get('/',verifyToken,groupChatController.groupChat);

module.exports = router;