const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
require("dotenv").config();
const getConnection = require("./config/db");
const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const User = require("./models/userModel");
const checkAuth = require("./middleware/checkAuth");
const checkAdmin= require("./middleware/checkAdmin");
const app = express();
const port = 3000;
getConnection();

// middleware for parsing
app.use(bodyParser.json());

// Створення юзера
app.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password: pass, role } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(pass, salt);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hash,
      role,
    });

    const { password, ...userData } = user._doc;
    return res.status(200).json(userData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// Створення функції логінізації

app.post("/login", async (req, res) => {
  try {
    const { email, password:pass } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json("User not found");
    }

    const isValid = await bcrypt.compare(pass, user.password);
    if (!isValid) {
    //   console.error("Ваша помилка", error.message);
      return res.status(400).json({
        message: "Invalid password or email",
      });
    }
    const {password, ...userData} = user._doc;
    return res.status(200).json(userData)
  } catch (error) {
    console.error("Помилка при реєстрації");
    res.status(200).json({ message: error.message });
  }
});

// Authorization: Basic X
  app.get('/books', checkAuth, checkAdmin, async (req, res)=>{
    return res.send("All books");
  });


app.listen(port, () => {
  console.log("Порт відкрито", port);
});
