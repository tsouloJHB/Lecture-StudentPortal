const { default: mongoose } = require('mongoose');

const connectDb  = async () =>{
    const URL = process.env.MONGO_URI;
 
    mongoose.set("strictQuery", false);
    try{
        await mongoose.connect(URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
          });
        console.log('MongoDb is connected');
    }catch (err){
        console.log(err.message)
    }
}
module.exports = connectDb;