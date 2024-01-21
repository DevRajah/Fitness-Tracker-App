const jwt = require('jsonwebtoken');
const userModel = require('../models/user')
require('dotenv').config();


const authenticate =async (req, res, next)=>{
    try{
        const hasAuthorization = req.headers.authorization;


        // check if user has a token
        if (!hasAuthorization){
            return res.status(401).json ({
                message: "User not authorized"
            })
        }
        //seperate the token from the bearer
        const token = hasAuthorization.split(' ')[1];
        if(!token){
            return res.status(400).json({
                message: "Invalid token"
            })
        }
        
        //decode the token
        const decodeToken = jwt.verify(token, process.env.jwtSecret); 

        const user = await userModel.findById(decodeToken.userId);

        if (!user) {
            return res.status(404).json({
                message: "Participant not found",
            })
        }
        if(user.blacklist.includes(token)){
            return res.status(400).json({
                message : "Authorization failed: Please login again",
            })
        

        }
        //pass the payload into the request user
        req.user = decodeToken
        next();

    } catch(err){
        if(err instanceof jwt.JsonWebTokenError){
            res.status(500).json({
                message: 'Sessionn timedout, please log in again'
            })
            return res.status(500).json({
                message: "Error authenticating" + err.message
            })
            
        }
        
    }

}
module.exports = authenticate