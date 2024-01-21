const express = require('express');

const {signUp,verify, login,forgotpassWord,resetpassword, logOut}= require ("../controller/userController");
const  {
    createGoal,
    getAllGoals,
    updateGoal,
    deleteGoal
  }= require ("../controller/goalController")
const {createExercise,
    getAllExercises,
  updateExercise,
deleteExercise,}= require ("../controller/exerciseController")
    const authenticate = require ("../middleware/authentication")



const router = express.Router();
router.post("/register",signUp);
router.post("/create/:id", authenticate,createGoal);
router.get ("/allGoals", authenticate, getAllGoals)
router.post("/exercise/:id",authenticate, createExercise)
router.get ("allExercises", authenticate, getAllExercises)
//endpoint to update a student's scores when login is successful
router.put('/update/:goalId', authenticate, updateGoal);
router.put('/updates/:exId', authenticate, updateExercise);
router.put('/delete/:exId', authenticate, deleteExercise);

//endpoint to delete a student's scores when login is unsuccessful
router.delete('/delete/:goalId', authenticate, deleteGoal);


router.get("/verify/:id/:token",verify);
router.post("/login", login);
router.post("/forgot", forgotpassWord);
router.put("/reset/:id",resetpassword);
router.put('/logout', authenticate, logOut);

module.exports = router


//mediaUpload.array("profilePicture", 5),