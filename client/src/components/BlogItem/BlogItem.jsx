import React, { useRef, useState, useEffect } from "react";
import "./BlogItem.scss";
import GetTime from "../../utils/GetTime";
import { useDispatch, useSelector } from "react-redux";
import { createAxios } from "../../createInstance";
import { loginSuccess } from "../../redux/authSlice";
import { getUserPost } from "../../redux/apiRequest";
import { useNavigate } from "react-router-dom";
import male from "../../assets/img/male.png";
import female from "../../assets/img/female.png";
import { getUsers } from "../../redux/apiRequest";

import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import Chip from "../utils/Chip/Chip";

const BlogItem = ({ post }) => {
  const content = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth.login?.currentUser);
  let axiosJWT = createAxios(post.user, dispatch, loginSuccess);

  // GET USER
  const handleGetUser = async () => {
    await getUsers(post.user._id, post.user.accessToken, dispatch);
    navigate(`/infor/${post.user._id}`);
  };
  const handleGetPost = async () => {
    await getUserPost(dispatch,post._id);
    navigate(`/post/${post.slug}`);
  };
  useEffect(() => {
    let domParser = new DOMParser();
    let doc = domParser.parseFromString(post.content, "text/html");
    doc.body.childNodes.forEach((node) => {
      content.current.appendChild(node.cloneNode(true));
    });
  }, []);

  return (
    <div className="blogitem">
      <div className="blogitem__container">
        <div className="blogitem__header">
          <div onClick={handleGetUser} className="blogitem__header__user">
            <img
              src={
                post.user.image
                  ? post.user.image
                  : post.user.sex === "male"
                  ? male
                  : female
              }
              alt=""
            />
            <span>{post.user.username}</span>
          </div>
          <div className="blogitem__header__icon">
            <RemoveRedEyeOutlinedIcon
              className="blogitem__header__icon__view"
              sx={{ fontSize: 25 }}
              fontSize="large"
            />
            <span>{post.view}</span>
          </div>
        </div>

        <div onClick={handleGetPost} className="blogitem__content">
          <div className="blogitem__content__text">
            <div className="blogitem__content__text__title">
              <h1>{post.title}</h1>
            </div>

            <div
              ref={content}
              className="blogitem__content__text__detail"
            ></div>
          </div>
        </div>

        <div className="blogitem__category">
          {post.category.map((item, index) => (
            <Chip
              key={index}
              className="blogitem__category__item"
              text={item}
              field={post.fields}
            />
          ))}
        </div>

        <div className="blogitem__time">
          <span style={{ userSelect: "none" }}>{GetTime(post.createdAt)}</span>
        </div>
      </div>

      <div
        className="blogitem__thumbnail"
        style={
          post.imgPost
            ? { backgroundImage: `url(${post.imgPost})` }
            : { display: "none" }
        }
      >
        <div className="overlay"></div>
        <div
          className="blogitem__thumbnail__detail category"
          onClick={handleGetPost}
        >
          <span>Chi tiết</span>
        </div>
      </div>
    </div>
  );
};

export default BlogItem;
