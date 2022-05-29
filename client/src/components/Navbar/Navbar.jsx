import React,{useEffect} from 'react'
import './Navbar.scss'
import { useLocation,useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import HomeIcon from '@mui/icons-material/Home';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import FaceIcon from '@mui/icons-material/Face';
import DevicesIcon from '@mui/icons-material/Devices';
import { getAllPost } from '../../redux/apiRequest'


const Navbar = () => {
  let currentPath = useLocation().pathname
  const navbar = [
    {
      Icon:HomeIcon,
      h4:"Home",
      path:'/'
    },
    {
      Icon:DevicesIcon,
      h4:"Program",
      path:'/program'
    },
    {
      Icon:AccessibilityNewIcon,
      h4:"Life",
      path:'/life'
    },
    {
      Icon:FaceIcon,
      h4:"Author",
      path:'/author'
    },
  ]
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleLink = async(e) => {
    if(e === '/program') {
      await getAllPost(dispatch,navigate,1,"program",null)
      window.location.href= "/program"
    }
    if(e ==='/life') {
      await getAllPost(dispatch,navigate,1,"life",null)
      window.location.href= "/life"
    }
    navigate(`${e}`)

  }
  return (
    <div className="navbar">
        <div className="navbar__container">
          {navbar.map((item, index) =>(
            <div 
              key={index}
              onClick={() => handleLink(item.path)} 
              className={`navbar__icon ${item.path === currentPath ? "active" : ""}`} 
              >
              <item.Icon sx={{ fontSize: 35 }} />
              <h4>{item.h4}</h4>
            </div>
          ))}
        </div>
    </div>
  )
}

export default Navbar