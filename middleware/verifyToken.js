const jwt = require('jsonwebtoken');
const User = require("../models/users");

async function verifyToken(req, res, next) {
    const token = req.cookies.token || '';
  
    try {
      if (!token) {
        throw new Error('No token provided');
      }
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
      req.id = decoded;
  
      req.user = await User.findById(decoded.id).select('-password');
      //check if the user exits
      if(req.user === null){
        //destroy the cookie
        res.clearCookie('token');
        return res.redirect('/users/login');
      }
      // Check if token has expired
      const nowInSeconds = Math.floor(Date.now() / 1000);
      if (decoded.exp < nowInSeconds) {
        res.redirect('/users/login');
        //throw new Error('Token has expired');
      }
  
      next();
    } catch (err) {
      console.log(err);
      res.redirect('/users/login');
    }
  }

  module.exports = {verifyToken};