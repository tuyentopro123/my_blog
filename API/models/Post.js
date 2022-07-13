const mongoose = require('mongoose');
const { Schema } = mongoose;

const User = require("./User");

const postSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            unique: true,
            required: [true,"Tiêu đề bài viết không được để trống"],
        },
        imgPost: {
            type: String,
            default: "",
        },
        content: {
            type: String,
            required: [true,"Nội dung bài viết không được để trống"],
            default: "",
        },
        user: {
            type: Schema.Types.ObjectId, 
            ref: "User" ,
            required: true,
        },
        slug: {
            type: String,
            unipue: true,
            required: true,
            default: "",
        },
        user_save: {
            type: Array,
            default: [],
        },
        like_user: [
            {
                type: Schema.Types.ObjectId, ref: "User" 
            }
        ],
        likes: {
            type:Number,
            default: 0
        },
        category: {
            type:Array,
            required: true,
            default: []
        },
        fields: {
            type: String,
            required: true,
        },
        view: {
            type: Number,
            default: 0,
        },
        commentCount: {
            type:Number,
            default: 0
        }
    },{timestamps: true,}
)


module.exports = mongoose.model("Post",postSchema);