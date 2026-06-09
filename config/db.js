const mongoose = require("mongoose");

const getConnection = async () => {
  try {
    console.log("Значення MONGO_URI:", process.env.MONGO_URL);
   await mongoose.connect(process.env.MONGO_URL);
   console.log("Connected to DB");
   
  } catch (error) {
    console.error("failed to load" + error);
    process.exit(1); 
  }
};

module.exports = getConnection;

