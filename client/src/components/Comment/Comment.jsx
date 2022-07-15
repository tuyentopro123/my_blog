import React, { useState, useEffect } from "react";
import "./Comment.scss";
import { useSelector, useDispatch } from "react-redux";
import {
  interComment,
  createComment,
  deleteComment,
} from "../../redux/apiRequest";
import DialogComponent from "../utils/Dialog/Dialog";
import GetTime from "../../utils/GetTime";
import {setReplyCommentNoti} from "../../redux/commentSlice"
// Material UI
import Stack from "@mui/material/Stack";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

// Tippy
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/shift-away-extreme.css";

import toast, { Toaster } from 'react-hot-toast';

import axios from "axios";

const Comment = ({ comment, socket, id,receive }) => {
  const emoji = [
    {
      title: "Thích",
      name: "like",
      src: "https://res.cloudinary.com/tealive/image/upload/v1653141301/emoji/c09iyar2pqvkubulcpho.png",
    },
    {
      title: "Yêu Thích",
      name: "heart",
      src: "https://res.cloudinary.com/tealive/image/upload/v1653141301/emoji/irlnd98a5vdris5ri4m8.png",
    },
    {
      title: "Vui vẻ",
      name: "funny",
      src: "https://res.cloudinary.com/tealive/image/upload/v1653141301/emoji/dagzhj3q6miykzqjmqis.png",
    },
    {
      title: "HaHa",
      name: "smile",
      src: "https://res.cloudinary.com/tealive/image/upload/v1653141302/emoji/cls4albnfxfogfxwil0z.png",
    },
    {
      title: "Sad",
      name: "cry",
      src: "https://res.cloudinary.com/tealive/image/upload/v1653141301/emoji/x1l5wdj4puqrda2bfimv.png",
    },
    {
      title: "Wow",
      name: "surprised",
      src: "https://res.cloudinary.com/tealive/image/upload/v1653141302/emoji/d8qmeeuoud0sl2i6qjmq.png",
    },
    {
      title: "Phẫn nộ",
      name: "angry",
      src: "https://res.cloudinary.com/tealive/image/upload/v1653141301/emoji/ldmpjgyrqgnewlnffo0d.png",
    },
  ];

  console.log(comment)

  const [replyComment, setReplyComment] = useState([]);
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.login?.currentUser);
  const reply = useSelector((state) => state.comment.commentpost.replyComment);

  const [newComment, setNewComment] = useState({
    user_name: currentUser.username,
    user_img: currentUser.image,
    user: currentUser._id,
    user_receiver: comment.user,
    post: comment.post,
    comment: "",
    reaction: comment._id,
    inter_user: [],
  });


  // Get value comment from textarea
  const handleChange = (e) => {
    const value = e.target.value;
    setNewComment({ ...newComment, comment: value });
  };

  // Submit comment
  const handleSubmit = async (e) => {
    e.preventDefault();
    document.getElementById(`textarea-${e.target.id}`).value = "";
    document
      .getElementById(`reaction-${e.target.id}`)
      .classList.remove("active");
    await toast.promise(createComment(
      newComment,
      dispatch
      ), {
        loading: 'Đang tải...',
        success: "Bình luận thành công",
        error: 'lỗi đường truyền',
      });
    await receive(comment.post)
    await getReplyComment(comment._id)

    if (currentUser._id !== e.target.name) {
      socket.emit("sendNotification", {
        sender_img: currentUser.image,
        sender_user: currentUser.username,
        action: "replyComment",
        action_icon: "comment",
        createdAt: Date().now,
        reaction: e.target.id,
        user_receiver: e.target.name,
        seen: false,
      });
    }
  };

  // cancel comment
  const handleCancel = (e) => {
    document
      .getElementById(`reaction-${e.target.id}`)
      .classList.remove("active");
  };

  const handleAnswers = (e) => {
    setNewComment({
      user_name: currentUser.username,
      user_img: currentUser.image,
      user: currentUser._id,
      user_receiver: e.user,
      post: e.post,
      comment: "",
      reaction: e._id,
      inter_user: [],
    })
    document
      .getElementById(`reaction-${e._id}`)
      .classList.toggle("active");
    document.getElementById(`textarea-${e._id}`).value = "";
    document.getElementById(`textarea-${e._id}`).focus();
  };

  // Setting comment properties
  const handleSetting = (e) => {
    e.target.previousSibling.classList.toggle("active");
  };

  // Submit interactive
  const handleInter = async (e) => {
    const newInter = {
      id: currentUser._id,
      username: currentUser.username,
      avatar: currentUser.image,
      user_receiver: e.target.ariaRequired,
      inter: e.target.accessKey || e.target.name,
      reaction: e.target.id,
    };
    await interComment(
      newInter,
      e.target.id,
      dispatch
    );
    if (currentUser._id !== e.target.ariaRequired) {
      socket.emit("sendNotification", {
        sender_img: currentUser.image,
        sender_user: currentUser.username,
        action: "interComment",
        action_icon: e.target.accessKey || e.target.name,
        createdAt: Date().now,
        reaction: e.target.id,
        user_receiver: e.target.ariaRequired,
        seen: false,
      });
    }
    if (e.target.ariaAtomic) getReplyComment(comment._id);
  };

      // GET REPLY OF COMMENT
      const getReplyComment = async (id) => {
        try {
          const res = await axios.get("/v1/comment/reply/" + id);
          setReplyComment(res.data.comment);
        } catch (err) {
          console.log(err)
        }
      };

  // Get reply
  const handleGetReply = () => {
    if (replyComment.length > 0) {
      setReplyComment([]);
    } else {
      getReplyComment( comment._id);
    }
  };

  useEffect(() => {
    if(reply) {
      getReplyComment(comment._id);
    }
    dispatch(setReplyCommentNoti())
  },[reply])




  // Delete comment
  const [visible, setVisible] = useState(false);
  const handleDeleteComment = () => {
    setVisible(true);
  };
  const receiveData = (data) => {
    if (data.delete) {
      toast.promise(deleteComment(
        data.user,
        { comment: data.comment, post: comment.post },
        dispatch
      ), {
          loading: 'Đang tải...',
          success: "Xóa Bình luận thành công",
          error: 'lỗi đường truyền',
        });
      
      setReplyComment(replyComment.filter((e) => e._id !== data.comment));
      setVisible(data.visible);
    } else {
      setVisible(data.visible);
    }
  };

  return (
    <div id={id} className="comment">
      <div className="comment__userComment">
        <div className="comment__userComment__container">
          <img src={comment.user_img} alt="" />
          <div className="comment__commentContent">
            <div className="comment__commentContent__container">
              <div id="comment" className="comment__commentContent__body">
                <h5>{comment.user_name}</h5>
                <div className="comment__commentContent__txt">
                  <span>{comment.comment}</span>
                </div>
                <div
                  className={`comment__commentContent__inter ${
                    comment.inter_user.length > 0 ? "active" : ""
                  }`}
                >
                  <div className="comment__commentContent__inter__img">
                    {comment.inter_user.length > 0 &&
                      emoji.map(
                        (item, index) =>
                          comment.inter_user.find(
                            (e) => e.inter === item.name
                          ) && (
                            <div
                              key={index}
                              style={{ backgroundImage: `url(${item.src})` }}
                            ></div>
                          )
                      )}
                  </div>
                  <div className="comment__commentContent__inter__count">
                    {comment.inter_user.length}
                  </div>
                  <div className="comment__commentContent__inter__toolbar">
                    <ul>
                      {comment.inter_user.map((user, index) => (
                        <li key={index}>
                          <span>{user.username}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="comment__commentContent__body__more">
                <div className="comment__commentContent__body__setting">
                  <h2 onClick={handleDeleteComment}>Xóa bình luận</h2>
                  <DialogComponent
                    onReceiveData={receiveData}
                    visible={visible}
                    user={comment.user}
                    comment={comment._id}
                  />
                </div>
                <div
                  className="comment__commentContent__body__icon"
                  onClick={(e) => handleSetting(e)}
                >
                  <MoreHorizIcon sx={{ fontSize: 25 }} />
                </div>
              </div>
            </div>

            <div className="comment__commentContent__footer">
              <p>
                <span>
                  <Tippy
                    arrow={false}
                    interactive={true}
                    theme="custom"
                    animation="shift-away-extreme"
                    duration={[150, 0]}
                    delay={[500, 0]}
                    appendTo={() => document.body}
                    content={
                      <div>
                        <Stack direction="row" spacing={2}>
                          {emoji.map((item, index) => (
                            <Tippy
                              key={index}
                              offset={[0, 15]}
                              arrow={false}
                              content={<h6>{item.title}</h6>}
                            >
                              <img
                                className="emoji-icon"
                                src={item.src}
                                name={item.name}
                                aria-required={comment.user}
                                id={comment._id}
                                onClick={(e) => handleInter(e)}
                              />
                            </Tippy>
                          ))}
                        </Stack>
                      </div>
                    }
                  >
                    <span
                      className={`text ${
                        comment.inter_user.find((e) => e.id === currentUser._id)
                          ? "active"
                          : ""
                      }`}
                      id={comment._id}
                      aria-required={comment.user}
                      accessKey="like"
                      onClick={(e) => handleInter(e)}
                    >
                      Thích
                    </span>
                  </Tippy>
                </span>
                {"·"}
                <span
                  className="text"
                  id={comment._id}
                  onClick={() => handleAnswers(comment)}
                >
                  Trả lời
                </span>
                {"·"}
                <span style={{ userSelect: "none" }}>
                  {GetTime(comment.createdAt)}
                </span>
              </p>
            </div>
            <div
              id={`reaction-${comment._id}`}
              className="comment__comment reaction"
            >
              <div className="comment__comment__txt">
                <img src={currentUser.image} alt="" />
                <textarea
                  id={`textarea-${comment._id}`}
                  type="text"
                  placeholder="Để lại bình luận của bạn"
                  onChange={handleChange}
                />
              </div>
              <div className="comment__comment__btn reaction">
                <button id={comment._id} onClick={(e) => handleCancel(e)}>
                  hủy
                </button>
                <button
                  id={comment._id}
                  name={comment.user}
                  onClick={handleSubmit}
                >
                  Bình luận
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          id={comment._id}
          onClick={(e) => handleGetReply(e)}
          className={`comment__userComment__hidden ${
            comment.reaction_count > 0 && "active"
          }`}
        >
          {comment.reaction_count > 0 && replyComment.length > 0 ? (
            <span>Ẩn bình luận</span>
          ) : (
            <span>{`hiện ${comment.reaction_count} bình luận`}</span>
          )}
        </div>

        {replyComment &&replyComment.map((answer, index) => (
          <div
            id={answer._id}
            key={index}
            className="comment__userComment__reaction"
          >
            <img src={answer.user_img} alt="" />
            <div className="comment__commentContent">
              <div className="comment__commentContent__container">
                <div id="reaction" className="comment__commentContent__body">
                  <h5>{answer.user_name}</h5>
                  <div className="comment__commentContent__txt">
                    <span>{answer.comment}</span>
                  </div>
                  <div
                    className={`comment__commentContent__inter ${
                      answer.inter_user.length > 0 ? "active" : ""
                    }`}
                  >
                    <div className="comment__commentContent__inter__img">
                      {answer.inter_user.length > 0 &&
                        emoji.map(
                          (item, index) =>
                            answer.inter_user.find(
                              (e) => e.inter === item.name
                            ) && (
                              <div
                                key={index}
                                style={{ backgroundImage: `url(${item.src})` }}
                              ></div>
                            )
                        )}
                    </div>
                    <div className="comment__commentContent__inter__count">
                      {answer.inter_user.length}
                    </div>
                    <div className="comment__commentContent__inter__toolbar">
                      <ul>
                        {answer.inter_user.map((user, index) => (
                          <li key={index}>
                            <span>{user.username}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="comment__commentContent__body__more">
                  <div className="comment__commentContent__body__setting">
                    <h2 onClick={handleDeleteComment}>Xóa bình luận</h2>
                    <DialogComponent
                      onReceiveData={receiveData}
                      visible={visible}
                      user={answer.user}
                      comment={answer._id}
                    />
                  </div>
                  <div
                    className="comment__commentContent__body__icon"
                    onClick={(e) => handleSetting(e)}
                  >
                    <MoreHorizIcon sx={{ fontSize: 25 }} />
                  </div>
                </div>
              </div>
              <div className="comment__commentContent__footer">
                <p>
                  <span>
                    <Tippy
                      arrow={false}
                      interactive={true}
                      theme="custom"
                      animation="shift-away-extreme"
                      duration={[150, 0]}
                      delay={[500, 0]}
                      appendTo={() => document.body}
                      content={
                        <div>
                          <Stack direction="row" spacing={2}>
                            {emoji.map((item, index) => (
                              <Tippy
                                key={index}
                                offset={[0, 15]}
                                arrow={false}
                                content={<h6>{item.title}</h6>}
                              >
                                <img
                                  className="emoji-icon"
                                  src={item.src}
                                  name={item.name}
                                  aria-required={answer.user}
                                  id={answer._id}
                                  aria-atomic={true}
                                  onClick={(e) => handleInter(e)}
                                />
                              </Tippy>
                            ))}
                          </Stack>
                        </div>
                      }
                    >
                      <span
                        className={`text ${
                          answer.inter_user.length > 0 ? "active" : ""
                        }`}
                        id={answer._id}
                        aria-atomic={true}
                        aria-required={answer.user}
                        accessKey="like"
                        onClick={(e) => handleInter(e)}
                      >
                        Thích
                      </span>
                    </Tippy>
                  </span>
                  {"·"}
                  <span
                    className="text"
                    id={answer._id}
                    reaction={answer.reaction}
                    onClick={(e) => handleAnswers(e)}
                  >
                    Trả lời
                  </span>
                  {"·"}
                  <span style={{ userSelect: "none" }}>
                    {GetTime(answer.createdAt)}
                  </span>
                </p>
              </div>
              <div
                id={`reaction-${answer._id}`}
                className="comment__comment reaction"
              >
                <div className="comment__comment__txt">
                  <img src={currentUser.image} alt="" />
                  <textarea
                    id={`textarea-${answer._id}`}
                    type="text"
                    placeholder="Để lại bình luận của bạn"
                    onChange={handleChange}
                  />
                </div>
                <div className="comment__comment__btn reaction">
                  <button id={answer._id} onClick={(e) => handleCancel(e)}>
                    hủy
                  </button>
                  <button
                    id={answer._id}
                    name={answer.name}
                    onClick={handleSubmit}
                  >
                    Bình luận
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comment;
