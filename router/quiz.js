const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quiz');
const {verifyToken} = require("../middleware/verifyToken");

router.get('/',quizController.quiz);
router.post('/',verifyToken,quizController.saveQuiz);

module.exports = router