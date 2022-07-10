const Post = require('../models/Post')
const User = require('../models/User')
const Comment = require('../models/Comment')
const Notification = require('../models/Notification')
const { cloudinary } = require('../utils/cloudinary')
const ApiFeatures = require("../utils/apifeatures");

const postControllers = {
    //CREATE POST
    createPost: async (req, res) => {
        try {
            const post = new Post({
                ...req.body
            })
            const user = await User.findById(req.params.id)
            const newPost = await post.save()
            user.posts.push(newPost._id)
            await user.save()
            return res.status(200).json("Create post successfully")
        }catch(err) {
            return res.status(500).json(err)
        }
    },

    // GET ALL POST 
    getAllPost: async (req, res) => {
        console.log("hah")
        const field =  req._parsedUrl.pathname.slice(1)
        const category = req.query.category
        const pageSize = 4
        try {
            const option = category ? {fields: field,category:{$in:[category]}} : {fields: field}
            const totalPost = await Post.countDocuments(option)
            const apiFeature = new ApiFeatures(
                Post.find(option)
                .populate("user"),
                req.query.pagePost
            )
            apiFeature.pagination(pageSize)
            const post = await apiFeature.query;
            return res.status(200).json({
                post,
                totalPost
            })
        }catch(err) {
            return res.status(500).json(err)
        }
    },

    // GET ALL POST USER
    getAllPostUser: async (req, res) => {
        try {
            const post = await Post.find({
                user:req.params.id
            })
            return res.status(200).json(post)
        }catch(err) {
            return res.status(500).json(err)
        }
    },

    // GET POST
    getPost: async (req, res) => {
        try {
            const userPost = await Post.findById(req.params.id).populate('user').populate('like_user')
            const relatedPost = await Post.find({
                _id:{ $nin: [req.params.id]},
                user: userPost.user
            }).populate('user')
            userPost.view++;
            await userPost.save()
            return res.status(200).json({
                userPost,
                relatedPost
            })
        } catch(err) {
            return res.status(500).json(err)
        }
    },

    // GET POST RANDOM
    getRanDomPost: async (req, res) => {
        try {
            const randomPosts1 = await Post.aggregate([
                {
                    $sample: {size: 4},
                }
            ])
            const randomPosts2 = await Post.aggregate([
                {
                    $sample: {size: 4},
                }
            ])
            return res.status(200).json({
                randomPosts1, 
                randomPosts2
            })
        } catch(err) {
            return res.status(500).json(err)
        }
    },

    // UPDATE POST
    updatePost: async (req, res) => {
        try {
            const post = await Post.findById(req.params.id)
            const user = await User.findById(post.user)
            const senderUser = await User.findById(req.body.user)
            if(post.like_user.includes(req.body.user)) {
                await post.like_user.pull(req.body.user)
                post.likes--
                user.favorite--
                await user.save()
            } else {
                await  post.like_user.push(req.body.user)
                post.likes++
                user.favorite++
                await user.save()
                if(req.body.user !== post.user) {
                    const notification = new Notification({
                        sender_img:senderUser.image,
                        sender_user:senderUser.username,
                        user_receiver:post.user,
                        action:"likePost",
                        action_icon:"heart",
                        reaction:req.params.id,
                    })
                    await notification.save()
                    user.notification_count++
                    await user.save()
                }
            }
            await post.save()
            const postRequest = await Post.findById(req.params.id).populate('user').populate('like_user')
            return res.status(200).json(postRequest)
        } catch(err) {
            console.log(err)
            return res.status(500).json(err)
        }
    },


    // POST SEARCH
    postSearch: async (req, res) => {
        try {
            const apiFeature = new ApiFeatures(Post,req.query.searchQuery).search()
            const post = await apiFeature.query
            return res.status(200).json(post)
        } catch(err) {
            return res.status(500).json(err)
        }
    },

    // RATE POSTS BY LIKE
    postHighLight: async (req, res) => {
        try {
            const post = await Post.find().sort({likes:-1}).limit(5).populate("user")
            return res.status(200).json(post)
        } catch(err) {
            console.error(err)
            return res.status(500).json(err)
        }
    },

    // RATE POSTS BY COMMENTS
    postComment: async (req, res) => {
        try {
            const post = await Post.find().sort({commentCount:-1}).limit(5).populate("user")
            return res.status(200).json(post)
        } catch(err) {
            console.error(err)
            return res.status(500).json(err)
        }
    },

    // NEWEST POST
    postNew: async (req, res) => {
        try {
            const allPost = await Post.countDocuments()
            const newPost = await Post.find().skip(allPost - 4).populate("user")
            return res.status(200).json(newPost)
        } catch(err) {
            console.error(err)

            return res.status(500).json(err)
        }
    },

    // RATE POSTS BY VIEW
    postView: async (req, res) => {
        try {
            const post = await Post.find().sort({view:-1}).limit(4).populate("user")
            return res.status(200).json(post)
        } catch(err) {
            console.error(err)

            return res.status(500).json(err)
        }
    },

    // UPLOAD IMAGE POST
    uploadImagePost: async(req, res) => {
        try {
            const fileStr = req.body.data;
            const uploadResponse = await cloudinary.uploader.upload(fileStr,{upload_preset: "post_upload"})
            return res.status(200).json(uploadResponse)
        }catch(err) {
            console.log(err)
            res.status(500).json(err)
        }
    },

    // UPLOAD thumbnail POST
    uploadThumbPost: async(req, res) => {
        try {
            const fileStr = req.body.data;
            const uploadResponse = await cloudinary.uploader.upload(fileStr,{upload_preset: "thumbnail_upload"})
            return res.status(200).json(uploadResponse)
        }catch(err) {
            console.log(err)
            res.status(500).json(err)
        }
    },

    
}

module.exports = postControllers;