import React, { useRef, useState, useEffect } from "react";
import "./BlogItem.scss";
import GetTime from "../../utils/GetTime";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import male from "../../assets/img/male.png";
import female from "../../assets/img/female.png";

import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import {yellow} from "@mui/material/colors";
import Chip from "../utils/Chip/Chip";
import { Avatar } from "@mui/material";

const BlogItem = ({ post }) => {
  const content = useRef(null);
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth.login?.currentUser);

  // GET USER
  const handleGetUser = async () => {
    navigate(`/infor/${post.user._id}`,{state: post.user_id});
  };
  const handleGetPost = () => {
    navigate(`/post/${post.slug}`,{state: post._id});
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
      <div
        className="blogitem__thumbnail"
        onClick={handleGetPost}
        style={
          post.imgPost
            ? { backgroundImage: `url(${post.imgPost})` }
            : { display: "none" }
        }
      >
      </div>

      <div className="blogitem__container">
        <div className="blogitem__header">
          <div onClick={handleGetUser} className="blogitem__header__user">
            <Avatar
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
              sx={{ fontSize: 25,color: yellow[800] }}
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
    </div>
  );
};

export default BlogItem;
