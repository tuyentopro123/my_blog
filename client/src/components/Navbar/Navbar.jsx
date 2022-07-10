import React,{useEffect} from 'react'
import './Navbar.scss'
import { useLocation,useNavigate,Link } from 'react-router-dom';
import { useDispatch } from "react-redux";
import HomeIcon from '@mui/icons-material/Home';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import FaceIcon from '@mui/icons-material/Face';
import DevicesIcon from '@mui/icons-material/Devices';
import {amber} from '@mui/material/colors';
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
      h4:"About me",
      path:'/about'
    },
  ]
  const navigate = useNavigate()
  const dispatch = useDispatch()

  return (
    <div className="navbar">
        <div className="navbar__container">
          {navbar.map((item, index) =>(
            <Link 
              to={`${item.path}`} 
              key={index}
              className={`navbar__icon ${item.path === currentPath ? "active" : ""}`} 
              >
                <item.Icon sx={{ fontSize: 35,color:amber[800] }} />
                <h4>{item.h4}</h4>
            </Link>
          ))}
        </div>
    </div>
  )
}

export default Navbar