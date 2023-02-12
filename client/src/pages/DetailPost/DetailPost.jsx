import React, { useRef, useState, useEffect } from "react";
import "./DetailPost.scss";

// UI material
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import { red,amber } from "@mui/material/colors";
import BookmarksOutlinedIcon from '@mui/icons-material/BookmarksOutlined';
import BookmarkOutlinedIcon from '@mui/icons-material/BookmarkOutlined';
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";

// Skeleton
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import CloseIcon from '@mui/icons-material/Close';

import Helmet from "../../components/Helmet/Helmet";
import GetTime from "../../utils/GetTime";
import {publicRequest} from '../../utils/configAxios'


import { useSelector, useDispatch } from "react-redux";
import { useLocation,useParams,Link } from "react-router-dom";
import {  createComment } from "../../redux/apiRequest";
import {getReplyCommentNoti,resetCommentOfPost} from "../../redux/commentSlice"
import { redirectNotificationFinish } from "../../redux/authSlice";
import {startFirstLoading,FinishLoading,resetFirstLoading} from "../../redux/postSlice"
import LazyLoad from "react-lazyload";

import Comment from "../../components/Comment/Comment";
import Chip from "../../components/utils/Chip/Chip";
import RelatedPost from "../../components/RelatedPost/RelatedPost";

import toast, { Toaster } from 'react-hot-toast';
const notifyError = (e) => toast.error(e);
const notifySpam = () => toast('Vui lòng không spam',
                                {
                                  icon: '🤫',
                                  style: {
                                    borderRadius: '10px',
                                    background: '#333',
                                    color: '#fff',
                                  },
                                }
                              );
const notify = () => toast('Chức năng hiện đang bảo trì', {
                        icon: '🛠',
                      });

