// models/Exercise.js
const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  exerciseType: {
    type: String,
    required: true,
  },
  
  duration: {
    type: String,
    required: true,
  },
  exercise:{
    type : mongoose.Schema.Types.ObjectId,
    ref: "UserData"
  },
});
const Exercise =mongoose.model('Exercise', exerciseSchema);
module.exports = Exercise