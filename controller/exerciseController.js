// controllers/exerciseController.js
const Exercise = require('../models/exercise');
const userModel = require ("../models/user")

// Create a new exercise
const createExercise = async (req, res) => {
  try {
    const user = await userModel.findById( req.params.id)
    const { exerciseType, duration } = req.body;
    const newExercise = new Exercise({ exerciseType, duration});
    await newExercise.save()
    user.exercise.push(newExercise)
    user.save()
    res.status(201).json(newExercise);
    // const savedExercise = await newExercise.save();
    // res.status(201).json(savedExercise);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all exercises for a specific user
const getAllExercises = async (req, res) => {
  try {
    const { userId } = req.params;
    const exercises = await Exercise.find({ user: userId }).populate('exercise');
    res.json(exercises);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const updateExercise = async (req, res) => {
  try {
      const exId = req.params.exId;       
      const exercise = await Exercise.findById(exId);
      console.log(exercise);
      if (!exercise) {
          res.status(404).json({
              message: 'User with exercise Id not found'
          })
          return;
      }
    
      const userEx = {exerciseType: req.body.exerciseType || exercise.exerciseType,
                      duration : req.body.duration || exercise.duration}

      const newEx = await Exercise.findByIdAndUpdate(exId, userEx, {new:true});
      if (!newEx) { 
          res.status(404).json({
              message: 'Exercise not found'
          })
          return;
      } 
      res.status(200).json({
          message: `The user with ${req.user.email} exercise has been updated successfully`,
          data: newEx
      })
  } catch (err) {
      res.status(500).json({
          message: "Internal server error: " +err.message
      })
  } 
}


// Function to update a student score 
const deleteExercise = async (req, res) => {
  try {
      const exId = req.params.exId;       
      const exercise = await Exercise.findById(exId);
      if (!exercise) {
          res.status(404).json({
              message: 'user with exercise id not found'
          })
          return;
      }

      await Exercise.findByIdAndDelete(exId); 
      res.status(200).json({
          message: `The  user with ${req.user.email} exercise deleted successfully`,
    
      })

  } catch (err) {
      res.status(500).json({
          message: "Internal server  error: " + err.message,
      })
  }
}

module.exports = {
  createExercise,
  getAllExercises,
  updateExercise,
  deleteExercise,
};