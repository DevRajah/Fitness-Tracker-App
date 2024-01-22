// models/UserData.js
const mongoose = require('mongoose');

const userDataSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true

    },
    lastName: {
        type: String,
        required: true

    },
    phoneNumber: {
        type: String,
        required: true

    },
    email: {
        type: String,
        required: true

    },

    password: {
        type: String,
        required: true
    }, 
    gender: {
        type: String,
        required: true,
        enum : ["Female", "Male"]
    },
    token: {
        type: String,
    },
    isVerified :{
        type : Boolean,
        default : false
    },
    goals:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Goal"
    
    }],
    exercise:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Exercise"
    
    }],
    profilePicture: {

        public_id: {
            type: String,
         
        },
        url:{
            type: String,
        }
    },
    blacklist:{
        type: Array,
        default:[]
      },
  
}, { timestamps: true });
const User = mongoose.model('UserData', userDataSchema);
module.exports = User