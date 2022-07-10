import React,{useState,useEffect} from 'react'
import './About.scss'
import {Link} from 'react-router-dom'
import axios from 'axios'
import LazyLoad from "react-lazyload";
import GetTime from "../../utils/GetTime";
import Helmet from "../../components/Helmet/Helmet";
import { FacebookProvider, Like } from 'react-facebook';

// mui material
import Avatar from "@mui/material/Avatar";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { red,blue,purple,orange,indigo,yellow } from "@mui/material/colors";
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import YouTubeIcon from '@mui/icons-material/YouTube';
import TwitterIcon from '@mui/icons-material/Twitter';


const About = () => {
    const social = [
        {
          href: "https://www.facebook.com/tea.live.167/",
          icon: FacebookIcon,
          color:indigo,
        },
        {
          href: "https://www.facebook.com/tea.live.167/",
          icon: InstagramIcon,
          color:orange,
        },
        {
          href: "https://www.facebook.com/tea.live.167/",
          icon: LinkedInIcon,
          color:purple,
        },
        {
          href: "https://www.facebook.com/tea.live.167/",
          icon: GitHubIcon,
          color:null,
        },
        {
          href: "https://www.facebook.com/tea.live.167/",
          icon: YouTubeIcon,
          color:red,
        },
        {
          href: "https://www.facebook.com/tea.live.167/",
          icon: TwitterIcon,
          color:blue
        },
      ]

    const categories = [
        {
            name: "Frontend",
            field: "program"
        },
        {
            name: "Backend",
            field: "program"
        },
        {
            name: "NodeJS",
            field: "program"
        },
        {
            name: "Game",
            field: "life"
        },
        {
            name: "Social",
            field: "life"
        },
        {
            name: "Sports",
            field: "life"
        },
    ]

    const [random,setRandom] = useState()
     // RANDOM POST
    const getRandomPost = async () => {
        try {
        const res = await axios.get("/v1/post/path/random");
        setRandom(res.data.randomPosts1);
        } catch (err) {
        console.log(err);
        }
    };

    useEffect(() => {
        getRandomPost();
        return () => setRandom();
    },[])
  return (
    <Helmet title="About">
        <section className="about">
            <div className="about__banner"></div>
            <div className="about__container">
                <div className="about__info">
                    <h1>Xin chào các bạn</h1>
                    <div className="about__info__content">
                        <p>Chào các bạn, tôi là Khang, hiện đang là sinh viên năm 3 D20 ở Học Viện Công nghệ Bưu Chính Viễn thông PTIT. Hiện tại tôi đang định hướng trở thành một web developer thực thụ. Tôi có khả năng tự học, và tìm hiểu các công nghệ mới thông qua việc đọc các document về công nghệ đó hay thông qua việc xem các Youtube channel về các công nghệ đó.</p>
                        <div className="about__info__image">
                            <img src="https://i.pinimg.com/originals/cf/8a/44/cf8a4484ed5610ce55141f2cef7b4e25.jpg" alt="" />
                        </div>
                        <p>Hiện tại chuyên môn chính của tôi là về mảng front-end web. Tôi làm việc qua nhiều về ReactJS và tôi rất hứng thú về nó. Back-end tôi đang làm theo NodeJS dựa trên Javascript, nhưng chắc sau này tôi sẽ học thêm một ngôn ngữ và framework back-end mới như PHP, Go, Golang...</p>
                        <p>Tiếng anh của tôi ở mức độ giao tiếp cơ bản và đọc hiểu được document.</p>
                    </div>
                    <span>Cảm ơn mọi người đã ghé thăm trang web của mình. <a href="/">Về trang chủ</a></span>
                </div>

                <div className="about__sidebar">
                    <div className="about__personal">
                        <div className="about__personal__banner"></div>
                        <div className="about__personal__box">
                            <div className="about__personal__avatar">
                                <Avatar
                                    sx={{ width: 140, height: 140 }}
                                    src="https://yt3.ggpht.com/ytc/AKedOLRwjFr7ljzmtF-lRtLcnUv6NmmkH7ud-vdgMpO6KA=s900-c-k-c0x00ffffff-no-rj"
                                />
                            </div>
                            <div className="about__personal__content">
                                <div className="about__personal__content__title">
                                    <h2>Nguyễn Văn Tuyên</h2>
                                    <div className="about__personal__content__address">
                                        <LocationOnIcon sx={{fontSize: 15,color: yellow[700]}}/>
                                        Lương Ngọc Quyến, Hà Đông, Hà Nội
                                    </div>
                                </div>
                                <div className="about__personal__content__detail">
                                    <p>Hi my name is Marshall and this is my Journey! I use this awesome blog theme to tell people my story. Through all the places and things I see around the world, there isn't a best way to share my experience! Follow my daily updates and discover with me the essence of traveling!</p>
                                </div>
                                <div className="about__personal__content__social">
                                    {social.map((item, index) => (
                                        <div key={index} className="about__personal__content__item">
                                            <a href={item.href}>
                                                <item.icon sx={{ fontSize: 20,color: item.color ? item.color[500] : "disabled"}} />
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="about__more">
                        <div className="about__more__category">
                            <div className="about__sidebar__title">
                                <span>categories</span>
                            </div>
                            <ul>
                                {categories.map((item,index) => (
                                    <li key={index} id={item.name}>
                                        <Link to={`/${item.field}?category=${item.name}`}>
                                            {item.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="about__more__popular-post">
                            <div className="about__sidebar__title">
                                <span>popular</span>
                            </div>
                            <div className="about__more__popular__list">
                                {random && 
                                random.map((item,index) => (
                                    <Link to={`http://localhost:3000/post/${item.slug}`} 
                                        state={item._id} 
                                        key={index} 
                                        className="about__more__popular__item">
                                    <span className="about__more__popular__image">
                                        <LazyLoad height={250} width={150} once>
                                                <img src={item.imgPost} alt="" />
                                        </LazyLoad>
                                    </span>
                                    <div className="about__more__popular__body">
                                        <div className="about__more__popular__body__header">
                                            <h3>{item.title}</h3>
                                        </div>
                                        <span>{GetTime(item.createdAt)}</span>
                                    </div>
                                    </Link>
                                ))
                                }
                            </div>
                        </div>

                        {/* <div className="about__more__facebook">
                            <div className="about__sidebar__title">
                                <span>follow me</span>
                            </div>
                            <FacebookProvider appId="107366247005618">
                                <Like 
                                    href="https://www.facebook.com/tea.live.167/" 
                                    width="300" 
                                    height="300" 
                                    target="_top"
                                    data-hide-cover={false}

                                    // showFaces 
                                    // share 
                                    />
                            </FacebookProvider>
                        </div> */}
                    </div>

                    <div className="about__mail">
                        <div className="about__mail__box">
                            <h2>Nhận thông báo về bài viết mới nhất qua gmail</h2>
                            <form className="about__mail__input">
                                <input type="text" placeholder="Email address" /><br/>
                                <button>Submit</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </Helmet>
  )
}

export default About
