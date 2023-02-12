import {publicRequest} from "../utils/configAxios";
import axios from "axios"
import {loginStart,
        loginSuccess,
        loginFailed,
        registerStart,
        registerSuccess,
        registerFailed,
        logOutStart,
        logOutSuccess,
        logOutFailed,
        getNotificationStart,
        getNotificationSuccess,
        getNotificationFailed,
        getCurrentUserStart,
        getCurrentUserSuccess,
        getCurrentUserFailed
      } from "./authSlice"
      
import {getUsersStart,
        getUsersSuccess,
        getUsersFailed,
        updateUserStart,
        updateUserSuccess,
        updateUserFailed,
        deleteUserStart,
        deleteUserSuccess,
        deleteUserFailed,
} from "./userSlice"

import {createPostStart,
        createPostSuccess,
        createPostFailed,
        updateLikeStart,
        updateLikeSuccess,
        updateLikeFailed,
        getAllPostStart,
        getAllPostSuccess,
        getAllPostFailed,
        resetFirstLoading
} from "./postSlice"

import {createCommentStart,
        createCommentSuccess,
        createCommentFailed,
        interCommentStart,
        interCommentSuccess,
        interCommentFailed,
        getReplyCommentStart,
        getReplyCommentSuccess,
        getReplyCommentFailed,
        deleteCommentStart,
        deleteCommentSuccess,
        deleteCommentFailed,
} from "./commentSlice"


// <-- ( AUTH ) ----------------------------->
    // LOGIN
    export const loginUser = async(dispatch) => {
      dispatch(loginStart())
      try {
          const res = await publicRequest.get("/v1/auth/login",{withCredentials:true})
          dispatch(loginSuccess(res.data));
          // navigate("/");
        }catch(err) {
          dispatch(loginFailed(err))
      }
    };
    //  REGISTER
    export const registerUser = async (user, dispatch, navigate) => {
      dispatch(registerStart());
      try {
        await publicRequest.post("v1/auth/register", user);
        dispatch(registerSuccess());
        navigate("/login");
      } catch (err) {
        dispatch(registerFailed(err));
      }
    };
    // LOGOUT
    export const logOut = async (dispatch,navigate) => {
      dispatch(logOutStart());
      try {
        await publicRequest.get("/v1/auth/logout",{withCredentials:true});
        dispatch(logOutSuccess());
        navigate("/");
      } catch (err) {
        dispatch(logOutFailed());
      }
    };  

    // GET CURRENT USER
    export const getCurrentUser = async (dispatch,id) => {
      dispatch(getCurrentUserStart());
      try {
        await publicRequest.get("/v1/auth/current/" + id);
        dispatch(getCurrentUserSuccess());
      } catch (err) {
        dispatch(getCurrentUserFailed());
      }
    };  
    


// <-- ( USER ) ----------------------------->

    // UPDATE USER
    export const updateUsers = async (user, dispatch,id) => {
      dispatch(updateUserStart());
      try {
        const res = await publicRequest.put(`/v1/user/` + id, user);
        dispatch(updateUserSuccess(res.data));
      } catch (err) {
        console.log(err)
        dispatch(updateUserFailed(err));
      }
    };

    // NOTIFICATION
    export const getNotification = async(dispatch, id)  => {
      dispatch(getNotificationStart());
      try {
        const res = await publicRequest.get("/v1/user/noti/" + id);
        dispatch(getNotificationSuccess(res.data));
      } catch (err) {
        dispatch(getNotificationFailed(err));
      }
    };  


    // DELETE USER  
    //   export const deleteUser = async ( dispatch, id,  => {
    //     dispatch(deleteUserStart());
    //     try {
    //       const res = await publicRequest.delete("/v1/user/" + id, {
    //         headers: { token: `Bearer ${accessToken` },
    //       });
    //       dispatch(deleteUsersSuccess(res.data));
    //     } catch (err) {
    //       dispatch(deleteUserFailed(err.response.data));
    //     }
    //   };
        

// <-- ( POST ) ----------------------------->
    // CREATE POST
    export const createPost = async (post,id, dispatch, navigate) => {
      dispatch(createPostStart());
      try {
        const res = await publicRequest.post(`/v1/post/post/` + id, post );
        dispatch(createPostSuccess(res.data));
        const navigation = () => {
          navigate(`/`)
        }
        setTimeout(navigation,1600)
      } catch (err) {
        dispatch(createPostFailed(err));
      }
    };

    // GET ALL POST
    export const getAllPost = async (dispatch,currentPagePost,field,category) => {
      dispatch(getAllPostStart());
      try {
        if(category) {
          const res = await publicRequest.get(`/v1/post/${field}?category=${category}&pagePost=${currentPagePost}`);
          dispatch(getAllPostSuccess(res.data));
        } else {
          const res = await publicRequest.get(`/v1/post/${field}?pagePost=${currentPagePost}`);
          dispatch(getAllPostSuccess(res.data));
        }
      } catch (err) {
        dispatch(getAllPostFailed());
      }
    };

    // UPDATE POST
    export const updatePost = async (user,id,dispatch) => {
      dispatch(updateLikeStart());
      try {
        const res = await publicRequest.post("/v1/post/update/" + id,user);
        dispatch(updateLikeSuccess(res.data));
      } catch (err) {
        dispatch(updateLikeFailed());
      }
    };

// <-- ( COMMENT ) ----------------------------->

    // CREATE COMMENT
    export const createComment = async (comment,dispatch) => {
      dispatch(createCommentStart());
      try {
        const res = await publicRequest.post("/v1/comment/comment",comment);
        dispatch(createCommentSuccess(res.data));
      } catch (err) {
        dispatch(createCommentFailed(err));
      }
    };


    // DELETE COMMENT
    export const deleteComment = async (id,comment,dispatch) => {
      dispatch(deleteCommentStart());
      try {
        const res = await publicRequest.post("/v1/comment/" + id,comment);
        dispatch(deleteCommentSuccess(res.data));
      } catch (err) {
        dispatch(deleteCommentFailed(err));
      }
    };

    // INTER OF COMMENT
    export const interComment = async (inter,id,dispatch) => {
      dispatch(interCommentStart());
      try {
        const res = await publicRequest.post("/v1/comment/inter/" + id,inter);
        dispatch(interCommentSuccess(res.data));
      } catch (err) {
        dispatch(interCommentFailed(err));
      }
    };