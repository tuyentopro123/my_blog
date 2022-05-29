import React, { useRef, useState, useEffect } from "react";
import "./DetailPost.scss";

import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import { red } from "@mui/material/colors";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import Stack from "@mui/material/Stack";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";

import Helmet from "../../components/Helmet/Helmet";
import GetTime from "../../utils/GetTime";

import { useSelector, useDispatch } from "react-redux";
import { createAxios } from "../../createInstance";
import { useLocation } from "react-router-dom";
import { updatePost, createComment, getComment, getReplyComment } from "../../redux/apiRequest";
import { loginSuccess } from "../../redux/authSlice";
import { redirectNotificationFinish } from "../../redux/authSlice";

import Comment from "../../components/Comment/Comment";
import Chip from "../../components/utils/Chip/Chip";
import RelatedPost from "../../components/RelatedPost/RelatedPost";

const DetailPost = ({ socket }) => {
  const dispatch = useDispatch();

  const currentUser = useSelector((state) => state.auth.login?.currentUser);
  const showComment = useSelector(
    (state) => state.auth.login?.showNotification
  );
  const redirectNoti = useSelector((state) => state.auth.login?.redirectNoti);
  const { firstLoading, relatedPost } = useSelector((state) => state.post.post);
  const post = useSelector((state) => state.post.post.userPost);
  const { commentOfPost } = useSelector(
    (state) => state.comment.commentpost
  );

  const [comment, setComment] = useState([]);
  let axiosJWT = createAxios(currentUser, dispatch, loginSuccess);
  const body = useRef(null);
  const active = useRef(null);
  const negative = useRef(null);

  const [newComment, setNewComment] = useState({
    user_name: currentUser.username,
    user_img: currentUser.image,
    user: currentUser._id,
    user_receiver: post.user._id,
    post: post._id,
    comment: "",
    inter_user: [],
  });

  // Handle like
  const handleLike = async () => {
    active.current.classList.toggle("active");
    negative.current.classList.toggle("active");
    await updatePost(
      { user: currentUser._id },
      axiosJWT,
      post._id,
      currentUser?.accessToken,
      dispatch
    );
    if (post.like_user.filter((e) => e._id === currentUser._id).length === 0) {
      socket.emit("sendNotification", {
        sender_img: currentUser.image,
        sender_user: currentUser.username,
        action: "likePost",
        action_icon: "heart",
        createdAt: Date().now,
        reaction: post._id,
        user_receiver: post.user._id,
        seen: false,
      });
    }
  };

  // Get value comment from textarea
  const handleChange = (e) => {
    if (e.target.innerText !== "") {
      e.target.classList.add("active");
    } else {
      e.target.classList.remove("active");
    }
    const value = e.target.innerText;
    setNewComment({ ...newComment, comment: value });
  };

  // Submit comment
  const handleSubmit = async (e) => {
    e.preventDefault();
    document.getElementById("txt").value = "";
    await createComment(
      newComment,
      axiosJWT,
      currentUser?.accessToken,
      dispatch
    );
    socket.emit("sendNotification", {
      sender_img: currentUser.image,
      sender_user: currentUser.username,
      action: "comment",
      action_icon: "comment",
      createdAt: Date().now,
      reaction: post._id,
      user_receiver: post.user._id,
      seen: false,
    });
    setNewComment({ ...newComment, comment: "" });
  };

  // Focus input
  const handleFocusComment = async () => {
    if (firstLoading) {
      await getComment(axiosJWT, post._id, currentUser.accessToken, dispatch);
    }
    document.getElementById("comment").classList.add("active");
    document.getElementById("overlay").classList.add("active");
  };

  const handleOffComment = async () => {
    document.getElementById("comment").classList.remove("active");
    document.getElementById("overlay").classList.remove("active");
  };

  useEffect(() => {
    let domParser = new DOMParser();
    let doc = domParser.parseFromString(post.content, "text/html");
    doc.body.childNodes.forEach((node) => {
      body.current.appendChild(node.cloneNode(true));
    });
    if (post.like_user.filter((e) => e._id === currentUser._id).length > 0) {
      active.current.classList.add("active");
    } else {
      negative.current.classList.add("active");
    }
  }, []);

  const handleScrollElement = async(id,reply) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: reply ? "start" : "center",
      inline: "nearest",
    });
    if(reply) {
      await getReplyComment(axiosJWT, redirectNoti?.reaction, currentUser.accessToken, dispatch);
    }
    setTimeout(() => {
      document.getElementById(reply ? reply : id)?.classList.add("active");
    }, 500);
  };

  useEffect(() => {
    if (commentOfPost) {
      setComment(commentOfPost);
    }
  }, [commentOfPost]);

  useEffect(() => {
    if (showComment) {
      handleFocusComment();
      if (redirectNoti?.action === "interComment") {
        handleScrollElement(redirectNoti.reaction);
      } else {
        if (redirectNoti?.action === "replyComment") {
          handleScrollElement(redirectNoti.reaction,redirectNoti.sender_comment);
        } else {
          handleScrollElement(redirectNoti.sender_comment,false);
        }
      }
      if (!firstLoading) {
        dispatch(redirectNotificationFinish());
      }
    }
  }, [firstLoading]);
  return (
    <Helmet title="Blog">
      <section className="detailpost">
        <div className="detailpost__container">
          <div className="detailpost__header">
            <h1>{post.title}</h1>
            <div className="detailpost__header__infor">
              <div className="detailpost__header__infor__user">
                <img src={post.user.image} alt="" />
                <div className="detailpost__header__infor__txt">
                  <h3>{post.user.username}</h3>
                  <span style={{ userSelect: "none" }}>
                    {GetTime(post.createdAt)}
                  </span>
                </div>
              </div>
              <div className="detailpost__header__icon">
                <RemoveRedEyeOutlinedIcon
                  className="detailpost__header__icon__unlike"
                  sx={{ fontSize: 25 }}
                  fontSize="large"
                />
                <span>{post.view}</span>
              </div>
            </div>
          </div>

          <div ref={body} className="detailpost__body"></div>

          <div className="detailpost__footer">
            <div className="detailpost__footer__inter">
              <div onClick={handleLike}>
                <FavoriteOutlinedIcon
                  className="detailpost__footer__inter__like"
                  ref={active}
                  sx={{ color: red[500], fontSize: 30 }}
                  fontSize="large"
                />
                <FavoriteBorderOutlinedIcon
                  className="detailpost__footer__inter__like"
                  ref={negative}
                  fontSize="large"
                  sx={{ fontSize: 30 }}
                />
                <span>{post.likes}</span>
              </div>
              <div onClick={handleFocusComment}>
                <ChatBubbleOutlineIcon fontSize="large" sx={{ fontSize: 30 }} />
                <span>{post.commentCount}</span>
              </div>
            </div>

            <div className="detailpost__footer__tags">
              <h3>Tags :</h3>
              <Stack direction="row" spacing={1}>
                {post.category.map((category, index) => (
                  <Chip
                    key={index}
                    className="detailpost__footer__tags__item"
                    text={category}
                    field={post.fields}
                  />
                ))}
              </Stack>
            </div>
          </div>

          <div className="detailpost__inter">
            <div className="detailpost__inter__related">
              <h1>Bài viết cùng tác giả</h1>
              <div className="detailpost__inter__relatedPost">
                {relatedPost.length > 0 ? (
                  relatedPost.map((post, index) => (
                    <RelatedPost key={index} post={post} />
                  ))
                ) : (
                  <span>tác giả chưa có bài viết mới</span>
                )}
              </div>
            </div>
          </div>

          <div
            id="overlay"
            className="detailpost__idea__overlay overlay"
            onClick={handleOffComment}
          ></div>
          <div id="comment" className="detailpost__idea">
            <div className="detailpost__idea__container">
              <div className="detailpost__idea__commentCount">
                <h1>{post.commentCount} bình luận</h1>
              </div>
              <div className="detailpost__idea__comment">
                <div className="detailpost__idea__comment__txt">
                  <img src={currentUser.image} alt="" />
                  <div
                    id="txt"
                    className="txt"
                    type="text"
                    contentEditable="true"
                    onKeyUp={(e) => handleChange(e)}
                    placeholder="Để lại bình luận của bạn"
                  ></div>
                </div>
                <div className="detailpost__idea__comment__btn">
                  <button onClick={handleSubmit}>Bình luận</button>
                </div>
              </div>
              <div className="detailpost__idea__listComment">
                <div
                  className={`detailpost__idea__listComment__content ${
                    comment.length === 0 ? "active" : ""
                  }`}
                >
                  {comment.length === 0 ? (
                    <span>Chưa có bình luận</span>
                  ) : (
                    comment.map((comment, key) => (
                      <div key={key}>
                        <Comment
                          id={comment._id}
                          comment={comment}
                          socket={socket}
                        />
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Helmet>
  );
};

export default DetailPost;
