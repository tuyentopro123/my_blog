const mongoose = require('mongoose');
const { Schema } = mongoose;


const notificationSchema = new mongoose.Schema(
    {
        sender_img:{ 
            type: String, 
            required:true, 
        },
        sender_user:{ 
            type: String, 
            required: true, 
        },
        user_receiver:{ 
            type: String, 
            required: true, 
        },
        sender_comment: {
            type: String, 
            default:"",
        },
        action:{
            type : String,
            required: true,
        },
        action_icon:{
            type : String,
            required: true,
        },
        reaction:{
            type : String,
            required: true,
        },
        seen:{
            type: Boolean,
            default: false,
            required: true,
        }
    },{timestamps: true,}
)

module.exports = mongoose.model("Notification",notificationSchema);