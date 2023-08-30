
const jwt = require('jsonwebtoken');

  const generateAuthToken = (id)=>{
try {
        console.log(id);
        return jwt.sign({id},process.env.JWT_SECRET,{
            expiresIn:'3d',
        });
} catch (error) {
    console.log(error);
}
};

module.exports = {generateAuthToken}