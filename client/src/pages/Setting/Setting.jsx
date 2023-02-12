import React,{useState,useEffect } from 'react'
import "./Setting.scss"
import {useLocation, useParams,useNavigate} from 'react-router-dom'
import { useDispatch,useSelector } from "react-redux";
import {publicRequest} from '../../utils/configAxios'

import { updateUsers } from "../../redux/apiRequest";
import Helmet from '../../components/Helmet/Helmet'
import toast, { Toaster } from 'react-hot-toast';

const Setting = () => {
  const dispatch = useDispatch()
  const currentUser = useSelector((state)=> state.auth.login?.currentUser)
  const [user,setUser] = useState()
  const [value,setValue] = useState("")
  const setting = [
    {
      id:"username",
      field:"Họ tên",
      value: user?.username,
      type: "text"
    },
    {
      id:"address",
      field:"Địa chỉ",
      value: user?.address,
      type: "text"
    },
    {
      id:"number",
      field:"Số điện thoại",
      value: user?.number,
      type: "number"
    },
    {
      id:"email",
      field:"Email",
      value: user?.email,
      type: "email"
    },
  ]

  // EDIT
  const handleChange = (item) => {
    document.querySelector(`.setting__infor__item__button.${item.id}`).classList.add("active")
    document.getElementById(item.id).disabled = false
    document.getElementById(item.id).focus()
  }

  // SAVE
  const handleSave = async(item) => {
    const state = item.id === "username" ? {username: value} :
                  item.id === "address" ? {address: value} :
                  item.id === "number" ? {number: value} : {email: value}
    document.querySelector(`.setting__infor__item__button.${item.id}`).classList.remove("active")
    document.getElementById(item.id).disabled = true;
    await toast.promise(updateUsers(state,dispatch,user._id), {
      loading: 'Đang tải...',
      success: "Cập nhật thông tin thành công",
      error: 'lỗi đường truyền',
    });
    await getUsers(currentUser._id)
    setValue("")
  }

  // CLOSE
  const handleClose = (item) => {
    document.querySelector(`.setting__infor__item__button.${item.id}`).classList.remove("active")
    document.getElementById(item.id).disabled = true
    document.getElementById(item.id).value = ""
    setValue("")
  }

  // SETTING INPUT 
  const handleChangeInput = (e) => {
    setValue(e.target.value)
    console.log(e.target.value)
  }

  // Upload image to the cloundinary
    const handleUpload = (e) => {
        const file = e.target.files[0]
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            uploadImage(reader.result)
            toast.promise(uploadImage(reader.result), {
              loading: 'Đang tải...',
              success: "Đổi ảnh đại diện thành công",
              error: 'lỗi đường truyền',
            });
        }
    }


    const uploadImage = async(base64encodedImage) => {
        try {
            const res = await publicRequest.post(`/v1/user/upload/user/${currentUser._id}`, {data: base64encodedImage},{
              })
            setUser({...user,image: `${res.data.url}`})
            await updateUsers({image: `${res.data.url}`},dispatch,user._id);
        } catch(err) {
            console.error(err)
        }
    }


    // GET USER
    const getUsers = async(id) => {
      try {
        const res = await publicRequest.get(`/v1/user/` + id);
        setUser(res.data)
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
        getUsers(currentUser._id)
    }, []);
  return (
    <Helmet title="Setting">
       <Toaster
                toastOptions={{
                    className: '',
                    style: {
                        padding: '16px',
                        fontSize:'14px',
                    },
                }}
            />
        <section className="setting">
            <div className="setting__container">
              <h1>Cài Đặt</h1>
              <div className="setting__infor">
                <h2>Thông tin cá nhân</h2>
                {setting.map((item,index) => (
                  <div key={index} className="setting__infor__item">
                    <div className="setting__infor__item__input">
                        <h3>{item.field}</h3>
                        <input 
                          id={item.id}  
                          type={item.type} 
                          placeholder="Thêm thông tin"
                          defaultValue={item.value} 
                          onChange={(e) => handleChangeInput(e)}
                          disabled={true}
                        />
                    </div>
                    <div className={`setting__infor__item__button ${item.id}`}>
                        <button onClick={() => handleChange(item)}>Chỉnh sửa</button>
                        <div className="setting__infor__item__save">
                          <button onClick={() => handleSave(item)}>Lưu</button>
                          <button onClick={() => handleClose(item)}>Hủy</button>
                        </div> 
                    </div>
                  </div>
                ))}

                {/* Avatar */}
                <div className="setting__infor__item">
                  <div className="setting__infor__item__input">
                      <h3>Avatar</h3>
                      <div className="setting__infor__item__avatar">
                        <span>Nên là ảnh vuông, chấp nhận các tệp: JPG, PNG hoặc GIF.</span>  
                        {user && 
                          <div 
                            className="setting__infor__item__avatar__image"
                            style={{backgroundImage: `url(${user.image})`}}
                          >
                            <label htmlFor="imgProfile">
                              <div className="setting__infor__item__avatar__overlay overlay"></div>
                            </label>
                            <input 
                                type="file" 
                                name='imgProfile' 
                                id = "imgProfile"  
                                required={true}
                                style={{display: 'none'}}
                                accept="image/*"
                                onChange = {(e) => handleUpload(e)}
                            />
                          </div>
                        }
                      </div>
                  </div>
                </div>
                {/* SEX */}
                <div className="setting__infor__item">
                  <div className="setting__infor__item__input">
                      <h3>Giới tính</h3>
                      <select name="sex" id="sex" defaultValue={user?.sex}>
                        <option value='male'>male</option>
                        <option value='female'>female</option>
                      </select>
                  </div>
                </div>
              </div>
            </div>
        </section>
    </Helmet>
  )
}

export default Setting