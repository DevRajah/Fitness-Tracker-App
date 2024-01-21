const hapiJoiValidator = require("@hapi/joi");

const validatorUser = (data) => {
    const validateUser = hapiJoiValidator.object({
        firstName: hapiJoiValidator.string().trim().required().min(3).max(40)
          .pattern(/^[A-Za-z\s]+$/).messages({
            'string.empty': 'First name cannot be empty',
            'string.min': 'Minimum 3 characters required',
            'string.max': 'Maximum 40 characters allowed',
            'any.pattern.base': 'Name should only contain letters and spaces',
            'any.required': 'First name is required',
          }),
          lastName: hapiJoiValidator.string().trim().required().min(3).max(40)
          .pattern(/^[A-Za-z\s]+$/).messages({
            'string.empty': 'Name cannot be empty',
            'string.min': 'Minimum 3 characters required',
            'string.max': 'Maximum 40 characters allowed',
            'any.pattern.base': 'Name should only contain letters and spaces',
            'any.required': 'Last name is required',
          }),
          // userName: hapiJoiValidator.string().trim().required().min(3).max(40)
          // .pattern(/^[A-Za-z\s]+$/).messages({
          //   'string.empty': 'Name cannot be empty',
          //   'string.min': 'Minimum 3 characters required',
          //   'string.max': 'Maximum 40 characters allowed',
          //   'any.pattern.base': 'Name should only contain letters and spaces',
          //   'any.required': 'Username is required',
          // }),
        email: hapiJoiValidator.string().email({ tlds: { allow: false } }).required().max(40).messages({
          'string.empty': 'Email cannot be empty',
          'any.required': 'Email is required',
        }),
        password: hapiJoiValidator.string().required().min(8)
        .pattern(new RegExp(/^[A-Za-z0-9!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]+$/)).messages({
          'string.empty': 'Password cannot be empty',
          'string.min': 'Minimum 8 characters required',
          'any.pattern.base': 'Password should contain letters, numbers, and special characters',
          'any.required': 'Password is required',
        }),
        phoneNumber: hapiJoiValidator.string().regex(/^0\d{10}$/).length(11)
        .message({
            'number.empty' : "Phone number cannot be empty",
            'number.min' : "Phone number must be 10 characters long"
        
        }),
        // age: hapiJoiValidator.number().required().min(1).message({
        //     'number.empty' : "Age is required",
        //     'number.min' : "Age must be 1 character long"
        
        // }),

        // gender: hapiJoiValidator.string().trim().required().min(4).max(6)
        // .pattern(/^[A-Za-z\s]+$/).messages({
        //   'string.empty': 'Gender cannot be empty',
        //   'string.min': 'Minimum 4 characters required for gender',
        //   'string.max': 'Maximum 6 characters allowed',
        //   'any.pattern.base': 'Gender should only contain letters and no spaces',
        //   'any.required': 'Gender is required',
        // }),
        
    
      });

      const validationUser = validateUser.validate(data);

return validationUser;
}

const validatorUser2 = (data) => {
    const validateUser = hapiJoiValidator.object({
        email: hapiJoiValidator.string().email({ tlds: { allow: false } }).required().max(40).messages({
            'string.empty': 'email cannot be empty',
          }),
        password: hapiJoiValidator.string().required().min(8),

    })
    return validateUser.validate(data);
};



module.exports = {
    validatorUser, 
    validatorUser2 

};