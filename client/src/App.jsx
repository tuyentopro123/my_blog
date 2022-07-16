import './App.scss';
import React,{useRef,useState,useEffect} from 'react'
import {BrowserRouter,Routes,Route, Navigate,useNavigate,useLocation, Link} from 'react-router-dom'
import { useDispatch,useSelector } from "react-redux";
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import Home from './pages/Home/Home'
import Header from './components/Header/Header';
import Blog from './pages/Blog/Blog';
import About from './pages/About/About';
import Infor from './pages/Infor/Infor';
import NewPost from './pages/NewPost/NewPost';
import DetailPost from './pages/DetailPost/DetailPost'
import Setting from './pages/Setting/Setting'
import {io} from "socket.io-client"
import { loginUser } from "./redux/apiRequest";
import ProgressBar from './components/ProgressBar/ProgressBar'

// material ui
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import EditIcon from '@mui/icons-material/Edit';
import HomeIcon from '@mui/icons-material/Home';
import AddIcon from '@mui/icons-material/Add';
import InfoIcon from '@mui/icons-material/Info';
import {amber} from '@mui/material/colors';

function App() {
  // const location = useLocation()  
  const user = useSelector((state)=> state.auth.login?.currentUser)
  const loading = useSelector((state)=> state.post.post.isFetching)
  const dispatch = useDispatch()
  const [socket,setSocket] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const categories = ["Frontend",
                      "Backend",
                      "Scss",
                      "NextJS",
                      "Redux",
                      "ReactJs",
                      "game",
                      "social",
                      "drama",
                      "music",
                      "film",
]
  
  // SOCKET IO
  useEffect(() => {
    setSocket(io("http://localhost:5000"))
    loginUser(dispatch)
  },[])

  
  useEffect(() => {
    socket?.emit("newUser",user)
  },[socket,user]) 
  
  useEffect(() => {
    setIsLoading(loading)
  },[loading]) 

        

  return (
    <div className="App">
      <ProgressBar isAnimating={isLoading} />
      <BrowserRouter>
        <Header socket={socket}/>
        <SpeedDialTooltip/>  
        <Routes>
          <Route path='/' element={<Home />}/>
          <Route path='/login' element={user ? <Navigate to='/' /> : <Login />}/>
          <Route path='/register' element={<Register />}/>
          <Route path='/program' element={<Blog fields="program"/>}/>
          <Route path='/life' element={<Blog fields="life"/>}/>
          <Route path='/about' element={<About/>}/>
          <Route path='/infor/:id' element={user ? <Infor save={false}/> : <Login /> }/>
          <Route path='/infor/save/:id' element={user ? <Infor save={true}/> : <Login /> }/>
          <Route path='/newPost' element={<NewPost />}/>
          <Route path='/setting' element={<Setting />}/>
          <Route path='/post/:slug' element={user ? <DetailPost socket={socket}/> : <Login /> }/>
        </Routes>
      </BrowserRouter>  
      <div className="footer">
          <div className="footer__address">
              <div className="footer__address__title">
                <h1>VANTUYEN</h1>
                <span>never give up</span>
              </div>
              <div className="footer__address__content">
                <span>Số điện thoại: 0844097999</span><br/><br/>
                <span>Email: tuyentopro123@gmail.com</span><br/><br/>
                <span>Địa chỉ: ngõ 5, Lương Ngọc Quyến, quận Hà Đông, Hà Nội</span><br/>
              </div>
          </div>
          <div className="footer__container">

            <div className="footer__categories">
              <div className="footer__categories__title">
                <h2>từ khóa phổ biến</h2>
              </div>
              <div className="footer__categories__content">
                <ul 
                  className="grid col-3 col-sm-4" 
                  style={{gridColumnGap: `15px`}}  
                >
                  {categories.slice(0,6).map((item,index) => (
                    <li key={index}>
                      <a href={`/program?category=${item}`}>
                        {item}
                      </a>
                    </li>
                  ))}
                  {categories.slice(6,11).map((item,index) => (
                    <li key={index}>
                      <a href={`/life?category=${item}`}>
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="footer__navigate">
              <div className="footer__navigate__title">
                <h2>Chuyển hướng</h2>
              </div>
              <div className="footer__navigate__content">
                <ul>
                  <li>
                    <a href="/">
                      Trang chủ
                    </a>
                  </li>
                  <li>
                    <a href="/program">
                      Program
                    </a>
                  </li>
                  <li>
                    <a href="/life">
                      Life
                    </a>
                  </li>
                  <li>
                    <a href="/about">
                      About
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="footer__navigate">
              <div className="footer__navigate__title">
                <h2>Blog bạn bè</h2>
              </div>
              <div className="footer__navigate__content">
                <ul>
                    <li>
                      <a href="https://ankhangdev.cf/">Ankhangdev</a>
                    </li>
                </ul>
              </div>
            </div>
          </div>
      </div>
      <div className="copyRight">
        <span>© 2022 vantuyen. All rights reserved.</span>
      </div>
    </div>
  );
}
export default App;

function SpeedDialTooltip() {
  const navigate = useNavigate()
  const handleHome = () => {
    navigate("/")
  }
  const handlePost = () => {
    navigate("/newPost")
  }

  const handleAbout = () => {
    navigate("/about")
  }
  const handleUp = () => {
    window.scrollTo(0, 0)
  }
  const actions = [
    { 
      icon: <EditIcon onClick={handlePost} sx={{ fontSize:25,color: amber[500] }}/>, 
      name: 'Add',
    },
    { 
      icon: <HomeIcon onClick={handleHome} sx={{ fontSize:25,color: amber[500] }}/>, 
      name: 'Home',
    },
    { 
      icon: <InfoIcon onClick={handleAbout} sx={{ fontSize:25,color: amber[500] }}/>, 
      name: 'About',
    },
  ];

  return (
          <SpeedDial
            ariaLabel="SpeedDial openIcon"
            sx={{ position: 'fixed', bottom: 30, right: 30,color: 'black' }}
            FabProps={{
              size: 'larger',
            }}
            
            icon={<SpeedDialIcon 
                      sx={{ height: 33}} 
                      onClick={handleUp}
                      icon={<AddIcon sx={{ fontSize: 30 }}/>}
                      openIcon={<KeyboardArrowUpIcon  sx={{ fontSize: 30 }} />} 
                      />
                  }
          >
            {actions.map((action) => (
              <SpeedDialAction
                key={action.name}
                icon={action.icon}
                tooltipTitle={action.name}
                tooltipOpen
              />
            ))}
          </SpeedDial>
  )
}