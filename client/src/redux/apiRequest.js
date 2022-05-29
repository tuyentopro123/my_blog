// import axios from "axios";
import axios from "axios";
import {loginStart,
        loginSuccess,
        loginFailed,
        registerStart,
        registerSuccess,
        registerFailed,
        logOutStart,
        logOutSuccess,
        logOutFailed,
        updateUserStart,
        updateUserSuccess,
        updateUserFailed,
        getCurrentUserStart,
        getCurrentUserSuccess,
        getCurrentUserFailed,
        getNotificationStart,
        getNotificationSuccess,
        getNotificationFailed
      } from "./authSlice"
      
import {getUsersStart,
        getUsersSuccess,
        getUsersFailed,
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
        getUserPostStart,
        getUserPostSuccess,
        getUserPostFailed,
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
        getCommentStart,
        getCommentSuccess,
        getCommentFailed,
} from "./commentSlice"


const options = {
  onUploadProgress: (ProgressEvent) => {
    const {loaded,total} = ProgressEvent;
    let percent = Math.floor((loaded * 100) / total)
    console.log(`${loaded} Kb of ${total}kb | ${percent}%`)
  }
}
// <-- ( AUTH ) ----------------------------->
    // LOGIN
    export const loginUser = async(user,dispatch,navigate) => {
      dispatch(loginStart())
      try {
          const res = await axios.post("v1/auth/login",user)
          dispatch(loginSuccess(res.data));
          navigate("/");
        }catch(err) {
          dispatch(loginFailed(err))
      }
    };
    //  REGISTER
    export const registerUser = async (user, dispatch, navigate) => {
      dispatch(registerStart());
      try {
        await axios.post("v1/auth/register", user);
        dispatch(registerSuccess());
        navigate("/login");
      } catch (err) {
        dispatch(registerFailed(err));
      }
    };
    // LOGOUT
    export const logOut = async (accessToken,dispatch, id, axiosJWT,navigate) => {
      dispatch(logOutStart());
      try {
        await axiosJWT.post("v1/auth/logout", id, {
          headers: { token: `Bearer ${accessToken}` },
        });
        dispatch(logOutSuccess());
        navigate("/login");
      } catch (err) {
        dispatch(logOutFailed());
      }
    };  

    //  GET CURRENT USER
    export const getCurrentUser = async (id, dispatch) => {
      dispatch(getCurrentUserStart());
      try {
        const res = await axios.get("v1/auth/current/" + id);
        dispatch(getCurrentUserSuccess(res.data));
      } catch (err) {
        dispatch(getCurrentUserFailed(err));
      }
    };

    


// <-- ( USER ) ----------------------------->

    // GET USER
    export const getUsers = async(id,accessToken,dispatch) => {
        dispatch(getUsersStart());
      try {
        const res = await axios.get(`/v1/user/` + id,{
          headers: { token: `Bearer ${accessToken}` },
        });
        dispatch(getUsersSuccess(res.data));
      } catch (err) {
        dispatch(getUsersFailed(err));
      }
    };

    // UPDATE USER
    export const updateUsers = async (user,accessToken, dispatch,id) => {
      dispatch(updateUserStart());
      try {
        const res = await axios.put(`/v1/auth/` + id, user,{
          headers: { token: `Bearer ${accessToken}` },
        });
        dispatch(updateUserSuccess(res.data));
      } catch (err) {
        console.log(err)
        dispatch(updateUserFailed(err));
      }
    };

    // NOTIFICATION
    export const getNotification = async(accessToken,dispatch, id, axiosJWT) => {
      dispatch(getNotificationStart());
      try {
        const res = await axiosJWT.get("v1/user/noti/" + id, {
          headers: { token: `Bearer ${accessToken}` },
        });
        dispatch(getNotificationSuccess(res.data));
      } catch (err) {
        dispatch(getNotificationFailed(err));
      }
    };  


    // DELETE USER  
    //   export const deleteUser = async (accessToken, dispatch, id, axiosJWT) => {
    //     dispatch(deleteUserStart());
    //     try {
    //       const res = await axiosJWT.delete("/v1/user/" + id, {
    //         headers: { token: `Bearer ${accessToken}` },
    //       });
    //       dispatch(deleteUsersSuccess(res.data));
    //     } catch (err) {
    //       dispatch(deleteUserFailed(err.response.data));
    //     }
    //   };
        

