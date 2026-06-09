const User = require ("../models/userModel");
const bcrypt = require("bcrypt")

// Стоврення методу/способу базової аутентифікації
// Next показує, що ми хочемо рухатись в наступний виклик в мідлвер
 module.exports = async(req, res, next)=>{
    if(!req.headers.authorization || req.headers.authorization.indexOf('Basic')===-1){
return res.status(401).json({message: "Invalid authorization method"})
    }
// верифікація аутентифікації 
    const base64Credentials = req.headers.authorization.split(' ')[1];

    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');

    const[email, password] = credentials.split(':');
    const user = await User.findOne({email});
    console.log(user);
    
     if (!user) {
          return res.status(404).json({message: "bla bla bla"});
        }
    
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
        //   console.error("Ваша помилка", error.message);
          return res.status(400).json({
            message: "Invalid password or email",
          });
        }

        // Запамятовування в обєкті реквест, для подальшого перевикористання
        req.user = user._doc;
        next();
}