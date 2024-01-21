// models/Goal.js
const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  goals:{
    type : mongoose.Schema.Types.ObjectId,
    ref: "UserData"
  },

},);
const Goal =mongoose.model('Goal', goalSchema);
module.exports = Goal