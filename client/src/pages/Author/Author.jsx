import React,{ useEffect,useState,useRef } from 'react'
import './Author.scss'
import Navbar from '../../components/Navbar/Navbar'
import Helmet from '../../components/Helmet/Helmet'
import Item from './AuthorItem'
import Grid from '../../components/utils/Grid/Grid'
import PaginationType  from '../../components/Pagination/Pagination';

import { useSelector } from "react-redux";
import axios from "axios";


const Author = () => {
  const currentUser = useSelector((state)=> state.auth.login?.currentUser)
  // GET ALL USER
  const [currenPageUser,setCurrenPageUser] = useState(1)
  const [userList,setUserList] = useState([])
  const [allUser,setAllUser] = useState([])
  const pageNumber = allUser % 4 === 0 ? (Math.floor(allUser / 4)) : (Math.floor(allUser / 4) + 1)
  

  useEffect(() => {
    // GET ALL USER
    const getAllUsers = async () => {
      try {
        const res = await axios.get(`/v1/user/author?pageUser=${currenPageUser}`);
        setUserList(res.data.user);
        setAllUser(res.data.userCount)
      } catch (err) {
        console.error(err);
      }
    };
      getAllUsers()
  },[currenPageUser])
const HandleSetPage = (e,value) => {
  setCurrenPageUser(value)
}
  return (
      <Helmet title="Author">
        <main className="author">
            <Navbar/>
            <div className="author__container">
              <div className="author__list">
                  <Grid
                      col = {2}
                      md = {2}
                      sm = {1}
                      gapCol = {60}
                      gapRow = {40}
                  >
                      {userList.map((user,index) => (
                          <Item key={index} user={user}/> 
                      ))}
                  </Grid>
                  <PaginationType type="author" page="pageUser" func={HandleSetPage} numb={pageNumber}/>
              </div>

            </div>
            
        </main>
      </Helmet>
  )
}

export default Author