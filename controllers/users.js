const UserModel = require("../models/users");
const utils = require("../utils/token");

const maxAge =  3 * 24 * 60 * 60 * 1000;

const handleErrors = (err) =>{
    console.log(err.message );
    errors = [
        
      ]
    
     //incorrect email
     if(err.message === 'Incorrect email'){
        errors.push({
            field: "email",
            msg: 'Incorrect email or password',
          });
    }

    //incorrect password
    if(err.message === 'Incorrect password'){
        
        errors.push({
            field: "password",
            msg: 'Incorrect email or password',
          });
    }

    //duplicate error code
    if(err.code === 11000){
        errors.push({
            field: "email",
            msg: 'That email is already registered',
          });
        // errors.msg= "That email is already registered";
    
    }
    if (err.name === 'ValidationError') {
        if (err.errors && Object.keys(err.errors).length > 0) {
            const validationErrors = {};
            for (const field in err.errors) {
                errors.push({
                    field: field,
                    msg: err.errors[field].message,
                  });
            }
           
          } else {
          
          }
    }
     //validation error
  
    return errors;
}   

module.exports.signUp = async (req, res) => {
    const { email, password, name, surname,confirmpassword,course,year,lecture } = req.body;
    try {
        console.log(req.body);
        const newUser = new UserModel({ email, password, name, surname,course,year,lecture });
        const user = await newUser.save();
        console.log(user);
        const token = utils.generateAuthToken(user._id);
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: maxAge, // 5 days in milliseconds
        });
        // res.redirect('/quiz/q');
       res.status(201).json("User saved");
    } catch (error) {
        console.log(error);
        const errors = handleErrors(error);
        res.status(400).json( errors );
    }    
  
};

module.exports.login = async (req, res) => {

}

module.exports.getUsers = async (usersIds) => {
    try {
       
        const users = await UserModel.find({
            _id: { $in: usersIds }
        });
      
        return users;
    } catch (error) {
        throw error;
    }
};