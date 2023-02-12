import React,{useState,useEffect } from 'react'
import './Infor.scss'
import { useParams,useNavigate} from 'react-router-dom'
import { useDispatch,useSelector } from "react-redux";
import { updateUsers } from "../../redux/apiRequest";
import {getUserStart,getUserSuccess} from "../../redux/userSlice"

import {publicRequest} from '../../utils/configAxios'

import male from '../../assets/img/male.png'
import female from '../../assets/img/female.png'
import Grid from '../../components/utils/Grid/Grid'

import Thumbnail from '../../components/Thumbnail/Thumbnail'
import Helmet from '../../components/Helmet/Helmet';

// MUI
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { amber } from '@mui/material/colors';
import CircularProgress from '@mui/material/CircularProgress';
import ListIcon from '@mui/icons-material/List';
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ClassIcon from '@mui/icons-material/Class';
import FavoriteIcon from '@mui/icons-material/Favorite';
import BoyIcon from '@mui/icons-material/Boy';
import GirlIcon from '@mui/icons-material/Girl';

// Skeleton
import Skeleton from '@mui/material/Skeleton';

import toast, { Toaster } from 'react-hot-toast';
const notify = () => toast.success('Cập nhật ảnh đại diện thành công');

const Infor = ({save}) => {
    const {id} = useParams()
    const currentUser = useSelector((state)=> state.auth.login?.currentUser)
    const [loading,setLoading] = useState(false) 
    const [user, setUser] = useState();
    const [post, setPost] = useState([]);
    const dispatch = useDispatch()
    const navigate = useNavigate()

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
            const res = await publicRequest.post(`/v1/user/upload/user/${currentUser._id}`, {data: base64encodedImage})
            setUser({...user,image: `${res.data.url}`})
            await updateUsers({image: `${res.data.url}`},dispatch,user._id);
            setLoading(false)
            notify()
        } catch(err) {
            console.error(err)
        }
    }

    const handleSelect = (e) => {
        if(e.target.id === 'save') {
            navigate(`/infor/save/${id}`)
        } else {
            navigate(`/infor/${id}`)
        }
    }

    const textForm = (text) => {
        return text ? text : "chưa cập nhật"
    }


    // GET USER
    const getUsers = async(id) => {
        dispatch(getUserStart())
      try {
        const res = await publicRequest.get(`/v1/user/` + id);
        dispatch(getUserSuccess())
        setUser(res.data)
        setPost(res.data.posts)
      } catch (err) {
        console.log(err)
      }
    };
    useEffect(() => {
        window.scroll({
          top: 0,
          left: 0,
          behavior: 'smooth'
        })
          getUsers(id)
      }, [id]);

      useEffect(() => { 
        const getSavePost = async(id) => {
        dispatch(getUserStart())
            try {
                const res = await publicRequest.get(`/v1/post/saved/` + id);
                dispatch(getUserSuccess())
                setPost(res.data)
            } catch (err) {
                console.log(err)
            }
          };
        if(save) {
            getSavePost(user._id)
        } else {
            getUsers(id)
        }

      }, [save]);

  return (
        <Helmet title={user?.username}>
            <section className="infor">
                <div className="infor__container">
                    <div className="infor__simple">
                        {user ? 
                        <div className="infor__simple__bg" style={{backgroundImage: `url(https://www.egeniq.nl/sites/default/files/2020-06/frontend_webdeveloper.jpg)`}}>
                        </div>
                        :
                        <Skeleton sx={{ bgcolor: 'grey.800' }} variant="rectangular" height={400} />
                        }
                    </div>

                    <div className="infor__hard">
                        <div className="infor__hard__avatar" htmlFor="imgProfile">
                            {user ? 
                            <div 
                                className="infor__hard__avatar__img" 
                                style={{backgroundImage: `url(${user.image ? user.image : user.sex === 'male' ? male : female})`}}
                                >
                                <div className={`loading overlay ${loading && "active"}`}>
                                    <CircularProgress/>    
                                </div>
                                { currentUser._id === user._id && 
                                    <label htmlFor="imgProfile">
                                        <div className="infor__hard__avatar__overlay overlay"></div>
                                        <CameraAltIcon 
                                            className="infor__hard__avatar__icon" 
                                            sx={{ fontSize: 40,color: amber[600] }} 
                                            style={{position: 'absolute'}}
                                            htmlFor="imgProfile"
                                        />
                                    </label>
                                }
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
                            :
                            <div className="skeleton">
                                <Skeleton sx={{ bgcolor: 'grey.800' }} variant="circular" width={200} height={200} />
                            </div>
                            }
                            {user && 
                            <h1>{user.username}</h1>
                            }
                        </div>
                    </div>
                    <div className="infor__detail">
                            <div className="infor__detail__private">
                                {user ? 
                                <div className="infor__detail__private__intro">
                                    <h1>Giới Thiệu</h1>
                                    <div className="infor__detail__private__form">
                                        <div className="infor__detail__private__item">
                                            <LocationOnIcon sx={{fontSize:30,color: amber[400] }}/>
                                            <span>{textForm(user.address)}</span>
                                        </div>

                                        <div className="infor__detail__private__item">
                                            <EmailIcon sx={{fontSize:30,color: amber[400] }}/>
                                            <span>{textForm(user.email)}</span>
                                        </div>

                                        <div className="infor__detail__private__item">
                                            <LocalPhoneIcon sx={{fontSize:30,color: amber[400] }}/>
                                            <span>{textForm(user.number)}</span>
                                        </div>

                                    </div>
                                </div>
                                :
                                <Skeleton sx={{ bgcolor: 'grey.800' }}  variant="rectangular" height={240} />
                                }

                                {user ? 
                                <div className="infor__detail__private__body">
                                    <h1>thông tin chi tiết</h1>
                                    <div className="infor__detail__private__form">
                                        <div className="infor__detail__private__item">
                                            <AccountCircleIcon sx={{fontSize:30,color: amber[400] }}/>
                                            <span>{user.isAdmin ? "Quản trị viên" : "Thành viên"}</span>
                                        </div>

                                        <div className="infor__detail__private__item">
                                            {user.sex === 'male' ? 
                                            <BoyIcon sx={{fontSize:30,color: amber[400] }}/>
                                            :
                                            <GirlIcon sx={{fontSize:30,color: amber[400] }}/>
                                            }
                                            <span>{textForm(user.sex)}</span>
                                        </div>

                                        <div className="infor__detail__private__item">
                                            <ClassIcon sx={{fontSize:30,color: amber[400] }}/>
                                            <span>{user.posts.length === 0 ? "chưa có bài viết" : `Đã đóng góp ${user.posts.length} bài viết`}</span>
                                        </div>

                                        <div className="infor__detail__private__item">
                                            <FavoriteIcon sx={{fontSize:30,color: amber[400] }}/>
                                            <span>{user.favorite === 0 ? 0 : `${user.favorite} lượt thích`}</span>
                                        </div>
                                    </div>
                                </div>
                                :
                                <Skeleton sx={{ bgcolor: 'grey.800' }}  variant="rectangular" height={290} />
                                }
                            </div>
                            
                            <div className="infor__detail__product">
                                {user ? 
                                <div className="infor__detail__product__option">
                                    <h1>bài viết</h1>
                                    <div className="infor__detail__product__selection" onClick={(e) => handleSelect(e)}>
                                        <div id="all" className={`infor__detail__product__item ${save ? "" : "selected"}`}>
                                            <ListIcon sx={{fontSize:20,color: amber[400] }}/>
                                            <span>Bài viết của tác giả</span>
                                        </div>
                                        <div id="save" className={`infor__detail__product__item ${save ? "selected" : ""}`}>
                                            <CollectionsBookmarkIcon sx={{fontSize:20,color: amber[400] }}/>
                                            <span>Bài viết đã lưu</span>
                                        </div>
                                    </div>
                                </div>
                                :
                                <Skeleton sx={{ bgcolor: 'grey.800' }}  variant="rectangular" height={120} />
                                }
                                {user ? 
                                <div className="infor__detail__product__allPost">
                                    {save ? 
                                    <h1>Bài viết đã lưu</h1>
                                    :
                                    <h1>Tất cả bài viết</h1>
                                    }
                                    {post.length > 0 ? 
                                                <Grid 
                                                    className="infor__detail__list"
                                                    col = {1}
                                                    md = {1}
                                                    sm = {1}
                                                    gapRow = {20}
                                                >
                                                    {post.map((post,index) => (
                                                            <Thumbnail key={index} infor="information" post={post}/> 
                                                            // <RelatedPost key={index} post={post} />
                                                    ))}
                                                </Grid>
                                                :
                                                <div className="infor__detail__product__emty">
                                                    {save ? 
                                                    <h2>Người dùng chưa lưu bài viết nào</h2>
                                                    :
                                                    <h2>Người dùng chưa cập nhật bài viết</h2>
                                                    }
                                                </div>
                                            }
                                </div>        
                                :
                                <Skeleton sx={{ bgcolor: 'grey.800' }}  variant="rectangular" height={900} />
                                }
                            </div>
                    </div>
                </div>
            </section>
        </Helmet>
  )
}

export default Infor