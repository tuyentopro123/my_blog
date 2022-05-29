import React from 'react'
import './AuthorItem.scss'
import male from '../../assets/img/male.png'
import female from '../../assets/img/female.png'
import { getUsers } from "../../redux/apiRequest"
import { useDispatch } from "react-redux";
import { createAxios } from "../../createInstance";
import {loginSuccess} from "../../redux/authSlice"
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";



const AuthorItem = ({user}) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const currentUser = useSelector((state)=> state.auth.login?.currentUser)
    let axiosJWT = createAxios(user, dispatch, loginSuccess);

// GET USER 
  const handleGetUser = async () => {
    await getUsers(user._id,currentUser.accessToken,dispatch)
    navigate(`/infor/${user._id}`)
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