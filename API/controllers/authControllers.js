const User = require('../models/User')
const bcrypt = require('bcrypt')

let refreshTokens = [];
const authControllers = {
    // RESIGNTER
    resigterUser: async(req,res) => {
        try {
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(req.body.password, salt);            

            // Create new user
            const newUser = await new User({
                username: req.body.username,
                email: req.body.email,
                password: hashed,
                sex:req.body.sex
            }) 

            // Save to database
            const user = await newUser.save()
            res.status(200).json(user);
        } 
        catch (err) {
            console.error(err)
            res.status(500).json(err)
        }
    },

    // LOGIN
    loginUser: async(req,res) => {
        try {
            if(req.user) {
                const user = await User.findById(req.user)
                res.status(200).json({
                    success:true,
                    message: "successfully",
                    user:user,
                });
            } else {
                res.status(200).json({
                    success:false,
                    message: "failure",
                    user:null,
                });
            }
        }
        catch(err) {
            console.log(err);
            res.status(500).json(err)
        }
    },

    // GET CURRENT USER
    getCurrentUser: async(req,res) => {
        try {
            const user = await User.findById(req.params.id)
            res.status(200).json(user)
        }
        catch(err) {
            console.log(err);
            res.status(500).json(err)
        }
    },



        // LOGOUT
    userLogout: async(req,res) => {
        req.session.destroy((err) => {
            res.status(200).json("logout success");
        });
    }

}

module.exports = authControllers;