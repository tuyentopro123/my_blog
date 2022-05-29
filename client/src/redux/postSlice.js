import { createSlice } from "@reduxjs/toolkit";

const postSlice = createSlice({
    name:"post",
    initialState: {
        post: {
            Post: null,
            AllPost: null,
            currentPost: null,
            userPost:null,
            firstLoading:true,
            relatedPost: null,
            isFetching: false,
            error: false,
        },
        commentpost: {
            commentOfPost:null,
            ReplyComment:null,
            isFetching: false,
            error: false,
        },
        msg:{
            success: "",
            content:"",
            title:"",
            comment:""
        },
    },
    reducers: {
// <-------- (POST) -------->
        // CREATE POST
        createPostStart: (state) => {
            state.post.isFetching = true;
        },
        createPostSuccess: (state,action) => {
            state.post.isFetching = false;
            state.post.Post = action.payload;
            state.msg.content = "";
            state.msg.title = "";
            state.post.error = false;
        },
        createPostFailed: (state,action) => {
            state.post.isFetching = false;
            state.msg.content = action.payload.response.data.errors.content?.message;
            state.msg.title = action.payload.response.data.errors.title?.message;
            state.post.error = true;

        },

        // GET ALL POST
        getAllPostStart: (state) => {
            state.post.isFetching = true;
        },
        getAllPostSuccess: (state,action) => {
            state.post.isFetching = false;
            state.post.AllPost = action.payload;
            state.post.error = false;
        },
        getAllPostFailed: (state) => {
            state.post.isFetching = false;
            state.post.error = true;
        },

        // GET USER POST
        getUserPostStart: (state) => {
            state.post.isFetching = true;
        },
        getUserPostSuccess: (state,action) => {
            state.post.isFetching = false;
            state.post.firstLoading = true;
            state.post.userPost = action.payload.userPost;
            state.post.relatedPost = action.payload.relatedPost;
            state.post.error = false;
        },
        getUserPostFailed: (state) => {
            state.post.isFetching = false;
            state.post.error = true;
        },

        // UPDATE POST
        updateLikeStart: (state) => {
            state.post.isFetching = true;
        },
        updateLikeSuccess: (state,action) => {
            state.post.isFetching = false;
            state.post.userPost = action.payload;
            state.post.error = false;
        },
        updateLikeFailed: (state) => {
            state.post.isFetching = false;
            state.post.error = true;
        },

        // FirstLoading
        resetFirstLoading: (state) => {
            state.post.firstLoading = false;
        }

    }
})


export const {
    createPostStart,
    createPostSuccess,
    createPostFailed,
    getPostStart,
    getPostSuccess,
    getPostFailed,
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
} = postSlice.actions;

export default postSlice.reducer;