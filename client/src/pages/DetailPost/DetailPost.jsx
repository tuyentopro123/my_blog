import React, { useRef, useState, useEffect } from "react";
import "./DetailPost.scss";

// UI material
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import { red } from "@mui/material/colors";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";

import Helmet from "../../components/Helmet/Helmet";
import GetTime from "../../utils/GetTime";
import axios from "axios";

import { useSelector, useDispatch } from "react-redux";
import { useLocation,useParams,Link } from "react-router-dom";
import { updatePost, createComment, getComment, getReplyComment } from "../../redux/apiRequest";
import { redirectNotificationFinish } from "../../redux/authSlice";
import {startFirstLoading,FinishLoading} from "../../redux/postSlice"
import LazyLoad from "react-lazyload";

import Comment from "../../components/Comment/Comment";
import Chip from "../../components/utils/Chip/Chip";
import RelatedPost from "../../components/RelatedPost/RelatedPost";

const DetailPost = ({ socket }) => {
  const location = useLocation()
  const {slug} = useParams()
  
  const dispatch = useDispatch();
  
  const currentUser = useSelector((state) => state.auth.login?.currentUser);
  const showComment = useSelector(
    (state) => state.auth.login?.showNotification
    );
    const redirectNoti = useSelector((state) => state.auth.login?.redirectNoti);
    const { firstLoading} = useSelector((state) => state.post.post);
    const [post,setPost] = useState()

    const [relatedPost,setRelatedPost] = useState({})

    const [randomPost,setRandomPost] = useState()

  const { commentOfPost } = useSelector(
    (state) => state.comment.commentpost
  );

  const [comment, setComment] = useState([]);
  const body = useRef(null);
  const active = useRef(null);
  const negative = useRef(null);
  const number = useRef(null);

  const [newComment, setNewComment] = useState({
    user_name: currentUser.username,
    user_img: currentUser.image,
    user: currentUser._id,
    user_receiver: "",
    post: "",
    comment: "",
    inter_user: [],
  });
// GET POST
  const getUserPost = async (id) => {
    dispatch(startFirstLoading())
    try {
      const res = await axios.get("/v1/post/" + id);
      dispatch(FinishLoading())
      setPost(res.data.userPost)
      setRelatedPost(res.data.relatedPost)
    } catch (err) {
      console.log(err)
    }
  };

 // RANDOM POST
 const getRandomPost = async () => {
  try {
    const res = await axios.get("/v1/post/path/random");
    setRandomPost(res.data.randomPosts1);
  } catch (err) {
    console.log(err);
  }
};

  // Handle like
  const handleLike = async () => {
    active.current.classList.toggle("active");
    negative.current.classList.toggle("active");
    await updatePost(
      { user: currentUser._id },
      post._id,
      dispatch
    );
    getUserPost(location.state);
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
    const value = e.target.innerText;
    setNewComment({ ...newComment,
      user_receiver: post.user._id,
      post: post._id, 
      comment: value 
    });
  };

  // Submit comment
  const handleSubmit = async (e) => {
    e.preventDefault();
    document.getElementById("txt").innerText = "";
    await createComment(
      newComment,
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
      await getComment( post._id, dispatch);
    }
    document.getElementById("comment").classList.add("active");
    document.getElementById("overlay").classList.add("active");
  };

  const handleOffComment =() => {
    document.getElementById("comment").classList.remove("active");
    document.getElementById("overlay").classList.remove("active");
    document.getElementById("txt").innerText = "";
  };



  const handleScrollElement = async(id,reply) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: reply ? "start" : "center",
      inline: "nearest",
    });
    if(reply) {
      await getReplyComment(redirectNoti?.reaction, dispatch);
    }
    setTimeout(() => {
      document.getElementById(reply ? reply : id)?.classList.add("active");
    }, 500);
  };



  useEffect(() => {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    })
      getUserPost(location.state)
      getRandomPost()
  }, [slug]);

  useEffect(() => {
    if(post) {
      body.current.innerHTML = "";
      let domParser = new DOMParser();
      let doc = domParser.parseFromString(post?.content, "text/html");
      doc.body.childNodes.forEach((node) => {
        body.current?.appendChild(node.cloneNode(true));
      });
      if (post?.like_user.filter((e) => e._id === currentUser._id).length > 0) {
        active.current.classList.add("active");
      } else {
        negative.current.classList.add("active");
      }
    }
  }, [post]);

 
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
    <>
    {post &&
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
            {/* <div className="detailpost__footer__inter">
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
            </div> */}

            <div className="detailpost__footer__tags">
                <span>Tags :</span>
                {post.category.map((category, index) => (
                  <Chip
                    key={index}
                    className="detailpost__footer__tags__item"
                    text={category}
                    field={post.fields}
                  />
                ))}
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
        </div>
        <div className="detailpost__sidebar">
          <div className="detailpost__icon">
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
                <span ref={number}>{post.likes}</span>
              </div>
              <div onClick={handleFocusComment}>
                <ChatBubbleOutlineIcon fontSize="large" sx={{ fontSize: 30 }} />
                <span>{post.commentCount}</span>
              </div>
            </div>
          </div>
          <div className="detailpost__popular">
            <h2>Popular post</h2>
            {
              randomPost && 
              <div className="detailpost__popular__list">
                {
                  randomPost.map((item,index) => (
                    <Link to={`/post/${item.slug}`} 
                          state={item._id} 
                          key={index} 
                          className="detailpost__popular__item">
                      <span className="detailpost__popular__image">
                        <LazyLoad height={250} width={150} once>
                                <img src={item.imgPost} alt="" />
                        </LazyLoad>
                      </span>
                      <div className="detailpost__popular__body">
                        <div className="detailpost__popular__body__header">
                            <h3>{item.title}</h3>
                        </div>
                        <span>{GetTime(item.createdAt)}</span>
                      </div>
                    </Link>
                  ))
                }
              </div>
            }
          </div>
        </div>
            
      </section>

      {/* OVERLAY COMMENT */}
      <div className="detailpost__comment">
          <div
              id="overlay"
              className="detailpost__idea__overlay"
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

    </Helmet>
    }
    </>
  );
};

export default DetailPost;
