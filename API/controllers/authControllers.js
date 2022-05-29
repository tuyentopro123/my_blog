const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

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
    
    // GENERATE ACCESS TOKEN
    generateAccessToken: (user) => {
        return  jwt.sign({
            id: user.id,
            admin: user.isAdmin,
        },
        process.env.ACCESS_KEY,
        {
            expiresIn: "1d"
        });
    },

    // GENERATE REFRESH TOKEN
    generateRefreshToken: (user) => {
        return  jwt.sign({
            id: user.id,
            admin: user.isAdmin,
        },
        process.env.ACCESS_KEY,
        {
            expiresIn: "365d"
        });
    },

    // LOGIN
    loginUser: async(req,res) => {
        try {
            const user = await User.findOne({email: req.body.email}).populate({
                path:"posts",
                model:"Post",
                populate:{
                    path:"user",
                    model:"User"
                }
            })
            if(!user) {
                return res.status(404).json("Wrong user!")
            }
            const validPassword = await bcrypt.compare(
                req.body.password,
                user.password
            )
            if(!validPassword) {
                return res.status(404).json("Wrong password");
            }
            if(user && validPassword) {
                const accessToken = authControllers.generateAccessToken(user)
                const refreshToken = authControllers.generateRefreshToken(user)
                refreshTokens.push(refreshToken);
                res.cookie("refreshToken", refreshToken, {
                    httpOnlyCookies: true,
                    secure: false,
                    path: "/",
                    sameSite:"strict"
                })
                const {password, ...info} = user._doc;
                res.status(200).json({...info,accessToken});
            }
        }
        catch(err) {
            console.error(err);
            res.status(500).json(err)
        }
    },

      // UPDATE USER
    updateUser: async(req, res) => {
        console.log(req.body)
        try {
            const userUpdated = await User.findByIdAndUpdate(
                req.params.id, 
                {
                    $set: req.body,
                },
                {new: true},
            ).populate({
                path:"posts",
                model:"Post",
                populate:{
                    path:"user",
                    model:"User"
                }
            })
                const accessToken = authControllers.generateAccessToken(userUpdated)
                const refreshToken = authControllers.generateRefreshToken(userUpdated)
                refreshTokens.push(refreshToken);
                res.cookie("refreshToken", refreshToken, {
                    httpOnlyCookies: true,
                    secure: false,
                    path: "/",
                    sameSite:"strict"
                })
                const {password, ...info} = userUpdated._doc;
            return res.status(200).json({...info,accessToken})
        } catch(err) {
            console.log(err)
            res.status(500).json(err)
        }
    },

    requestRefreshToken: async(req, res) => {
        // Take refresh token from user
        const refreshToken = req.cookie.refreshToken;
        if(!refreshToken) return res.status(401).json("you are not authenticated");
        if(!refreshTokens.includes(refreshToken)) return res.status(403).json("refresh token is not valid");
        jwt.verify(refreshToken, process.env.REFRESH_KEY, (err,user) => {
            if(err) {
                console.log(err);
            }
            refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
            // CREATE NEW ACCESS TOKEN ,REFRESH TOKEN
            const newAccessToken = authControllers.generateAccessToken(user)
            const newRefreshToken = authControllers.generateRefreshToken(user)
            refreshToken.push(newRefreshToken)
            res.cookie("refreshToken", newRefreshToken, {
                httpOnlyCookies: true,
                secure: false,
                path: "/",
                sameSite:"strict"
            })
        res.status(200).json({accessToken: newAccessToken})
        })
    },

    // GET CURRENT USER
    getCurrentUSer: async(req, res) => {
        try {
            const currentUser = await User.findById(req.params.id)
            console.log(currentUser)
            const accessToken = authControllers.generateAccessToken(currentUser)
            const {password, ...info} = currentUser._doc;
            res.status(200).json({...info, accessToken})
        } catch(err) {
            console.log(err)
            res.status(500).json(err)
        }
    },

    // LOGOUT
    userLogout: async(req,res) => {
        res.clearCookie("refreshToken");
        refreshTokens = refreshTokens.filter(token => token !== req.cookies.refreshToken);
        res.status(200).json("user logout!")
    }

}

module.exports = authControllers;