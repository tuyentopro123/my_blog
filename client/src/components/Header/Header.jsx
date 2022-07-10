import React, { useRef, useEffect, useState } from "react";
import "./Header.scss";
import { logOut } from "../../redux/apiRequest";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import SearchIcon from "@mui/icons-material/Search";
import logo from "../../assets/img/logo.png";
import male from "../../assets/img/male.png";
import female from "../../assets/img/female.png";
import CreateSlug from "../utils/CreateSlug/CreateSlug";
import { getNotification } from "../../redux/apiRequest";
import axios from "axios";

// Material ui
import { Tooltip } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Badge from "@mui/material/Badge";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { grey } from "@mui/material/colors";
import { styled } from "@mui/material/styles";


// Tippy
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/shift-away-extreme.css";

// icon
import HomeIcon from "@mui/icons-material/Home";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import LogoutIcon from "@mui/icons-material/Logout";
import Notification from "../Notification/Notification";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: 0,
    top: 3,
    fontSize: 12,
    backgroundColor: "#e41e3f",
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
  },
}));



const Header = ({ socket }) => {
  const user = useSelector((state) => state.auth.login?.currentUser);
  const notificationUser = useSelector(
    (state) => state.auth.login?.notification
  );
  const [loading, setLoading] = useState(false);
  // SOCKET IO
  const [notification, setNotification] = useState([]);

  useEffect(() => {
    socket?.on("getNotification", (data) => {
      setNotification((prev) => [...prev, data]);
    });
  }, [socket]);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = () => {
    logOut(dispatch, navigate);
  };

  const edit = useRef(null);
  const handleClick = () => {
    edit.current.classList.toggle("active");
  };

  useEffect(() => {
    setNotification(notificationUser)
  }, [notificationUser]);

  // GET NOTIFICATION
  const handleGetNotification = async (e) => {
    setLoading(true);
    await getNotification(dispatch, user._id);
    setLoading(false);
  };

  


  // GET USER
  const handleGetUser = () => {
    navigate(`/infor/${user._id}`,{state: user._id});
  };

  // GET POST USER
  const input = useRef(null);
  const listResult = useRef(null);
  const handleGetPost = async (item) => {
    input.current.value = "";
    listResult.current.classList.remove("active");
    navigate(`/post/${item.slug}`, { state: item._id });
  };
  // Header Search
  const useDebounce = (value, delay) => {
    const [debounceValue, setDebounceValue] = useState(value);
    useEffect(() => {
      const handler = setTimeout(() => {
        setDebounceValue(value);
      }, delay);
      return () => {
        clearTimeout(handler);
      };
    }, [value, delay]);
    return debounceValue;
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [result, setResult] = useState([]);
  const debounceSearchTerm = useDebounce(searchTerm, 200);
  useEffect(() => {
    let controller = new AbortController();
    if (debounceSearchTerm) {
      const searchItem = async () => {
        try {
          const res = await axios.get(
            `/v1/post/path/result?searchQuery=${CreateSlug(debounceSearchTerm)}`
          );
          setResult(res.data);
          controller = null;
        } catch (err) {
          console.log(err);
        }
      };
      searchItem();
    } else {
      setResult([]);
    }
    return () => controller?.abort();
  }, [debounceSearchTerm]);

  const handleFocus = () => {
    document.getElementById("search").style.border = "solid rgb(3 3 3) 2px";
  };

  const handleBlur = () => {
    document.getElementById("search").style.border =
      "solid rgb(151, 151, 151) 2px";
  };

  // Material ui

  const [state, setState] = useState(false);
  const handleCloseMenu = () => {
    edit.current.classList.remove("active");
  };

  const handleCloseMenuMobile = () => {
    setState(false);
  };

  const toggleDrawer = (open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState(open);
  };

  return (
    <div className="header">
      <div className="header__logo">
        <Link to="/" className="header__logo__img">
          <img className="" src={logo} />
        </Link>
      </div>

      <div className="header__body">
        <div id="search" className="header__body__search">
          <div className="search">
            <SearchIcon fontSize="large" />
          </div>
          <input
            type="text"
            ref={input}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Bạn đang tìm kiếm điều gì"
          />
        </div>

        <div
          ref={listResult}
          className={`header__body__result ${
            searchTerm !== "" ? "active" : " "
          }`}
        >
          <ul>
            {result.length > 0 ? (
              result.map((item, key) => (
                <li key={key}>
                  <div
                    className="header__body__result__item"
                    onClick={() => handleGetPost(item)}
                  >
                    <h2>{item.title}</h2>
                    <div
                      className="header__body__result__item__img"
                      style={{ backgroundImage: `url(${item.imgPost})` }}
                    ></div>
                  </div>
                </li>
              ))
            ) : (
              <li>{`Không có kết quả cho "${debounceSearchTerm}"`}</li>
            )}
          </ul>
        </div>
      </div>

      <div className="header__actions">
        
        <span> {user ? `Hi, ${user.username}` : ""} </span>

        <Tippy
          arrow={false}
          interactive={true}
          theme="noti"
          trigger="click"
          animation="shift-away-extreme"
          duration={[150, 0]}
          content={
              <Notification data={notification}/>
          }
        >
          <div className="header__notification" onClick={(e) => handleGetNotification(e)}>
            <IconButton size="small">
              <StyledBadge badgeContent={user?.notification_count} color="error">
                <div
                  className={`header__notification__icon ${
                    user?.notification_count > 0 && "active"
                  }`}
                >
                  <NotificationsIcon sx={{ fontSize: 25, color: grey[700] }} />
                </div>
              </StyledBadge>
            </IconButton>
          </div>
        </Tippy>
            
        <div className="header__account">
          {user ?
            <div className="header__account__container">
              <IconButton size="small" onClick={handleClick}>
                <Avatar
                  sx={{ width: 32, height: 32 }}
                  src={
                    user.image ? user.image : user.sex === "male" ? male : female
                  }
                />
              </IconButton>
              <div ref={edit} className="header__account__edit">
                <div className="header__account__body">
                  <Link
                    to={`/infor/${user._id}`}
                    state={user._id}
                    className="header__account__info"
                  >
                    <Avatar
                      sx={{ width: 80, height: 80 }}
                      src={
                        user.image
                          ? user.image
                          : user.sex === "male"
                          ? male
                          : female
                      }
                      alt=""
                    />
                    <h3>{user.username}</h3>
                    <span>{user.email}</span>
                  </Link>
                  <ul>
                    <li onClick={handleCloseMenu}>
                      <Link to="/">Trang chủ</Link>
                    </li>
                    <li onClick={handleCloseMenu}>
                      <div onClick={handleGetUser} style={{ cursor: "pointer" }}>
                        Thông tin cá nhân
                      </div>
                    </li>
                    <li onClick={handleCloseMenu}>
                      <Link to="/logout" onClick={handleLogout}>
                        LOGOUT
                      </Link>
                    </li>
                  </ul>
                </div>

                <React.Fragment key="right">
                  <SwipeableDrawer
                    anchor="right"
                    open={state}
                    onClose={toggleDrawer(false)}
                    onOpen={toggleDrawer(true)}
                  >
                    <div className="mobile-menu">
                      <Link
                        to={`/infor/${user._id}`}
                        state={user}
                        className="mobile-menu__infor"
                      >
                        <Avatar
                          sx={{
                            width: 120,
                            height: 120,
                            border: ".2rem solid #000",
                          }}
                          src={
                            user.image
                              ? user.image
                              : user.sex === "male"
                              ? male
                              : female
                          }
                        />
                        <h3>{user.username}</h3>
                        <span>{user.email}</span>
                      </Link>
                      <ul>
                        <li onClick={handleCloseMenuMobile}>
                          <HomeIcon sx={{ fontSize: 30 }} />
                          <Link to="/">Trang chủ</Link>
                        </li>
                        <li onClick={handleCloseMenuMobile}>
                          <PermIdentityIcon sx={{ fontSize: 30 }} />
                          <div
                            onClick={handleGetUser}
                            style={{ cursor: "pointer" }}
                          >
                            Thông tin cá nhân
                          </div>
                        </li>
                        <li onClick={handleCloseMenuMobile}>
                          <SearchIcon sx={{ fontSize: 30 }} />
                          <Link to="/">Tìm kiếm</Link>
                        </li>
                        <li>
                          <LogoutIcon sx={{ fontSize: 30 }} />
                          <Link to="/logout" onClick={handleLogout}>
                            LOGOUT
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </SwipeableDrawer>
                </React.Fragment>
              </div>
            </div>
            :
            <div className="header__account__login" >
               <Link
                    to={`/login`}
                  >
                <button>Đăng nhập</button>
              </Link>
            </div>

          }
        </div>
      </div>
    </div>
  );
};

export default Header;
