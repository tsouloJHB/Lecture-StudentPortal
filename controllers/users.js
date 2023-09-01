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
            maxAge: maxAge, 
        });
         if (user.lecture) {  
            res.redirect('/resources');
        } else {
            res.redirect('/groupChat');
        }
        // res.redirect('/quiz/q');
     
    } catch (error) {
        console.log(error);
        const errors = handleErrors(error);
        res.status(400).json( errors );
    }    
  
};

module.exports.login = async (req, res) => {

    const { email, password } = req.body;
    if(email === "" || email === null && password === "" || password === null){
        return res.status(401).json("Empty fields");
    }
    try{
         const user = await UserModel.login(email, password);
          const token = utils.generateAuthToken(user._id);
          res.cookie('token', token, {
            httpOnly: true,
            maxAge: maxAge, // 5 days in milliseconds
            });
            if(user.lecture){
                return res.status(200).json("resources");
            }
            res.status(200).json("groupChat");
    }catch(error){
        console.log(error);
        res.status(401).json("An error occurred");
    }
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

module.exports.renderLogin = async (errors) =>{
    res.render('login',{errors});
}

module.exports.signOut = async(req,res) =>{
    res.clearCookie('token');
  
    res.redirect('/');
}

   
   

