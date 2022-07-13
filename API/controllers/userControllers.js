const User = require('../models/User');
const { cloudinary } = require('../utils/cloudinary')
const ApiFeatures = require("../utils/apifeatures");
const Notification = require('../models/Notification');
const Post = require('../models/Post');
const Comment = require('../models/Comment');



const userControllers = {
    // GET ALL USER ON PAGE
    getAllUsers: async (req, res) => {
        const pageSize = 4
        try {
            const userCount = await User.countDocuments()

            const apiFeature = new ApiFeatures(User.find(),req.query.pageUser)
            
            apiFeature.pagination(pageSize)

            const user = await apiFeature.query;
            res.status(200).json({
                user,
                userCount
            })
        } 
        catch(err) {
            console.log(err)
            res.status(500).json(err)
        }
    },

    // GET USER
    getUser: async (req, res) => {
        try {
            const user = await User.findById(req.params.id).populate({
                path:"posts",
                model:"Post",
                populate:{
                    path:"user",
                    model:"User"
                }
            })
            res.status(200).json(user)
        } 
        catch(err) {
            console.log(err)
            res.status(500).json(err)
        }
    },

    // GET TOP USER
    getTopUsers: async (req, res) => {
        try {
            const user = await User.find().sort({favorite: -1}).limit(5)
            res.status(200).json(user)
        } 
        catch(err) {
            console.log(err)
            res.status(500).json(err)
        }
    },

    // DELETE USER
    deleteUser: async(req, res) => {
        try {
            const user = await User.findByIdAndDelete(req.params.id)
            res.status(200).json("delete successfully!")
        }
        catch(err) {
            console.log(err)
            res.status(500).json(err)
        }
    },

    // UPLOAD IMAGE
    uploadImage: async(req, res) => {
        try {
            const fileStr = req.body.data;
            // await cloudinary.uploader.upload(fileStr,{upload_preset: "avatar_upload"})
            const uploadResponse = await cloudinary.uploader.upload(fileStr,{upload_preset: "avatar_upload"})
            return res.status(200).json(uploadResponse)
        }catch(err) {
            console.log(err)
            res.status(500).json(err)
        }
    },

    // GET NOTIFICATION OF USER 
    getNofitication: async (req, res) => {
        try {
            const notification = await Notification.find({user_receiver:req.params.id}).sort({createdAt:-1})
            const user = await User.findById(req.params.id)
            user.notification_count = 0
            await user.save()
            return res.status(200).json(notification)
        }catch(err) {
            console.log(err)
            res.status(500).json(err)
        }
    },

    // ACCESS NOTIFICATION OF USER 
    accessNofitication: async (req, res) => {
        var post = {}
        var action = false
        try {
            const notification = await Notification.findById(req.body._id)
            if(req.body.action === "likePost") {
                post = await Post.findById(req.body.reaction)
            } else {
                if(req.body.action === "comment") {
                    post = await Post.findById(req.body.reaction)
                    action = true
                } else {
                    const comment = await Comment.findById(req.body.reaction)
                    post = await Post.findById(comment.post)
                    action = true
                }
            }
            notification.seen = true
            await notification.save()
            return res.status(200).json({
                post,
                action
            })
        }catch(err) {
            console.log(err)
            res.status(500).json(err)
        }
    }
}

module.exports = userControllers;