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
    export const loginUser = async(dispatch) => {
      dispatch(loginStart())
      try {
          const res = await axios.get("/v1/auth/login")
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
        await axios.post("v1/auth/register", user);
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
        await axios.get("http://localhost:3000/v1/auth/logout");
        dispatch(logOutSuccess());
        navigate("/");
      } catch (err) {
        dispatch(logOutFailed());
      }
    };  

    


// <-- ( USER ) ----------------------------->

    // UPDATE USER
    export const updateUsers = async (user, dispatch,id) => {
      dispatch(updateUserStart());
      try {
        const res = await axios.put(`/v1/auth/` + id, user);
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
        const res = await axios.get("http://localhost:3000/v1/user/noti/" + id);
        dispatch(getNotificationSuccess(res.data));
      } catch (err) {
        dispatch(getNotificationFailed(err));
      }
    };  


    // DELETE USER  
    //   export const deleteUser = async ( dispatch, id,  => {
    //     dispatch(deleteUserStart());
    //     try {
    //       const res = await axios.delete("/v1/user/" + id, {
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
        const res = await axios.post(`/v1/post/post/` + id, post );
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
          const res = await axios.get(`/v1/post/${field}?category=${category}&pagePost=${currentPagePost}`);
          dispatch(getAllPostSuccess(res.data));
        } else {
          const res = await axios.get(`/v1/post/${field}?pagePost=${currentPagePost}`);
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
        const res = await axios.post("/v1/post/update/" + id,user);
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
        const res = await axios.post("/v1/comment/comment",comment);
        dispatch(createCommentSuccess(res.data));
      } catch (err) {
        dispatch(createCommentFailed(err));
      }
    };

    // GET COMMENT
    export const getComment = async (id,dispatch) => {
      dispatch(getCommentStart());
      try {
        const res = await axios.get("/v1/comment/comment/" + id);
        dispatch(getCommentSuccess(res.data));
        dispatch(resetFirstLoading())
      } catch (err) {
        dispatch(getCommentFailed(err));
      }
    };

    // DELETE COMMENT
    export const deleteComment = async (id,comment,dispatch) => {
      dispatch(deleteCommentStart());
      try {
        const res = await axios.post("/v1/comment/" + id,comment);
        dispatch(deleteCommentSuccess(res.data));
      } catch (err) {
        dispatch(deleteCommentFailed(err));
      }
    };

    // INTER OF COMMENT
    export const interComment = async (inter,id,dispatch) => {
      dispatch(interCommentStart());
      try {
        const res = await axios.post("/v1/comment/inter/" + id,inter);
        dispatch(interCommentSuccess(res.data));
      } catch (err) {
        dispatch(interCommentFailed(err));
      }
    };

    // GET REPLY OF COMMENT
    export const getReplyComment = async (id,dispatch) => {
      dispatch(getReplyCommentStart());
      try {
        const res = await axios.get("/v1/comment/reply/" + id);
        dispatch(getReplyCommentSuccess(res.data));
      } catch (err) {
        dispatch(getReplyCommentFailed(err));
      }
    };