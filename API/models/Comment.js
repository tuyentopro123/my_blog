const mongoose = require('mongoose');
const { Schema } = mongoose;


const commentSchema = new mongoose.Schema(
    {
        user_name: { 
            type: String, 
            required: true, 
        },
        user_img: { 
            type: String, 
            required: true, 
        },
        user: {
            type: Schema.Types.ObjectId, 
            ref: "User" 
        },
        user_receiver: {
            type: String, 
            required: true, 
        },
        post: { 
            type: Schema.Types.ObjectId, 
            ref: "Post" 
        },
        comment: { 
            type: String, 
            required: [true,"Bạn cần viết một điều gì đó"], 
            min: 3 
        },
        reaction:{
            type: String, 
            default: ""
        },
        reaction_count:{
            type: Number, 
            default: 0
        },
        inter_user: { 
            type: Array,
            default:[] 
        }
    },{timestamps: true,}
)

module.exports = mongoose.model("Comment",commentSchema);