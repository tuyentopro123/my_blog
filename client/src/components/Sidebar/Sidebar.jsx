import React,{useState,useEffect} from 'react'
import './Sidebar.scss'
import Avatar from '@mui/material/Avatar';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import {teal,amber,grey,blueGrey} from '@mui/material/colors';
import {publicRequest} from "../../utils/configAxios";


import Chip from '../utils/Chip/Chip';
import List  from '../utils/List/List';
import { Link } from 'react-router-dom';

const Sidebar = ({type}) => {
  const [topUsers,setTopUsers] = useState([])
  const categories = type === "program" ? ["Frontend","Backend","Scss","NextJS","Boostrap","redux"]
                    : ["game","social","drama","music","film","politics"]
  useEffect(() => {
    let controller = new AbortController();

    const getTopUsers = async() => {
      try {
        const res = await publicRequest.get("v1/user/top");
        setTopUsers(res.data)
        controller = null

      } catch(err) {
        console.log(err);
      }
    }
    getTopUsers()
    return () => controller?.abort();
  },[])
  return (
    <div className="sidebar">
        <div className="sidebar__container">
            <div className="sidebar__topUser">
              <List header="Top Author" active="active">
                {topUsers?.map((user,index) => (
                  <Link 
                    to={`/infor/${user._id}`}
                    state={user._id}
                    key={index} 
                    className="sidebar__topUser__content"
                  >
                      <div className="sidebar__topUser__content__listUser">
                        <div className="sidebar__topUser__content__user">
                          <div className="sidebar__topUser__content__img">
                            <Avatar src={user.image} sx={{ width: 45, height: 45 }}/>
                          </div>

                          <div className="sidebar__topUser__content__txt">
                            <h3>{user.username}</h3>
                            <h4>Số bài viết: <span>{user.posts.length}</span> </h4>
                          </div>

                        </div>
                        <div className="sidebar__topUser__content__like">
                          {index === 0 ? 
                          <WorkspacePremiumIcon 
                            className="sidebar__topUser__content__like"
                            sx={{ fontSize: 35,color: teal[300] }} 
                          />
                          :
                          index === 1 ?
                          <WorkspacePremiumIcon 
                            className="sidebar__topUser__content__like"
                            sx={{ fontSize: 35,color: amber[300] }} 
                          />
                          :
                          index === 2 ?
                          <WorkspacePremiumIcon 
                            className="sidebar__topUser__content__like"
                            sx={{ fontSize: 35,color: grey[200] }} 
                          /> 
                          :
                          <MilitaryTechIcon 
                            className="sidebar__topUser__content__like"
                            sx={{ fontSize: 25,color: blueGrey[300] }} 
                          /> 
                        }
                        </div>
                      </div>
                    </Link>
                  ))}
              </List>

                
            </div>
            
            
            <div className="sidebar__category">
                <div className="sidebar__category__content">
                    <List header="category" active="active">
                      <div className="sidebar__category__listChip">
                        {categories.map((item,index) => (
                          <Chip 
                              key={index} 
                              className="sidebar__category__item" 
                              text={item}
                              field={type}
                              />
                        ))}
                      </div>
                    </List>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Sidebar