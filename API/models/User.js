const mongoose = require('mongoose');
const { Schema } = mongoose;
const Post = require("./Post");

const userSchema = new mongoose.Schema(
    {
        socialId: String,
        username: {
            type: String,
            required: true,
            minlength: 6,
            maxlength: 30,
            unique: true,
        },
        email: {
            type: String,
            unique: true,
        },
        password: {
            type: String,
            minlength: 10,
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },
        image: {
            type: String,
            default: "",
        },
        number: {
            type: String,
            default: "",
        },
        address: {
            type: String,
            default: "",
        },
        story: {
            type: String,
            default: "",
        },
        sex: {
            type: String,
            default: "male",
        },
        posts: [
            { 
                type: Schema.Types.ObjectId, 
                ref: "Post" 
            }
        ],
        posts_save: [
            { 
                type: Schema.Types.ObjectId, 
                ref: "Post" 
            }
        ],
        notification_count: {
            type:Number,
            default: 0,
        },
        favorite: {
            type: Number,
            default: 0,
        }
    },{timestamps: true,}
);

module.exports = mongoose.model("User",userSchema);