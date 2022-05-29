import React,{useState} from 'react'
import './Thumbnail.scss'
import bgEmty from '../../assets/img/thumbnail_emty.jpg'
import { useDispatch,useSelector } from "react-redux";
import { getUserPost } from "../../redux/apiRequest"
import { useNavigate } from "react-router-dom";
import male from '../../assets/img/male.png'
import female from '../../assets/img/female.png'
import { getUsers } from "../../redux/apiRequest"
import { createAxios } from "../../createInstance";
import { loginSuccess } from '../../redux/authSlice';
import GetTime from '../../utils/GetTime'

const Thumbnail = ({post,infor}) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  let axiosJWT = createAxios(post.user, dispatch, loginSuccess);
  const currentUser = useSelector((state)=> state.auth.login?.currentUser)
// GET USER 
  const handleGetUser = async () => {
    await getUsers(post.user._id,currentUser.accessToken,dispatch)
    navigate(`/infor/${post.user._id}`)
  }

// GET POST
  const handleGetPost = async() => {
    await getUserPost(dispatch,post._id)
    navigate(`/post/${post.slug}`)
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
              <div onClick={handleGetPost}>
                <h2>{post.title}</h2>
              </div>
              <div className="thumbnail__inter">
                  <div onClick={handleGetUser} className="thumbnail__inter__infor">
                      <img src={post.user.image ? post.user.image : post.user.sex === 'male' ? male : female } alt="" />
                      <span>{post.user.username}</span>
                  </div>
                  <div className="thumbnail__inter__time">
                    <span style={{userSelect:"none"}}>{GetTime(post.createdAt)}</span>
                  </div>
              </div>
            </div>

            <div className={`thumbnail__fields ${post.fields}`}>
              <span>{post.fields}</span>
            </div>
        </div>
    </div>
  )
}

export default Thumbnail