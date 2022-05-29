import React, { useEffect, useState } from "react";
import "./Blog.scss";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import Helmet from "../../components/Helmet/Helmet";
import Navbar from "../../components/Navbar/Navbar";
import BlogItem from "../../components/BlogItem/BlogItem";
import PaginationType from "../../components/Pagination/Pagination";
import Sidebar from "../../components/Sidebar/Sidebar";
import { getAllPost } from "../../redux/apiRequest";

const Blog = ({ fields }) => {
  const search = useLocation().search;
  const query = new URLSearchParams(search);
  const category = query.get("category");
  const [currentPage, setCurrentPage] = useState(1);
  const allPost = useSelector((state) => state.post.post.AllPost);
  const pageNumber =
    allPost.totalPost % 4 === 0
      ? Math.floor(allPost.totalPost / 4)
      : Math.floor(allPost.totalPost / 4) + 1;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    if (category) {
      getAllPost(dispatch, navigate, currentPage, fields, category);
    } else {
      getAllPost(dispatch, navigate, currentPage, fields, null);
    }
  }, []);
  const HandleSetPage = async (e, value) => {
    if (category) {
      await getAllPost(dispatch, navigate, value, fields, category);
    } else {
      await getAllPost(dispatch, navigate, value, fields, null);
    }
    setCurrentPage(value);
  };
  return (
    <Helmet title="Blog">
      <main className="blog">
        <Navbar />
        <div className="blog__container">
          <div className="blog__title">
            {category ? <span>category : {category}</span> : <span>{fields}</span>}
          </div>
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
                type={fields}
                page="pagePost"
                func={HandleSetPage}
                numb={pageNumber}
                variant="outlined"
                shape="rounded"
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
