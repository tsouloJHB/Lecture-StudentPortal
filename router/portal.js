const express = require('express');
const router = express.Router();
const {verifyToken} = require("../middleware/verifyToken");
const portalController = require("../controllers/portal");

router.get('/',verifyToken,portalController.portal);

module.exports = router;