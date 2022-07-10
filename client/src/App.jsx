import './App.scss';
import React,{useRef,useState,useEffect} from 'react'
import {BrowserRouter,Routes,Route, Navigate,useNavigate,useLocation} from 'react-router-dom'
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
import {io} from "socket.io-client"
import { loginUser } from "./redux/apiRequest";
import ProgressBar from './components/ProgressBar/ProgressBar'

// material ui
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import Backdrop from '@mui/material/Backdrop';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import EditIcon from '@mui/icons-material/Edit';
import HomeIcon from '@mui/icons-material/Home';
import AddIcon from '@mui/icons-material/Add';

import { CSSTransition, TransitionGroup } from 'react-transition-group'

function App() {
  // const location = useLocation()  
  const user = useSelector((state)=> state.auth.login?.currentUser)
  const loading = useSelector((state)=> state.post.post.isFetching)
  const dispatch = useDispatch()
  const [socket,setSocket] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  
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
          <Route path='/infor/:id' element={user ? <Infor/> : <Login /> }/>
          <Route path='/newPost' element={<NewPost />}/>
          <Route path='/post/:slug' element={user ? <DetailPost socket={socket}/> : <Login /> }/>
        </Routes>
      </BrowserRouter>  
      <div className="footer">
          
      </div>
    </div>
  );
}
// const AnimationApp = () => {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route element={<App />} path="*" />
//       </Routes>
//     </BrowserRouter>
//   )
// }
export default App;

function SpeedDialTooltip() {
  const navigate = useNavigate()
  const handleHome = () => {
    navigate("/")
  }
  const handlePost = () => {
    navigate("/newPost")
  }
  const handleUp = () => {
    window.scrollTo(0, 0)
  }
  const actions = [
    { 
      icon: <EditIcon onClick={handlePost} sx={{ fontSize:25 }}/>, 
      name: 'Add',
    },
    { 
      icon: <HomeIcon onClick={handleHome} sx={{ fontSize:25 }}/>, 
      name: 'Home',
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