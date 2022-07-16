import React,{useState} from 'react'
import "./Notification.scss"
import Avatar from "@mui/material/Avatar";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import GetTime from "../../utils/GetTime"
import {useNavigate } from 'react-router-dom';
import { useDispatch,useSelector} from "react-redux";
import { grey } from "@mui/material/colors";
import axios from 'axios';
import { getUserPost } from "../../redux/apiRequest"

import {redirectNotificationStart,
  redirectNotificationFinish} from "../../redux/authSlice"



const Notification = ({data}) => {
  const user = useSelector((state)=> state.auth.login?.currentUser)
  const dispatch = useDispatch()
  const navigate = useNavigate()
    const emojiNoti = [
        {
            name: "like",
          src: "https://res.cloudinary.com/tealive/image/upload/v1653141301/emoji/c09iyar2pqvkubulcpho.png",
        },
        {
          name: "heart",
          src: "https://res.cloudinary.com/tealive/image/upload/v1653141301/emoji/irlnd98a5vdris5ri4m8.png",
        },
        {
          name: "funny",
          src: "https://res.cloudinary.com/tealive/image/upload/v1653141301/emoji/dagzhj3q6miykzqjmqis.png",
        },
        {
          name: "smile",
          src: "https://res.cloudinary.com/tealive/image/upload/v1653141302/emoji/cls4albnfxfogfxwil0z.png",
        },
        {
          name: "cry",
          src: "https://res.cloudinary.com/tealive/image/upload/v1653141301/emoji/x1l5wdj4puqrda2bfimv.png",
        },
        {
          name: "surprised",
          src: "https://res.cloudinary.com/tealive/image/upload/v1653141302/emoji/d8qmeeuoud0sl2i6qjmq.png",
        },
        {
          name: "angry",
          src: "https://res.cloudinary.com/tealive/image/upload/v1653141301/emoji/ldmpjgyrqgnewlnffo0d.png",
        },
        {
          name: "comment",
          src: "https://res.cloudinary.com/tealive/image/upload/v1653141301/emoji/z7hvqmibkvhctbi0ov57.png",
        },
    ];

    const handleNoti = async(noti) => {
      document.querySelector(".header__notification").click()
    // ACCESS NOTIFICATION
    const accessNotification = async() => {
        try {
          const res = await axios.post("/v1/user/check/" + user._id,noti);
          res.data.action && dispatch(redirectNotificationStart(noti))
          navigate(`/post/${res.data.post.slug}`,{state:res.data.post._id})
        } catch (err) {
          console.log(err)
        }
      };  
      accessNotification()
    }

  return (
    <div className="notification__tooltip" >
              <div className="notification__container">
                <h2>Thông báo</h2>
                <ul>
                  {data.length === 0 ? 
                  <li style={{padding: "1rem"}}>
                    <span>Bạn chưa có thông báo mới</span>  
                  </li>
                  :
                  data.map((noti, index) => (
                    <li key={index} onClick={() => handleNoti(noti)}>
                      <div className="notification__item">
                        <div className="notification__item__avatar">
                          <Avatar
                            sx={{ width: 50, height: 50 }}
                            src={noti.sender_img}
                          />
                          <img src={emojiNoti.find(e => e.name === noti.action_icon).src} />
                        </div>
                        <div className="notification__item__desc">
                          {noti.action === "interComment" ? 
                          <p>
                            <span>{noti.sender_user}</span> đã bày tỏ cảm xúc về một bình luận của bạn
                          </p>
                          : noti.action === "comment" ? 
                          <p>
                            <span>{noti.sender_user}</span> đã bình luận về một bài viết của bạn
                          </p>
                          : noti.action === "replyComment" ?
                          <p>
                            <span>{noti.sender_user}</span> đã trả lời một bình luận của bạn
                          </p>
                          : 
                          <p>
                            <span>{noti.sender_user}</span> đã thích một bài viết của bạn
                          </p>
                          }
                          <span>{GetTime(noti.createdAt)}</span>
                        </div>
                        <div className="notification__item__setting">
                          <MoreHorizIcon
                            sx={{ fontSize: 30, color: grey[500] }}
                          />
                        </div>
                        <div className={`notification__item__dot ${!noti.seen && "active"}`}></div>
                      </div>
                    </li>
                  ))
                  }
                </ul>
              </div>
            </div>
  )
}

export default Notification