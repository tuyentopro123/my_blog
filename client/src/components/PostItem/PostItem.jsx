import { Avatar } from '@mui/material';
import React from 'react'
import "./PostItem.scss";
import {useNavigate} from "react-router-dom"
import getTimeString from '../../utils/GetTimeString';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';

const PostItem = ({post}) => {
    const navigate = useNavigate()
    // GET POST
  const handleGetPost = () => {
    navigate(`/post/${post.slug}`,{state: post._id})
  }
  return (
    <div className="postItem" onClick={handleGetPost}>
        <div className="postItem__container" style={{backgroundImage: `url(${post.imgPost})`}}>
            <div className="postItem__content">
                <div className={`postItem__content__label ${post.fields}`}>
                    <span>{post.fields}</span>
                </div>

                <div className="postItem__content__title">
                    <h1>{post.title}</h1>
                </div>

                <div className="postItem__content__author">
                    <div className="postItem__content__author__user">
                        <Avatar src={post.user.image}/>
                        <span>{post.user.username}</span>
                    </div>

                    <div className="postItem__content__author__time">
                        <AccessTimeIcon sx={{fontSize:20}}/>
                        <span>{getTimeString(post.createdAt)}</span>
                    </div>

                    <div className="postItem__content__author__icon">
                        <FavoriteBorderOutlinedIcon sx={{fontSize:20}}/>
                        <span>{post.likes}</span>
                    </div>

                    <div className="postItem__content__author__icon">
                        <ChatBubbleOutlineIcon sx={{fontSize:20}}/>
                        <span>{post.commentCount}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default PostItem