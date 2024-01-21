const User = require("../models/user.js");
const sendEmail = require("../middleware/email.js");
const generateDynamicEmail = require("../test.js");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const cloudinary = require ("../middleware/cloudinary.js")
const {
    validatorUser,
    validatorUser2
} = require ("../middleware/validator")

const signUp = async (req, res) => {
    try {
        const {error} = validatorUser(req.body);
        if(error){
            res.status(500).json({
                message: error.details[0].message
            })
            return;
        } else {
        //Get the required field from the request object body

        const { firstName,
             lastName,
             email,
              password,
              phoneNumber,
            //   userName,
            //   age,
            //   gender
             } = req.body;
             

        //make sure all required fields are filled
        //  if(!name || !email || !password){
        //     return res.status(401).json({
        //         message : "Please fill all required fields"
        //     })
        //check if the user already exists in the database
    
        const checkUser = await User.findOne({ email: email.toLowerCase() })
        if (checkUser) {
            return res.status(200).json({
                message: "User already exists"
            })
        }
        
        //Encrypt the user's password

        const salt = await bcrypt.genSaltSync(10);
        const hashedPassword = await bcrypt.hashSync(password, salt);
        const token = jwt.sign({ firstName, lastName, email }, process.env.jwtSecret, { expiresIn: "300s" })
        // const profilePicture = req.files.profilePicture.tempFilePath
        // const fileUploader = await cloudinary.uploader.upload(profilePicture, { folder: "Fitness-Media" }, (err, profilePicture) => {
        //     try {
      
        //       // Delete the temporary file
        //       fs.unlinkSync(profilePicture);
      
        //       return profilePicture
        //     } catch (err) {
        //       return err
        //     }
        //   })
        //Create a user
        const user = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            phoneNumber,
            // userName,
            // age,
            // gender,
            // profilePicture:{
            //     url: fileUploader.url,
            //     public_id: fileUploader.public_id
            }
            
            
        )
        
        user.token = token
sendEmail({

email:user.email,
subject:'KINDLY VERIFY YOUR ACCOUNT',
html: generateDynamicEmail(`${req.protocol}://${req.get("host")}/verify/${user.id}/${user.token}`, user.firstName, user.lastName)

})
   
                await user.save();      

                res.status(201).json({
                    message: "User successfully created",
                    data: user
                })
        

            }
    } catch (error) {
        res.status(500).json({
            message: error.message
        })

    }
}
//Function to verify a new user with a link
const verify = async (req, res) => {
    try {
      const id = req.params.id;
    //   const token = req.params.token;
      const user = await User.findById(id);

      // Verify the token
     jwt.verify(user.token, process.env.jwtSecret);
  
  
      // Update the user if verification is successful
      const updatedUser = await User.findByIdAndUpdate(id, { isVerified: true }, { new: true });
      console.log(updatedUser) 
      if (updatedUser.isVerified === true) {
        return res.status(200).send("<h1>You have been successfully verified. Kindly visit the login page.</h1>");
      }
      
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        // Handle token expiration
        const id = req.params.id;
        const updatedUser = await User.findById(id);
        //const { firstName, lastName, email } = updatedUser;
        const newtoken = jwt.sign({ email: updatedUser.email, firstName: updatedUser.firstName, lastName: updatedUser.lastName }, process.env.jwtSecret, { expiresIn: "300s" });
        updatedUser.token = newtoken;
        updatedUser.save();
  
        const link = `${req.protocol}://${req.get('host')}/verify/${id}/${updatedUser.token}`;
        sendEmail({
          email: updatedUser.email,
          html: generateDynamicEmail(link, updatedUser.firstName, updatedUser.lastName),
          subject: "RE-VERIFY YOUR ACCOUNT"
        });
        return res.status(401).send("<h1>This link is expired. Kindly check your email for another email to verify.</h1>");
      } else {
        return res.status(500).json({
          message: "Internal server error: " + error.message,
        });
      
    };
    }
}

const login = async (req, res) => {
    try{
        {const {error} = validatorUser2(req.body);
        if(error){
            res.status(500).json({
                message: error.details[0].message
            })
            return;
        } else {
            const {email, password} = req.body;
        const userExists = await User.findOne({email: email.toLowerCase()});
        if (!userExists) {
            res.status(404).json({
                message: "User not found"
            })
            return;
        }
        const checkPassword = bcrypt.compareSync(password, userExists.password);
        if (!checkPassword) {
            res.status(404).json({
                message: "Password is incorrect"
            })
            return;
        }
        const token = jwt.sign({
            userId: userExists._id,
            email: userExists.email,
        }, process.env.jwtSecret, {expiresIn: "1day"});
        res.status(200).json({
            message: "Login successful",
            token: token
        })

        }
    }
    } catch (err) {
        res.status(500).json({
            message: "Internal server error " + err.message,
        })
    }

};


const forgotpassWord = async (req, res) => {
    const resetFunc = require("../forget.js")
    try {
        const checkUser = await User.findOne({ email: req.body.email })
        if (!checkUser) {
            res.status(404).json("Email doesn't exist")
        } else {
            const subject = " Kindly reset your password"
            const link = `${req.protocol}://${req.get("host")}/reset/${checkUser.id}`
            const html = resetFunc(link, checkUser.firstName, checkUser.lastName)
            sendEmail({

                email: checkUser.email,
                subject: subject,
                html: html

            })


            res.status(200).json("kindly check your email for a link to reset your password")

        }
} catch (error) {
        res.status(500).json(error.message)
    }

}


const resetpassword = async (req, res) => {
    try {
        const password = req.body.password

        const id = req.params.id

        const salt = await bcrypt.genSaltSync(10);
        
        const hashedPassword = await bcrypt.hashSync(password, salt);

        const data = { password: hashedPassword }

        const reset = await User.findByIdAndUpdate(id, data, { new: true })


        res.status(200).json(`your password has been succesfully changed`)

    } catch (error) {
        res.status(500).json(error.message)
    }
}
const logOut = async (req, res) =>{
    try{
        //Get the user's Id from the request user payload
        const {userId} = req.user
        //
        const hasAuthorization = req.headers.authorization;
        //check if it is empty
        if (!hasAuthorization){
            return res.status(401).json({message: "Authorization token not found"})
        }
        //Split the token from the bearer
        const token = hasAuthorization.split(" ")[1];

        const user= await User.findById(userId);

        //check if the user does not exist
        if(!user){
            return res.status(404).json({message: "User not found"})
        }

        //Blacklist the token
        user.blacklist.push(token);

        await user.save();

        //Return a response

        res.status(200).json({message: "User logged out successfully"})

    }catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}
    






module.exports = {
    signUp, verify, login, forgotpassWord, resetpassword, logOut,
}
