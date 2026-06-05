require('dotenv').config()
const getConnection = require( "./config/db");
const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require ('bcrypt');
const User = require('./models/userModel')
getConnection();

require("./config/db");

const app = express(); 
const port = 3000;

// middleware for parsing
app.use(bodyParser.json());

app.post('/register', async(req, res)=>{
    try{
        const {firstName, lastName, email, password: pass, role} = req.body

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(pass, salt);

        const user = await User.create({
                firstName,
                lastName,
                email,
                password: hash,
                role 
        });

        const { password, ...userData} = user._doc;
        res.status(200).json(userData);

    }catch (err) {
        console.error(err);
        res.status(500).json({message: err.message})
    }
});



app.listen(port, () =>{
    console.log("Порт відкрито", port);
    
})
 
