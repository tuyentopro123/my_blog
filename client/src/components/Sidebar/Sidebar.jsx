import React,{useState,useEffect} from 'react'
import './Sidebar.scss'
import Avatar from '@mui/material/Avatar';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import axios from 'axios';
import Chip from '../utils/Chip/Chip';
import List  from '../utils/List/List';

const Sidebar = ({type}) => {
  const [topUsers,setTopUsers] = useState([])
  const categories = type === "program" ? ["Frontend","Backend","Scss","NextJS","Boostrap","redux"]
                    : ["game","social","drama","music","film","politics"]
  useEffect(() => {
    let controller = new AbortController();

    const getTopUsers = async() => {
      try {
        const res = await axios.get("v1/user/top");
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
                    <div key={index} className="sidebar__topUser__content">
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
                            <FavoriteBorderOutlinedIcon 
                              className="sidebar__topUser__content__like"
                              fontSize="large"
                              sx={{ fontSize: 25 }} 
                            />
                              <span>{user.favorite}</span><br/>
                        </div>
                      </div>
                    </div>
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