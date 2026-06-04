const mongoose = require("mongoose");

const getConnection = async () => {
  try {
    console.log("Значення MONGO_URI:", process.env.MONGO_URL);
    const connection = await mongoose.connect(process.env.MONGO_URL);
  } catch (error) {
    console.error("failed to load" + error);
    process.exit(1); 
  }
};

module.exports = getConnection;