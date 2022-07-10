import React from 'react'
import "./RelatedPost.scss"
import Chip from '../utils/Chip/Chip';
import GetTime from '../../utils/GetTime';
import { useDispatch,useSelector } from "react-redux";
import {Link} from 'react-router-dom'

const RelatedPost = ({post}) => {
    const currentUser = useSelector((state)=> state.auth.login?.currentUser)
  return (
    <Link className="related" to={`/post/${post.slug}`} state={post._id}>
        <div className="related__container">
            <div className="related__thumbnail" style={{backgroundImage: `url(${post.imgPost})`}}></div>
            <div className="related__content">
                <div className="related__content__header">
                    <h1>{post.title}</h1>
                </div>

                <div className="related__content__category">
                    {post.category.map((item,index) => (
                      <Chip 
                          key={index} 
                          className="related__content__category__item" 
                          text={item}
                          field={post.fields}
                          />
                    ))}
                </div>

                <div className="related__content__author">
                    <p>
                        Đăng bởi 
                        <span> {post.user.username}</span>  
                        {"·"} 
                        <span style={{userSelect:"none"}}>{GetTime(post.createdAt)}</span>
                    </p>
                </div>
            </div>
        </div>
    </Link>
  )
}

export default RelatedPost