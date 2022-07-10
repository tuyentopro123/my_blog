import React from 'react'
import './AuthorItem.scss'
import male from '../../assets/img/male.png'
import female from '../../assets/img/female.png'
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";



const AuthorItem = ({user}) => {
    const navigate = useNavigate()
    const currentUser = useSelector((state)=> state.auth.login?.currentUser)

// GET USER 
  const handleGetUser = async () => {
    navigate(`/infor/${user._id}`,{state:user._id})
  }
  return (
    <div className="item">
        <div className="item__container">
            <div className="item__avatar">
                <div className="item__avatar__img">
                    <img src={user.image ? user.image : user.sex === 'male' ? male : female} alt="" />
                </div>
                <div onClick={handleGetUser}>
                    <button>chi tiết</button>
                </div>
            </div>

            <div className="item__desc">
                <div className="item__desc__intro">
                    <h2>{user.username}</h2>
                    <h4>Địa chỉ: <span>{user.address ? user.address : "Chưa cập nhật"}</span></h4>
                    <h4>Email: <span>{user.email}</span></h4>
                    <h4>Số bài viết: <span>{user.posts.length > 0 ? user.posts.length : "Chưa cập nhật"}</span></h4>
                </div>
            </div>
        </div>
    </div>
  )
}

export default AuthorItem