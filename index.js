// Import required modules
const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const connectDb = require('./db');
const UserRoute = require("./router/users");

dotenv.config();
connectDb();
const bodyParser = require('body-parser');

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Serve static files from the "public" directory
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Parse JSON bodies for API requests
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());


app.use('/users', UserRoute);

app.get('/', async(req, res) => {
   
    res.render('login');
  });
  

const PORT  = process.env.PORT;
app.listen(PORT,() => console.log('Listening on port 8080'));


module.exports = app;