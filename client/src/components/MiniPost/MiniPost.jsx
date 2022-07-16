import React from 'react'
import './MiniPost.scss'
import bgEmty from '../../assets/img/thumbnail_emty.jpg'
import { useDispatch,useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import getTimeString from '../../utils/GetTimeString';

// material ui
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import { red } from '@mui/material/colors';



const MiniPost = ({post}) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const currentUser = useSelector((state)=> state.auth.login?.currentUser)

// GET POST
  const handleGetPost = async() => {
    navigate(`/post/${post.slug}`,{state: post._id})
  }
  return (
    <div className="miniPost">
        <div className={`miniPost__container`} >
            <div  
              onClick={handleGetPost}
              className="miniPost__img" style={{backgroundImage: `url(${post.imgPost || bgEmty})`}}
              >
            </div>
            <div className="miniPost__desc">
              <div onClick={handleGetPost}>
                <h2>{post.title}</h2>
              </div>
              <div className="miniPost__inter">
                  <div className="miniPost__inter__icon">
                    <AccessTimeIcon sx={{fontSize:20,color:red[400]}}/>
                    <span style={{userSelect:"none"}}>{getTimeString(post.createdAt)}</span>
                  </div>
                  <div className="miniPost__inter__icon">
                    <RemoveRedEyeOutlinedIcon 
                    className="miniPost__inter__view__icon"
                    sx={{fontSize: 25,color:red[400] }}
                    fontSize="large"
                    />
                    <span>{post.view}</span> 
                  </div>
              </div>
            </div>
        </div>
    </div>
  )
}

export default MiniPost