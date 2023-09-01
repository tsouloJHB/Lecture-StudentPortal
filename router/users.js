const express = require('express');
const router = express.Router();
const usersController = require("../controllers/users");
require('dotenv').config();

router.post('/signup',usersController.signUp);
router.post('/login',usersController.login);


module.exports = router;
