const express = require('express');
const router = express.Router();
const usersController = require("../controllers/users");
require('dotenv').config();

router.post('/signup',usersController.signUp);


module.exports = router;
