import React, { useEffect, useState } from "react";
import "./Blog.scss";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation,useParams } from "react-router-dom";
import Helmet from "../../components/Helmet/Helmet";
import Navbar from "../../components/Navbar/Navbar";
import BlogItem from "../../components/BlogItem/BlogItem";
import PaginationType from "../../components/Pagination/Pagination";
import Sidebar from "../../components/Sidebar/Sidebar";
import { getAllPost } from "../../redux/apiRequest";


const Blog = ({ fields }) => {
  const location = useLocation();
  const pathname = location.pathname;
  const query = new URLSearchParams(location.search);
  const currentPage = query.get("pagePost");
  const category = query.get("category");
  const allPost = useSelector((state) => state.post.post.AllPost);

  const pageNumber =
    allPost.totalPost % 4 === 0
      ? Math.floor(allPost.totalPost / 4)
      : Math.floor(allPost.totalPost / 4) + 1;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (category) {
      getAllPost(dispatch, currentPage ? currentPage : 1, fields, category);
    } else {
      getAllPost(dispatch, currentPage ? currentPage : 1, fields, null);
    }
  }, [pathname,category]);
  
  const HandleSetPage = async (e, value) => {
    if(category) {
      navigate(`/${fields}?category=${category}${value === 1 ? '' : `&pagePost=${value}`}`)
    } else {
      navigate(`/${fields}${value === 1 ? '' : `?pagePost=${value}`}`)
    }
  };
  return (
    <Helmet title="Blog">
      <main className="blog">
        <Navbar />
        <div className="blog__container">
          <div className="blog__title">
            {category ? <span>category : {category}</span> : <span>{fields}</span>}
          </div>
          {console.log("allPost: ",allPost)}
          <div className="blog__content">
            <div className="blog__content__list">
              {allPost.post.length > 0 ? (
                allPost.post.map((post, index) => (
                  <BlogItem key={index} post={post} field={fields} />
                ))
              ) : (
                <span>Chưa có bài viết nào</span>
              )}
            </div>
            {allPost.post.length > 0 && (
              <PaginationType
                defaultPage={currentPage ? parseInt(currentPage) : 1}
                func={HandleSetPage} 
                numb={pageNumber}
              />  
            )}
          </div>
        </div>
        <Sidebar type={fields} />
      </main>
    </Helmet>
  );
};

export default Blog;
