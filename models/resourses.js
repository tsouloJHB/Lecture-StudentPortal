const mongoose = require("mongoose");

const ResourcesSchema = new mongoose.Schema(
    {

       user:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
      },
      name: {
        type: String,
        max: 500,
      }, 
      module: {
        type: String,
        max: 500,
      },
      course: {
        type: String,
        max: 50,
      },
      path: {
        type: String,
        max: 50,
      },
   
    },
    { timestamps: true }
  );
  
  module.exports = mongoose.model("Resources",  ResourcesSchema);
  