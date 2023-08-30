const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
      },  
    Extroversion: {
        type: Number,
        min: 1,
        max: 100
      },
      Agreeableness: {
        type: Number,
        min: 1,
        max: 100
      },
      Conscientiousness: {
        type: Number,
        min: 1,
        max: 100
      },
      Neuroticism: {
        type: Number,
        min: 1,
        max: 100
      },
      OpennessExperience: {
        type: Number,
        min: 1,
        max: 100
      },
      personalityCode:{
        type:String,
        max:50
      }, 
},
{ timestamps: true }  
);

const quiz = mongoose.model('quiz', quizSchema);

module.exports = quiz;
