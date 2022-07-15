import React,{useState,useMemo,useRef,useEffect} from 'react'
import './NewPost.scss'
import { useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import Helmet from '../../components/Helmet/Helmet'
import Navbar from '../../components/Navbar/Navbar'
import bg from '../../assets/img/thumbnail.jpg'

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import CreateSlug from "../../components/utils/CreateSlug/CreateSlug"
import axios from "axios";

import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import {amber} from '@mui/material/colors';

import toast, { Toaster } from 'react-hot-toast';
const notifySuccess = () => toast.success('Đăng bài thành công');
const notifyError = (e) => toast.error(e);

var quillObj = ReactQuill;
const NewPost = () => {
    const navigate = useNavigate()
    const currentUser = useSelector((state)=> state.auth.login?.currentUser)

    

    // Quill
    const imageHandler = () => {
        const input = document.createElement('input');  
  
            input.setAttribute('type', 'file');  
            input.setAttribute('accept', 'image/*');  
            input.click();  
        
            input.onchange = async () => {  
            var file = input.files[0];  
            var formData = new FormData();  
            formData.append('image', file);  
            const reader = new FileReader();
            const range = quillObj.getEditorSelection();  
            reader.readAsDataURL(file);
                reader.onloadend = () => {
                    const uploadImagePost = async() => {
                        try {
                            const res = await axios.post(`/v1/post/upload/post/${currentUser._id}`, {data: reader.result})
                            quillObj.getEditor().insertEmbed(range.index, 'image', res.data.url);  
                        } catch(err) {
                            console.error(err)
                        }
                    }
                    uploadImagePost()
                }
            };  
    }

    const modules = useMemo(() => ({
        toolbar: {
          container: [
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline','strike'],
            [{color:[]},{ background: [] }],
            [{ font: [] }],
            [{ align: [] }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['image', 'code-block','video','link','blockquote'],
            ['clean']
          ],
          handlers: {
            image: imageHandler,
          },
        },
    }), [])

    // Upload image to the cloundinary

    const handleUpload = (e) => {
        const file = e.target.files[0]
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            uploadImage(reader.result)
        }
    }

    const uploadImage = async(base64encodedImage) => {
        try {
            const res = await axios.post(`/v1/post/upload/thumb/${currentUser._id}`, {data: base64encodedImage},{
                headers: { token: `Bearer ${currentUser.accessToken}` }
            })
            setPost({...post,imgPost: `${res.data.url}`})
        } catch(err) {
            console.error(err)
        }
    }

      
    const user = useSelector((state)=> state.auth.login?.currentUser)
    const [post, setPost] = useState({
        title: "",
        imgPost: "",
        content:"",
        category:[],
        fields: "",
        user:user._id
    })
    
    // UPLOAD POST
    const handlecontent = (e) => {
        setPost({...post,content: e})
    }
    
    const handleChange = (e) => {
        const value = e.target.value
        setPost({...post, [e.target.name]: value})
    }

    const handleCreatePost = async (post,id) => {
        try {
          await axios.post(`/v1/post/post/` + id, post );
          notifySuccess()
          const navigation = () => {
            navigate(`/`)
          }
          setTimeout(navigation,1600)
        } catch (err) {
          notifyError("vui lòng nhập đủ thông tin")
        }
      };
    
    const handleClick =(e) => {
        e.preventDefault()
        const newPost = {
            title: post.title,
            imgPost: post.imgPost,
            content:post.content,
            category:post.category,
            slug:CreateSlug(post.title),
            fields: post.fields,
            user:user._id
        }
        handleCreatePost(newPost,user._id)
    }

    // Add category
    const categoriesDev = ["Frontend","Backend","Scss","NextJS","Boostrap","redux","ReactJs","React Native","lazy load"]
    const categoriesLife = ["game","social","drama","music","film","politics","sport"]
    const selected = useRef(null)
    const handleDelete = (e) => {
        document.getElementById(e).style.display = "block"
        setPost({...post,category: post.category.filter(item => item !== e)})
    };

    const handleField = (e) => {
        if(e.target.value === "program") {
            selected.current.classList.add("program")
            selected.current.classList.remove("life")
            document.getElementById("life").childNodes.forEach(e => e.disabled = false)
        } else {
            selected.current.classList.remove("program")
            selected.current.classList.add("life")
            document.getElementById("program").childNodes.forEach(e => e.disabled = false)
        }
        setPost({...post,fields:e.target.value,category: []})
    }

    const handleChoose = (e) => {
        document.getElementById(e.target.value).style.display = "none"
        setPost({...post,category: [...post.category,e.target.value]})
    }


  return (
    <Helmet title="New Post">
         <Toaster
                toastOptions={{
                    className: '',
                    style: {
                        padding: '16px',
                        fontSize:'14px',
                    },
                }}
            />
        <main className="new">
            <Navbar/>
            <div className="new__container">
                <div className="new__body">
                    <div className="new__body__thumbnail">
                        <h2> Thêm ảnh thumbnail của bạn:</h2>
                        <label htmlFor="imgPost">
                            <img src={post.imgPost || bg} alt="" />
                        </label><br/>
                        <input  
                            type="file" 
                            name='imgPost' 
                            id='imgPost'
                            style={{display: 'none'}}
                            accept="image/*"
                            onChange={(e) => handleUpload(e)}
                        /> 
                    </div>
                    <div className="new__body__blog">
                        <div className="new__body__blog__title" >
                            <input type="text" name="title" placeholder="Nhập tiêu đề tại đây" required={true} onChange={handleChange}/>
                        </div>
                        <div className="new__body__blog__category">
                            <div ref={selected} className="new__body__blog__category__select">
                                <select onChange={(e) => handleField(e)}>
                                    <option hidden>chủ đề</option>
                                    <option value="program">program</option>
                                    <option value="life">life</option>
                                </select>
                                <select id="program" onChange={(e) => handleChoose(e)}>
                                    {categoriesDev.map((option,index) => (
                                        <option 
                                            key={index} 
                                            id={option}
                                            value={option} 
                                            disabled={false} 
                                            >{option}</option>
                                    ))}
                                </select>
                                <select id="life" onChange={(e) => handleChoose(e)}>
                                    {categoriesLife.map((option,index) => (
                                        <option 
                                            key={index} 
                                            id={option}
                                            value={option} 
                                            disabled={false} 
                                            >{option}</option>
                                    ))}
                                </select>
                            </div>
                            <Stack className="new__body__blog__category__input" direction="row" spacing={1}>
                                {post.category.map((caterory,index) => (
                                    <Chip color="success" sx={{fontSize: 15}} key={index} label={caterory} onDelete={() => handleDelete(caterory)} />
                                ))}
                            </Stack>
                        </div>
                        <div className="new__body__blog__content">
                            <ReactQuill 
                                className="content-area"
                                ref={(el) => {  
                                    quillObj = el; 
                                }} 
                                selection={{start:0, end:0}}
                                theme="snow" 
                                name="content"
                                modules={modules}
                                onChange={handlecontent}
                                />
                        </div>
                        <button onClick={handleClick}>Create Post</button>
                    </div>
                </div>
            </div>
        </main>
      </Helmet>
  )
}

export default NewPost