// <-- ( POST ) ----------------------------->
    // CREATE POST
    export const createPost = async (post,id,accessToken, dispatch, axiosJWT,navigate) => {
      dispatch(createPostStart());
      try {
        const res = await axiosJWT.post(`/v1/post/post/` + id, post ,{
          headers: { token: `Bearer ${accessToken}` },
        });
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
    export const getAllPost = async (dispatch,navigate,currentPagePost,field,category) => {
      dispatch(getAllPostStart());
      try {
        if(category) {
          const res = await axios.get(`/v1/post/${field}?category=${category}&pagePost=${currentPagePost}`);
          dispatch(getAllPostSuccess(res.data));
          navigate(`/${field}?category=${category}&pagePost=${currentPagePost}`)
        } else {
          const res = await axios.get(`/v1/post/${field}?pagePost=${currentPagePost}`);
          dispatch(getAllPostSuccess(res.data));
        }
      } catch (err) {
        dispatch(getAllPostFailed());
      }
    };

    // GET USER POST
    export const getUserPost = async (dispatch,id,user) => {
      dispatch(getUserPostStart());
      try {
        const res = await axios.get("/v1/post/" + id,user);
        dispatch(getUserPostSuccess(res.data));
      } catch (err) {
        dispatch(getUserPostFailed());
      }
    };

    // UPDATE POST
    export const updatePost = async (like,axiosJWT,id,accessToken,dispatch) => {
      dispatch(updateLikeStart());
      try {
        const res = await axiosJWT.post("/v1/post/update/" + id,like,{
          headers: { token: `Bearer ${accessToken}` },
        });
        dispatch(updateLikeSuccess(res.data));
      } catch (err) {
        dispatch(updateLikeFailed());
      }
    };

// <-- ( COMMENT ) ----------------------------->

    // CREATE COMMENT
    export const createComment = async (comment,axiosJWT,accessToken,dispatch) => {
      dispatch(createCommentStart());
      try {
        const res = await axiosJWT.post("/v1/comment/comment",comment,{
          headers: { token: `Bearer ${accessToken}` },
        });
        dispatch(createCommentSuccess(res.data));
      } catch (err) {
        dispatch(createCommentFailed(err));
      }
    };

    // GET COMMENT
    export const getComment = async (axiosJWT,id,accessToken,dispatch) => {
      dispatch(getCommentStart());
      try {
        const res = await axiosJWT.get("/v1/comment/comment/" + id,{
          headers: { token: `Bearer ${accessToken}` },
        });
        dispatch(getCommentSuccess(res.data));
        dispatch(resetFirstLoading())
      } catch (err) {
        dispatch(getCommentFailed(err));
      }
    };

    // DELETE COMMENT
    export const deleteComment = async (axiosJWT,id,comment,accessToken,dispatch) => {
      dispatch(deleteCommentStart());
      try {
        const res = await axiosJWT.post("/v1/comment/" + id,comment,{
          headers: { token: `Bearer ${accessToken}` },
        });
        dispatch(deleteCommentSuccess(res.data));
      } catch (err) {
        dispatch(deleteCommentFailed(err));
      }
    };

    // INTER OF COMMENT
    export const interComment = async (inter,axiosJWT,id,accessToken,dispatch) => {
      dispatch(interCommentStart());
      try {
        const res = await axiosJWT.post("/v1/comment/inter/" + id,inter,{
          headers: { token: `Bearer ${accessToken}` },
        });
        dispatch(interCommentSuccess(res.data));
      } catch (err) {
        dispatch(interCommentFailed(err));
      }
    };

    // GET REPLY OF COMMENT
    export const getReplyComment = async (axiosJWT,id,accessToken,dispatch) => {
      dispatch(getReplyCommentStart());
      try {
        const res = await axiosJWT.get("/v1/comment/reply/" + id,{
          headers: { token: `Bearer ${accessToken}` },
        });
        dispatch(getReplyCommentSuccess(res.data));
      } catch (err) {
        dispatch(getReplyCommentFailed(err));
      }
    };