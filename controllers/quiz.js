


module.exports.quiz = async (req, res) => {
    res.render('quiz');
}


const Quiz = require('../models/quiz'); // Import the quiz model

module.exports.saveQuiz = async (req, res) => {
  const { Extroversion, Agreeableness, Conscientiousness, Neuroticism, OpennessExperience } = req.body;
  const user = req.user; // Assuming you have the authenticated user's data in req.user

  try {
    // Create a new quiz instance
    const newQuiz = new Quiz({
      user: user._id,
      Extroversion,
      Agreeableness,
      Conscientiousness,
      Neuroticism,
      OpennessExperience,
      // You can calculate the personalityCode based on the scores if needed
      personalityCode: calculatePersonalityCode(Extroversion, Agreeableness, Conscientiousness, Neuroticism, OpennessExperience)
    });

    // Save the quiz data
    await newQuiz.save();

      // Update the user's quiz field with the newly created quiz ID
      user.quiz = newQuiz._id;
      await user.save();

    res.status(201).json("Quiz saved");
  } catch (error) {
    res.status(500).json({ error: "An error occurred while saving the quiz data." });
  }
};

// Helper function to calculate personality code
function calculatePersonalityCode(E, A, C, N, O) {
  // ... Perform your calculation here based on the scores
  // Example: Combine the first letter of each trait's classification
  return `${E >= 20 ? 'E' : 'I'}${A >= 20 ? 'A' : 'D'}${C >= 20 ? 'C' : 'U'}${N >= 20 ? 'N' : 'O'}${O >= 20 ? 'O' : 'C'}`;
}
