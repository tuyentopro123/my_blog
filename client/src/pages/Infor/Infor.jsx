import React,{useState,useEffect } from 'react'
import './Infor.scss'
import {useLocation, useParams} from 'react-router-dom'
import { useDispatch } from "react-redux";
import { updateUsers } from "../../redux/apiRequest";
import { useSelector } from "react-redux";

import axios from "axios";
import male from '../../assets/img/male.png'
import female from '../../assets/img/female.png'
import Grid from '../../components/utils/Grid/Grid'

import Thumbnail from '../../components/Thumbnail/Thumbnail'
import Helmet from '../../components/Helmet/Helmet';

import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { grey } from '@mui/material/colors';
import CircularProgress from '@mui/material/CircularProgress';

import toast, { Toaster } from 'react-hot-toast';
const notify = () => toast.success('Cập nhật ảnh đại diện thành công');

const Infor = () => {
    const location = useLocation()
    const {id} = useParams()

    const currentUser = useSelector((state)=> state.auth.login?.currentUser)
    const [loading,setLoading] = useState(false) 
    const [user, setUser] = useState();
    const dispatch = useDispatch()

    // Upload image to the cloundinary
    const handleUpload = (e) => {
        setLoading(true)
        const file = e.target.files[0]
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            uploadImage(reader.result)
        }
    }

    const uploadImage = async(base64encodedImage) => {
        try {
            const res = await axios.post(`/v1/user/upload/user/${currentUser._id}`, {data: base64encodedImage},{
                onUploadProgress: (progressEvent) => {
                       console.log(progressEvent)
                     }
              })
            setUser({...user,image: `${res.data.url}`})
            await updateUsers({image: `${res.data.url}`},dispatch,user._id);
            setLoading(false)
            notify()
        } catch(err) {
            console.error(err)
        }
    }


    useEffect(() => {
        window.scroll({
          top: 0,
          left: 0,
          behavior: 'smooth'
        })
        const getUsers = async(id) => {
          try {
            const res = await axios.get(`/v1/user/` + id);
            setUser(res.data)
          } catch (err) {
            console.log(err)
          }
        };
          getUsers(location.state)
      }, [id]);

  return (
    <>
    {user &&
        <Helmet title={user.username.split(' ').splice(user.username.split(' ').length-2,user.username.split(' ').length).join(' ')}>
            <Toaster
                toastOptions={{
                    className: '',
                    style: {
                        padding: '16px',
                        fontSize:'14px',
                    },
                }}
            />
            <section className="infor">
                <div className="infor__container">
                    <div className="infor__simple">
                        <div className="infor__simple__bg" style={{backgroundImage: `url(https://wallpaperaccess.com/full/187161.jpg)`}}>
                        </div>
                    </div>

                    <div className="infor__hard">
                        <div className="infor__hard__avatar" htmlFor="imgProfile">
                            <div 
                                className="infor__hard__avatar__img" 
                                style={{backgroundImage: `url(${user.image ? user.image : user.sex === 'male' ? male : female})`}}
                                >
                                <div className={`loading overlay ${loading && "active"}`}>
                                    <CircularProgress  />    
                                </div>
                                <label htmlFor="imgProfile">
                                    <div className="infor__hard__avatar__overlay overlay"></div>
                                    <CameraAltIcon 
                                        className="infor__hard__avatar__icon" 
                                        sx={{ fontSize: 40,color: grey[50] }} 
                                        style={{position: 'absolute'}}
                                        htmlFor="imgProfile"
                                    />
                                </label>
                                {
                                currentUser._id === user._id && <input 
                                                                    type="file" 
                                                                    name='imgProfile' 
                                                                    id = "imgProfile"  
                                                                    required={true}
                                                                    style={{display: 'none'}}
                                                                    accept="image/*"
                                                                    onChange = {(e) => handleUpload(e)}
                                                                />
                                }
                            </div>
                            <h1>{user.username}</h1>
                            {user.story && <span>{user.story}</span>}
                        </div>
                    </div>
                    <div className="infor__detail">
                        <div className="infor__detail__private">
                            <div className="infor__detail__private__intro">
                                <h1>Giới Thiệu</h1>
                                <form>
                                    <label htmlFor="">username:</label>
                                        <input 
                                        id="input__username"
                                        className="infor__detail__private__input edit" 
                                        name="username"
                                        type="text" 
                                        defaultValue={user.username} 
                                        maxLength="24"
                                        disabled
                                        /><br/>
                                    <label htmlFor="">email:</label>
                                    <input 
                                        className="infor__detail__private__input" 
                                        type="email" 
                                        defaultValue={user.email} 
                                        disabled
                                        /><br/> 
                                    <label htmlFor="">sex:</label>
                                    <select 
                                        name="sex" 
                                        id="input__sex"
                                        className="infor__detail__private__input edit" 
                                        defaultValue={user.sex}  
                                        disabled>
                                        <option value='male'>male</option>
                                        <option value='female'>female</option>
                                    </select>
                                </form>
                            </div>

                            <div className="infor__detail__private__body">
                                <h1>thông tin chi tiết</h1>
                                <form>
                                    <label htmlFor="">Sđt:</label>
                                    <input 
                                        className="infor__detail__private__input edit" 
                                        type="text" 
                                        name="number"
                                        placeholder="Chưa cập nhật"
                                        defaultValue={user.number} 
                                        maxLength="11"
                                        disabled
                                        /><br/> 
                                    <label htmlFor="">Địa chỉ:</label>
                                    <input 
                                        className="infor__detail__private__input edit" 
                                        name="address"
                                        type="text" 
                                        placeholder="Chưa cập nhật"
                                        defaultValue={user.address} 
                                        maxLength="24"
                                        disabled
                                        /><br/>    
                                </form>
                            </div>
                        </div>

                        <div className="infor__detail__product">
                            <h1>Tất cả bài viết</h1>
                            {user.posts.length > 0 ? 
                                        <Grid 
                                            className="infor__detail__list"
                                            col = {1}
                                            md = {2}
                                            sm = {1}
                                            gapRow = {20}
                                        >
                                            {user.posts.map((post,index) => (
                                                    <Thumbnail key={index} infor="information" post={post}/> 
                                            ))}
                                        </Grid>
                                        :
                                        <div className="infor__detail__product__emty">
                                            <h2>Người dùng chưa cập nhật bài viết</h2>
                                        </div>
                                    }
                        </div>
                    </div>
                </div>
            </section>
        </Helmet>
    }
    </>
  )
}

export default Infor