const UserModel = require("../models/users");



const handleErrors = (err) =>{
    errors = [
        {
          type: 'field',
          value: '',
          msg: '',
          path: 'password',
          location: 'body'
        }
      ]
     //incorrect email
     if(err.message === 'Incorrect email'){
        errors.msg = 'Incorrect email or password';
    }

    //incorrect password
    if(err.message === 'Incorrect password'){
        errors.msg = 'Incorrect email or password';
    }

    //duplicate error code
    if(err.code === 11000){
        errors.msg= "That email is already registered";
        return errors;
    }
     //validation error
  
    return errors;
}   

module.exports.signUp = async (req, res) => {
    const { email, password, name, surname,confirmpassword,course,year } = req.body;
    try {
        console.log(req.body);
        const newUser = new UserModel({ email, password, name, surname,course,year });
        const userResponse = await newUser.save();
        res.status(201).json("Data found");
    } catch (error) {
        const errors = handleErrors(error);
      
        console.log(errors);
       
        res.status(400).json({ errors });
    }    
  
};