const DetailPost = () => {
  const location = useLocation()
  const {slug} = useParams()
  
  const dispatch = useDispatch();
  
  const currentUser = useSelector((state) => state.auth.login?.currentUser);
  const showComment = useSelector(
    (state) => state.auth.login?.showNotification
    );
    const redirectNoti = useSelector((state) => state.auth.login?.redirectNoti);
    const { firstLoading} = useSelector((state) => state.post.post);
    const  commentOfPost  = useSelector((state) => state.comment.commentpost.commentOfPost);
    const [post,setPost] = useState()

    const [relatedPost,setRelatedPost] = useState({})

    const [randomPost,setRandomPost] = useState()
    
  const [comment, setComment] = useState();
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
  const getUserPost = async (slug) => {
    dispatch(startFirstLoading())
    try {
      const res = await publicRequest.get("/v1/post/" + slug);
      dispatch(FinishLoading())
      setPost(res.data.userPost)
      setRelatedPost(res.data.relatedPost)
    } catch (err) {
      console.log(err)
    }
  };


  // GET COMMENT
  const getComment = async (id) => {
    try {
      const res = await publicRequest.get("/v1/comment/comment/" + id);
      setComment(res.data)
      dispatch(resetFirstLoading())
    } catch (err) {
      console.log(err)
    }
  };

  // UPDATE LIKE
  const updatePost = async (user,id) => {
    try {
      const res = await publicRequest.post("/v1/post/update/" + id,user);
      setPost(res.data)
    } catch (err) {
      console.log(err)
    }
  };

    // SAVE POST
    const savePost = async (user,id) => {
      try {
        const res = await publicRequest.post("/v1/post/save/" + id,user);
        setPost(res.data)
      } catch (err) {
        console.log(err)
      }
    };

 // RANDOM POST
 const getRandomPost = async () => {
  try {
    const res = await publicRequest.get("/v1/post/path/random");
    setRandomPost(res.data.randomPosts1);
  } catch (err) {
    console.log(err);
  }
};

  // Handle like
  const handleLike = async () => {
    let noti = ""
    if(post.like_user.filter((e) => e._id === currentUser._id).length === 0) {
      noti = "Bạn đã like bài viết thành công";
    } else {
      noti = "Bạn đã bỏ like bài viết";
    }
    await toast.promise(updatePost(
      { user: currentUser._id },
      post._id,
    ), {
      loading: 'Đang tải...',
      success: noti,
      error: 'lỗi đường truyền',
    });
    // if (post.like_user.filter((e) => e._id === currentUser._id).length === 0) {
    //   socket.emit("sendNotification", {
    //     sender_img: currentUser.image,
    //     sender_user: currentUser.username,
    //     action: "likePost",
    //     action_icon: "heart",
    //     createdAt: Date().now,
    //     reaction: post._id,
    //     user_receiver: post.user._id,
    //     seen: false,
    //   });
    // }
  };

  // Handle save 
  const handleSave = async() => {
    let mess = ""
    if(post.user_save.includes(currentUser._id)) {
      mess = "Bạn đã bỏ lưu bài viết";
    } else {
      mess = "Bạn đã lưu bài viết thành công";
    }
    await toast.promise(savePost(
      { user: currentUser._id },
      post._id,
    ), {
      loading: 'Đang tải...',
      success: mess,
      error: 'lỗi đường truyền',
    });
  }

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
    if(newComment.comment === "") {
      notifyError("Bạn cần viết gì đó")
    } else {
      await toast.promise(createComment(
        newComment,
        dispatch
        ), {
          loading: 'Đang tải...',
          success: "Bình luận thành công",
          error: 'lỗi đường truyền',
        });
      await getComment(post._id)
      // socket.emit("sendNotification", {
      //   sender_img: currentUser.image,
      //   sender_user: currentUser.username,
      //   action: "comment",
      //   action_icon: "comment",
      //   createdAt: Date().now,
      //   reaction: post._id,
      //   user_receiver: post.user._id,
      //   seen: false,
      // });
      setNewComment({ ...newComment, comment: "" });
    }
  };

  // Share 
  var click = 0;
  const handleShare = () =>  {
    if(click < 5) {
      click++;
      notify()
    } else {
      notifySpam();
      click = 0;
    }
  }

  // Focus input
  const handleFocusComment = async () => {
    if (firstLoading) {
      await getComment( post._id);
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
      dispatch(getReplyCommentNoti(redirectNoti?.reaction))
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
    dispatch(resetCommentOfPost())
      setComment([]);
      getUserPost(location.pathname.slice(6))
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
    }
  }, [post]);

  useEffect(() => {
    if(commentOfPost) {
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
      <Toaster
                toastOptions={{
                    className: '',
                    style: {
                        padding: '16px',
                        fontSize:'14px',
                    },
                }}
            />
      <section className="detailpost">
        <div className="detailpost__container">
          <div className="detailpost__header">
            {post ? 
            <h1>{post.title}</h1>
            :
            <Skeleton sx={{ bgcolor: 'grey.800' }} variant="text" height={100}/>
            }
            <div className="detailpost__header__infor">
              {post ? 
                <div className="detailpost__header__infor__user">
                  <img src={post.user.image} alt="" />
                  <div className="detailpost__header__infor__txt">
                    <h3>{post.user.username}</h3>
                    <span style={{ userSelect: "none" }}>
                      {GetTime(post.createdAt)}
                    </span>
                    <span>Lượt xem: {post.view}</span>
                  </div>
                </div>
                :
                <div className="detailpost__header__infor__user">
                  <Skeleton sx={{ bgcolor: 'grey.800' }} variant="circular" width={60} height={60} />
                  <div className="detailpost__header__infor__txt">
                  <Stack spacing={.5}>
                    <Skeleton sx={{ bgcolor: 'grey.800' }} variant="text" height={20} width={100} />
                    <Skeleton sx={{ bgcolor: 'grey.800' }} variant="text" height={20} width={100} />
                    <Skeleton sx={{ bgcolor: 'grey.800' }} variant="text" height={20} width={100} />
                  </Stack>
                  </div>
                </div>
              }
              {post && 
                <div className="detailpost__header__icon" >
                  <div className="detailpost__header__save" onClick={handleSave}>
                    {post.user_save.includes(currentUser._id) ? 
                    <BookmarkOutlinedIcon
                    className="detailpost__header__icon__saved"
                    sx={{ fontSize: 25,color: amber[400] }}
                    fontSize="large"
                    />
                    :
                    <BookmarksOutlinedIcon
                      className="detailpost__header__icon__save"
                      sx={{ fontSize: 25,color: amber[400] }}
                      fontSize="large"
                    />
                    }
                  </div>
                  <div
                      id="share"
                      className="detailpost__header__share"
                      onClick={handleShare}
                    >
                      <MoreHorizIcon sx={{ fontSize: 25,color: amber[400] }} />
                  </div>
                </div>
              }
            </div>
          </div>

          {post ? 
          <div ref={body} className="detailpost__body"></div>
            :
            <Skeleton sx={{ bgcolor: 'grey.800' }} variant="rectangular" height={500} />
        }

          {post &&
            <div className="detailpost__footer">
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
          }

            <div className="detailpost__inter">
              <div className="detailpost__inter__related">
                <h1>Bài viết cùng tác giả</h1>
                <div className="detailpost__inter__relatedPost">
                  {relatedPost?.length > 0 ? (
                    relatedPost?.map((post, index) => (
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
          {post ? 
            <div className="detailpost__footer__inter">
                <div onClick={handleLike}>
                  {post?.like_user.filter((e) => e._id === currentUser._id).length > 0 ? 
                  <FavoriteOutlinedIcon
                    className="detailpost__footer__inter__like"
                    ref={active}
                    sx={{ color: red[500], fontSize: 30 }}
                    fontSize="large"
                  /> : 
                    <FavoriteBorderOutlinedIcon
                      className="detailpost__footer__inter__like"
                      ref={negative}
                      fontSize="large"
                      sx={{ fontSize: 30,color: amber[400] }}
                    />
                  }
                  <span ref={number}>{post.likes}</span>
                </div>
                <div onClick={handleFocusComment}>
                  <ChatBubbleOutlineIcon fontSize="large" sx={{ fontSize: 30,color: amber[400] }} />
                  <span>{post.commentCount}</span>
                </div>
            </div>
            :
            <Skeleton sx={{ bgcolor: 'grey.800' }} variant="text" height={50}/>
          }
          </div>
          {post ? 
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
          :
          <Skeleton sx={{ bgcolor: 'grey.800' }} variant="rectangular" height={400} />
          }
        </div>
            
      </section>

      {/* OVERLAY COMMENT */}
      {post && 
      <div className="detailpost__comment">
          <div
              id="overlay"
              className="detailpost__idea__overlay"
              onClick={handleOffComment}
            ></div>
          <div id="comment" className="detailpost__idea">
              <div className="detailpost__idea__closeTab" onClick={handleOffComment}>
                <CloseIcon sx={{fontSize:30}}/>
              </div>
              <div className="detailpost__idea__container">
                <div className="detailpost__idea__commentCount">
                  <h1>{post.commentCount} bình luận</h1>
                  <p>(Vui lòng không spam các nội dung không lành mạnh hoặc gây war!)</p>
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
                  {comment && 
                    <div
                      className={`detailpost__idea__listComment__content ${
                        comment.length === 0 ? "active" : ""
                      }`}
                    >
                      {comment.length === 0 ? (
                        <span>Chưa có bình luận</span>
                      ) : (
                        comment.map((comment, key) => (
                          <div key={key} >
                            <Comment
                              id={comment._id}
                              comment={comment}
                              receive={getComment}
                            />
                          </div>
                        ))
                      )}
                    </div>
                  }
                </div>
              </div>
          </div>
        </div>
      }

    </Helmet>
  );
};

export default DetailPost;
