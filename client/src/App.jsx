import './App.scss';
import React,{useRef,useState,useEffect} from 'react'
import {BrowserRouter,Routes,Route, Navigate,useNavigate} from 'react-router-dom'
import { useDispatch,useSelector } from "react-redux";
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import Home from './pages/Home/Home'
import Header from './components/Header/Header';
import Blog from './pages/Blog/Blog';
import Author from './pages/Author/Author';
import Infor from './pages/Infor/Infor';
import NewPost from './pages/NewPost/NewPost';
import DetailPost from './pages/DetailPost/DetailPost'
import {io} from "socket.io-client"

// material ui
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import Backdrop from '@mui/material/Backdrop';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import EditIcon from '@mui/icons-material/Edit';
import HomeIcon from '@mui/icons-material/Home';
import AddIcon from '@mui/icons-material/Add';



function App() {
  const user = useSelector((state)=> state.auth.login?.currentUser)
  const [socket,setSocket] = useState(null)
  useEffect(() => {
    setSocket(io("http://localhost:5000"))
  },[])

  useEffect(() => {
    socket?.emit("newUser",user)
  },[socket,user]) 



  return (
    <div className="App">
        <BrowserRouter>
          {user ? <Header socket={socket}/> : ''}
          <SpeedDialTooltip/>
          <Routes>
            <Route path='/' element={user ? <Home /> : <Navigate to='/login' />}/>
            <Route path='/login' element={user ? <Navigate to='/' /> : <Login />}/>
            <Route path='/register' element={<Register />}/>
              {
                user && (
                  <>
                    <Route path='/program' element={<Blog fields="program"/>}/>
                    <Route path='/life' element={<Blog fields="life"/>}/>
                    <Route path='/author' element={<Author/>}/>
                    <Route path='/infor/:id' element={<Infor/>}/>
                    <Route path='/newPost' element={<NewPost />}/>
                    <Route path='/post/:id' element={<DetailPost socket={socket}/>}/>
                  </>
                )
              }
          </Routes>
        </BrowserRouter>

        {/* <div className="footer">
          
        </div> */}
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
            sx={{ position: 'fixed', bottom: 30, right: 30 }}
            FabProps={{
              // color: 'black',
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