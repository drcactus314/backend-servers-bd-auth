const User = require ("../models/userModel");

 module.exports = async(req, res, next)=>{
  try {
      if (!req.user){
    return res.status(404).send({message: "user didn't find"})
   }
    
     if (req.user.role !== "admin") {
          return res.status(500).json({message: "User doesn't have a permission"});
        }

        next();
  } catch (error) {
    res.status(500).json({message: error.message});
    
  }
}