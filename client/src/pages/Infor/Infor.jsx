import React,{ useRef,useState,useEffect } from 'react'
import './Infor.scss'
import {useLocation, useNavigate} from 'react-router-dom'
import {loginSuccess} from "../../redux/authSlice"
import { useDispatch } from "react-redux";
import { updateUsers } from "../../redux/apiRequest";
import { createAxios } from "../../createInstance";
import { useSelector } from "react-redux";

import axios from "axios";
import male from '../../assets/img/male.png'
import female from '../../assets/img/female.png'
import Grid from '../../components/utils/Grid/Grid'

import Thumbnail from '../../components/Thumbnail/Thumbnail'
import Helmet from '../../components/Helmet/Helmet';

import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { grey } from '@mui/material/colors';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Infor = () => {
    const [open, setOpen] = useState(false);
    const [custom, setCustom] = useState("success");
    const  vertical = "top"
    const horizontal = "center" 
    const handleClose = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
  
      setOpen(false);
    };

    
    const navigate = useNavigate()
    
    const currentUser = useSelector((state)=> state.auth.login?.currentUser)
    const userState = useSelector((state)=> state.user.users.user)
    const [loading,setLoading] = useState(false) 
    const [user, setUser] = useState(userState);
    const save = useRef(null)
    const edit = useRef(null)
    const dispatch = useDispatch()
    let axiosJWT = createAxios(user, dispatch, loginSuccess);

    const [values, setValues] = useState({
        username: "",
        sex: "",
        number: "",
        address: ""
    })

    const handleChange = (e) => {
        const value = e.target.value
        setValues({...values, [e.target.name]: value})
    }

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
                headers: { token: `Bearer ${currentUser.accessToken}` }
            })
            setUser({...user,image: `${res.data.url}`})
            await updateUsers({image: `${res.data.url}`},currentUser.accessToken,dispatch,user._id);
            setLoading(false)
        } catch(err) {
            console.error(err)
        }
    }

    // Upload personal information
    const handleEdit = () => {
        save.current.classList.add("active")
        edit.current.classList.add("active")
        document.querySelectorAll(".infor__detail__private__input.edit").forEach(e => {
            e.disabled = false;
        })
    }

    const handleComplete = (e) => {
        save.current.classList.remove("active")
        edit.current.classList.remove("active")
        document.querySelectorAll(".infor__detail__private__input.edit").forEach(e => {
            e.disabled = true;
        })
        if(e.target.innerText === "SAVE") {
            const updatedUser = {
                username: values.username ? values.username : user.username,
                sex: values.sex ? values.sex : user.sex,
                number:values.number ? values.number : user.number,
                address: values.address ? values.address : user.address
            }
            if(!values.username && !values.sex && !values.number && !values.address) {
                setCustom("warning");
                setOpen(true);
            } else {
                updateUsers(updatedUser,currentUser.accessToken,dispatch,user._id,navigate);
                setCustom("success");
                setOpen(true);
            }
        } else {
            document.getElementById("input__username").value = user.username;
            document.getElementById("input__sex").value = user.sex;
        }
        setValues({
            username: "",
            sex: "",
            number: "",
            address: ""
        })
    }

  return (
    <Helmet title={user.username.split(' ').splice(user.username.split(' ').length-2,user.username.split(' ').length).join(' ')}>
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
                                    onChange={handleChange}
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
                                    onChange={handleChange}
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
                                    onChange={handleChange}
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
                                    onChange={handleChange}
                                    defaultValue={user.address} 
                                    maxLength="24"
                                    disabled
                                    /><br/>    
                            </form>
                        {(currentUser._id === user._id) && <button ref={edit} className="infor__detail__private__edit btn" onClick={handleEdit}>Edit</button>}
                        <div className="complete" ref={save}>
                            <button className="complete__save btn" onClick={(e) => handleComplete(e)}>SAVE</button>
                            <button className="complete__cancel btn" onClick={(e) => handleComplete(e)}>CANCEL</button>
                        </div>
                        </div>
                    </div>

                    <div className="infor__detail__product">
                        <h1>Tất cả bài viết</h1>
                        {userState.posts.length > 0 ? 
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
      <Snackbar anchorOrigin={{ vertical, horizontal }} open={open} autoHideDuration={4000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={custom === "success" ? "success" : "warning"} sx={{ width: '100%' }} style={{fontSize: 1.5 + 'rem'}}>
          {custom === "success" ? "Cập nhật thành công" : "Bạn chưa cập nhật thông tin"}
        </Alert>
      </Snackbar>
    </Helmet>
  )
}

export default Infor