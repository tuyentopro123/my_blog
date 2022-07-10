import React, { useEffect, useState } from "react";
import "./Body.scss";
import List from "../utils/List/List";
import Grid from "../utils/Grid/Grid";
import Thumbnail from "../Thumbnail/Thumbnail";
import Chip from "../utils/Chip/Chip";
import {useNavigate} from "react-router-dom"

// Import material ui
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import axios from "axios";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import { red,blue,purple,orange,indigo } from "@mui/material/colors";
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import YouTubeIcon from '@mui/icons-material/YouTube';
import TwitterIcon from '@mui/icons-material/Twitter';

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import "swiper/css/effect-flip";

import getTimeString from "../../utils/GetTimeString";

// import required modules
import { Navigation, Autoplay, EffectFlip } from "swiper";
import PostItem from "../PostItem/PostItem";
import MiniPost from "../MiniPost/MiniPost";
import { Avatar } from "@mui/material";



const Body = () => {
  const [topPost, setTopPost] = useState([]);
  const [listPost, setListPost] = useState([]);
  const [viewPost, setViewPost] = useState([]);
  const [popularPost, setPopularPost] = useState([]);
  const [randomPost, setRandomPost] = useState({});
  const navigate = useNavigate()


  const [loading, setLoading] = useState(true);
  const categories = [
    {
      text: "reactJs",
      field: "program",
      image: "https://reactjs.org/logo-og.png",
    },
    {
      text: "social",
      field: "life",
      image:
        "https://baobinhdinh.vn/viewimage.aspx?imgid=206339",
    },
    {
      text: "frontend",
      field: "program",
      image: "https://nordiccoder.com/app/uploads/2019/10/39-frontend.jpg",
    },
    {
      text: "game",
      field: "life",
      image:
        "https://cdn.sforum.vn/sforum/wp-content/uploads/2022/03/MVU-BFADM-2020-Q4-Skyscraper-Future-of-Video-Games-Trends-Technology-Types-header-v2-1000x523-1.jpg",
    },
    {
      text: "backend",
      field: "program",
      image:
        "https://blog.freec.asia/wp-content/uploads/2020/11/cong-viec-backend-developer-1.jpg",
    },
    {
      text: "drama",
      field: "life",
      image:
        "https://meta.vn/Data/image/2021/06/21/drama-la-gi-2.jpg",
    },
  ];

  const social = [
    {
      title: "Facebook",
      href: "https://www.facebook.com/tea.live.167/",
      icon: FacebookIcon,
      color:indigo,
    },
    {
      title: "instagram",
      href: "https://www.facebook.com/tea.live.167/",
      icon: InstagramIcon,
      color:orange,
    },
    {
      title: "linkedin",
      href: "https://www.facebook.com/tea.live.167/",
      icon: LinkedInIcon,
      color:purple,
    },
    {
      title: "github",
      href: "https://www.facebook.com/tea.live.167/",
      icon: GitHubIcon,
      color:null,
    },
    {
      title: "youtube",
      href: "https://www.facebook.com/tea.live.167/",
      icon: YouTubeIcon,
      color:red,
    },
    {
      title: "twitter",
      href: "https://www.facebook.com/tea.live.167/",
      icon: TwitterIcon,
      color:blue
    },
  ]

  const swiperOptionsV1 = {
    modules: [Navigation, Autoplay],
    navigation: { clickable: true },
    slidesPerView: 1,
    grabCursor: true,
    centeredSlides: true,
    speed: 400,
    width: 800,
    initialSlide: 3,
    autoplay: {
      delay: 6000,
    },
    loop: true,
    loopAdditionalSlides: 2,
    breakpoints: {
      768: {
        slidesPerView: 1,
        spaceBetween: 10,
      },
      1200: {
        slidesPerView: 1,
        spaceBetween: 20,
      },
    },
  };

  const swiperOptionsV2 = {
    modules: [Navigation],
    navigation: { clickable: true },
    slidesPerView: 4,
    grabCursor: true,
    centeredSlides: true,
    speed: 300,
    loop: true,
    loopAdditionalSlides: 1,
    // loopedSlides:,
    initialSlide: 4,
    breakpoints: {
      768: {
        slidesPerView: 4,
        spaceBetween: 10,
      },
      1200: {
        slidesPerView: 4,
        spaceBetween: 10,
      },
    },
  };

  const swiperOptionsV3 = {
    modules: [EffectFlip],
    slidesPerView: 1,
    grabCursor: true,
    centeredSlides: true,
    speed: 400,
    loop: true,
    effect: "flip",
    loopAdditionalSlides: 2,
    breakpoints: {
      768: {
        slidesPerView: 4,
        spaceBetween: 10,
      },
      1200: {
        slidesPerView: 1,
        spaceBetween: 10,
      },
    },
  };

      // GET POST
    const handleGetPost = (post) => {
        navigate(`/post/${post.slug}`,{state: post._id})
    }

  useEffect(() => {
    let controller = new AbortController();
    // HIGHLIGHT POST
    const highLightPost = async () => {
      try {
        const res = await axios.get("/v1/post/path/highlight");
        setTopPost(res.data);
        controller = null;
      } catch (err) {
        console.log(err);
      }
    };

    // NEW POST
    const newPost = async () => {
      try {
        const res = await axios.get("/v1/post/path/new");
        setListPost(res.data);
        controller = null;
      } catch (err) {
        console.log(err);
      }
    };

    // COMMENT POST
    const commentPost = async () => {
        try {
          const res = await axios.get("/v1/post/path/comment");
          setPopularPost(res.data);
          controller = null;
        } catch (err) {
          console.log(err);
        }
      };

       // RANDOM POST
    const randomPost = async () => {
        try {
          const res = await axios.get("/v1/post/path/random");
          setRandomPost(res.data);
          controller = null;
        } catch (err) {
          console.log(err);
        }
      };

    // VIEW POST
    const viewPost = async () => {
      try {
        const res = await axios.get("/v1/post/path/view");
        setViewPost(res.data);
        controller = null;
      } catch (err) {
        console.log(err);
      }
    };
    highLightPost();
    newPost();
    viewPost();
    commentPost();
    randomPost();
    setLoading(false);
    return () => {
      setTopPost([]);
      setListPost([]);
      setPopularPost([]);
      setRandomPost({});
      setViewPost([]);
      controller?.abort()
    };
  }, []);
  return (
    <section className="body">
      <div className="body__content">
        <div className="body__trailer">
          <div className="body__desc">
            <Swiper {...swiperOptionsV1}>
              {topPost.map((post, index) => (
                <SwiperSlide key={index}>
                  <PostItem post={post} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>

        <div className="body__post">
          {/* <-----------First form------------>*/}
          <div className="body__post__firstForm">
            <List header="Recent Stories">
              <Grid col={2} md={2} sm={1} gapCol={30} gapRow={30}>
                {listPost.map((post, index) => (
                  <Thumbnail key={index} post={post} />
                ))}
              </Grid>
            </List>
            <div className="body__post__firstForm__sidebar">
              <List header="read more" active="active">
                <Grid col={1} md={2} sm={1} gapCol={20} gapRow={25}>
                  {viewPost.map((post, index) => (
                    <MiniPost key={index} post={post} />
                  ))}
                </Grid>
              </List>
              <List header="categories popular" active="active">
                <Grid col={2} md={2} sm={1} gapCol={10} gapRow={10}>
                  {categories.map((cart, index) => (
                    <Chip
                      key={index}
                      text={cart.text}
                      field={cart.field}
                      className="cart"
                      image={cart.image}
                    ></Chip>
                  ))}
                </Grid>
              </List>
            </div>
          </div>

          <div className="body__banner">
            <div className="body__banner__overlay"></div>
            <div
              className="body__banner__img"
              style={{
                backgroundImage: `url(https://img5.thuthuatphanmem.vn/uploads/2021/08/25/background-3d-4k_085529380.jpg)`,
              }}
            >
              <span>Ads Banner</span>
            </div>
          </div>
          {/* <-----------Second form------------>*/}

          <div className="body__post__secondForm">  
            <List header="popular stories">
              <Swiper {...swiperOptionsV2}>
                {popularPost.map((post, index) => (
                  <SwiperSlide key={index}>
                    <div
                      key={index}
                      className="body__post__secondForm__popular"
                    >
                      <div className="body__post__secondForm__item">
                        <div
                          className="body__post__secondForm__img"
                          style={{ backgroundImage: `url(${post.imgPost})` }}
                        ></div>
                        <div className="body__post__secondForm__desc">
                          <div className="body__post__secondForm__desc__content">
                            <Chip
                              key={index}
                              className="body__post__secondForm__desc__content__chip"
                              text={post.category[0]}
                              field={post.fields}
                            />
                          </div>
                          <div className="body__post__secondForm__desc__icon">
                            <AccessTimeIcon
                              sx={{ fontSize: 20, color: red[400] }}
                            />
                            <span>{getTimeString(post.createdAt)}</span>
                          </div>

                          <div className="body__post__secondForm__desc__icon">
                            <ChatBubbleOutlineIcon
                              sx={{ fontSize: 20, color: red[400] }}
                            />
                            <span>{post.commentCount}</span>
                          </div>
                        </div>
                        <div className="body__post__secondForm__title">
                          <h1>{post.title}</h1>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </List>
          </div>
          {/* <-----------Third form------------>*/}

          <div className="body__post__thirdForm">
            <List header="You Don't miss">
              <div className="body__post__thirdForm__container">
                <Swiper {...swiperOptionsV3}>
                  {Object.keys(randomPost).length > 0 && randomPost.randomPosts1.map((post, index) => (
                    <SwiperSlide key={index}>
                      <div
                        key={index}
                        className="body__post__thirdForm__memorable"
                        style={{ backgroundImage: `url(${post.imgPost})` }}
                        onClick={() => handleGetPost(post)}
                      >
                        <div className="body__post__thirdForm__item">
                          <div className="body__post__thirdForm__title">
                            <h1>{post.title}</h1>
                          </div>
                          <div className="body__post__thirdForm__desc">
                            <div className="body__post__thirdForm__desc__content">
                              <span>{post.category[0]}</span>
                            </div>
                            <div className="body__post__thirdForm__desc__icon">
                              <AccessTimeIcon
                                sx={{ fontSize: 20, color: red[400] }}
                              />
                              <span>{getTimeString(post.createdAt)}</span>
                            </div>

                            <div className="body__post__thirdForm__desc__icon">
                              <FavoriteBorderOutlinedIcon
                                sx={{ fontSize: 20, color: red[400] }}
                              />
                              <span>{post.likes}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
                <Swiper {...swiperOptionsV3}>
                  {Object.keys(randomPost).length > 0 && randomPost.randomPosts2.map((post, index) => (
                    <SwiperSlide key={index}>
                      <div
                        key={index}
                        className="body__post__thirdForm__memorable"
                        style={{ backgroundImage: `url(${post.imgPost})` }}
                        onClick={() => handleGetPost(post)}
                      >
                        <div className="body__post__thirdForm__item">
                          <div className="body__post__thirdForm__title">
                            <h1>{post.title}</h1>
                          </div>
                          <div className="body__post__thirdForm__desc">
                            <div className="body__post__thirdForm__desc__content">
                              <span>{post.category[0]}</span>
                            </div>
                            <div className="body__post__thirdForm__desc__icon">
                              <AccessTimeIcon
                                sx={{ fontSize: 20, color: red[400] }}
                              />
                              <span>{getTimeString(post.createdAt)}</span>
                            </div>

                            <div className="body__post__thirdForm__desc__icon">
                              <FavoriteBorderOutlinedIcon
                                sx={{ fontSize: 20, color: red[400] }}
                              />
                              <span>{post.likes}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </List>
            <div className="body__post__firstForm__sidebar">
              <List header="Contact me" active="active">
                <div className="follow">
                  <div className="follow__image">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Statue_of_Tran_Hung_Dao%2C_Nam_Dinh_City%2C_Vietnam_%2803%29.jpg/1200px-Statue_of_Tran_Hung_Dao%2C_Nam_Dinh_City%2C_Vietnam_%2803%29.jpg" alt="" />
                  </div>
                  <div className="follow__social">
                    <Grid col={2} md={2} sm={1} gapCol={15} gapRow={15}>
                      {social.map((item, index) => (
                        <div key={index} className="follow__social__item">
                          <a href={item.href}>
                            <item.icon sx={{ fontSize: 60,color: item.color ? item.color[500] : "disabled"}} />
                            <div className="follow__social__item__content">
                              <span className="follow__social__item__title" >{item.title}</span>
                              <span className="follow__social__item__like" >200k</span>
                            </div>
                          </a>
                        </div>
                      ))}
                    </Grid>
                  </div>
                </div>
              </List>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Body;
