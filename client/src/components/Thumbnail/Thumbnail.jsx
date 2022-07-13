import React,{useState} from 'react'
import './Thumbnail.scss'
import bgEmty from '../../assets/img/thumbnail_emty.jpg'
import { useDispatch,useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import male from '../../assets/img/male.png'
import female from '../../assets/img/female.png'
import GetTime from '../../utils/GetTime'

const Thumbnail = ({post,infor}) => {
  const navigate = useNavigate()
  const currentUser = useSelector((state)=> state.auth.login?.currentUser)
// GET USER 
  const handleGetUser = () => {
    navigate(`/infor/${post.user._id}`,{state:post.user._id})
  }

// GET POST
  const handleGetPost = () => {
    navigate(`/post/${post.slug}`,{state: post._id})
  }


  return (
    <div className="thumbnail">
        <div className={`thumbnail__container ${infor ? infor : ''}`} >
            <div  
              className="thumbnail__img" 
              onClick={handleGetPost}
              >
                <div className="thumbnail__img__container" style={{backgroundImage: `url(${post.imgPost || bgEmty})`}}>
                  <div className="thumbnail__img__overlay"></div>
                </div>
            </div>
            <div className="thumbnail__desc">
              <span>{post.fields}</span>
              <div onClick={handleGetPost}>
                <h2>{post.title}</h2>
              </div>
              <div className="thumbnail__inter">
                  <div onClick={handleGetUser} className="thumbnail__inter__infor">
                      <h4>by <span>{post.user.username}</span> since {GetTime(post.createdAt)}</h4>
                  </div>
              </div>
            </div>

       
        </div>
    </div>
  )
}

export default Thumbnail