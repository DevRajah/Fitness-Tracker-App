// controllers/goalController.js
const Goal = require('../models/goals');
const userModel=require("../models/user")

// Create a new goal
const createGoal = async (req, res) => {
  try {
    const user=await userModel.findById(req.params.id)
    const { description } = req.body;
    const newGoal = new Goal({ description });
    await newGoal.save();
    user.goals.push(newGoal)
    user.save()
    res.status(201).json(newGoal);
        
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all goals for a specific user
const getAllGoals = async (req, res) => {
  try {
    const { userId } = req.params;
    const goals = await Goal.find({ user: userId }).populate('goals')
    res.json(goals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const updateGoal = async (req, res) => {
  try {
      const goalId = req.params.goalId;       
      const goal = await Goal.findById(goalId);
      console.log(goal);
      if (!goal) {
          res.status(404).json({
              message: 'Goal not found'
          })
          return;
      }
    
      const userGoal = {description: req.body.description || goal.description}

      const newGoal = await Goal.findByIdAndUpdate(goalId, userGoal, {new:true});
      if (!newGoal) { 
          res.status(404).json({
              message: 'Goals not found'
          })
          return;
      } 
      res.status(200).json({
          message: `The user with ${req.user.email} goal has been updated successfully`,
          data: newGoal
      })
  } catch (err) {
      res.status(500).json({
          message: "Internal server error: " +err.message
      })
  } 
}


// Function to update a student score 
const deleteGoal = async (req, res) => {
  try {
      const goalId = req.params.goalId;       
      const goal = await Goal.findById(goalId);
      if (!goal) {
          res.status(404).json({
              message: 'Goal not found'
          })
          return;
      }

      await Goal.findByIdAndDelete(goalId); 
      res.status(200).json({
          message: `The  user with ${req.user.email} goal deleted successfully`,
    
      })

  } catch (err) {
      res.status(500).json({
          message: "Internal server  error: " + err.message,
      })
  }
}

module.exports = {
  createGoal,
  getAllGoals,
  updateGoal,
  deleteGoal,
};