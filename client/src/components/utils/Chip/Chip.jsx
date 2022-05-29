import React from 'react'
import "./Chip.scss";
import { getAllPost } from '../../../redux/apiRequest'
import { useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';

const Chip = ({text,className,field,image}) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

    const handleClick = async(e) => {
      await getAllPost(dispatch,navigate,1,field,text)
      window.location.href= `/${field}?category=${text}&pagePost=1`
    }
  return (
    <div 
      onClick={handleClick} 
      className={`${className} category`} 
      style={image ? {backgroundImage: `url(${image})`} : {backgroundImage: 'none'}}
      >
        
        {image && <div className="category__overlay"></div>}
        <span>{text}</span>
    </div>
  )
}

export default Chip