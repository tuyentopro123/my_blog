import { createSlice } from "@reduxjs/toolkit";

const postSlice = createSlice({
    name:"post",
    initialState: {
        post: {
            AllPost: null,
            currentPost: null,
            firstLoading:true,
            isFetching: false,
            error: false,
        },
        isFetching: false,
        commentpost: {
            commentOfPost:null,
            ReplyComment:null,
            isFetching: false,
            error: false,
        },
        msg:{
            content:"",
            title:"",
        },
    },
    reducers: {
// <-------- (POST) -------->
        // CREATE POST
        createPostStart: (state) => {
            state.post.isFetching = true;
            state.post.error = false;
        },
        createPostSuccess: (state,action) => {
            state.post.isFetching = false;
            state.msg= "success";
            state.post.error = false;
        },
        createPostFailed: (state,action) => {
            state.post.isFetching = false;
            state.msg = "error";
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

        // UPDATE POST
        updateLikeStart: (state) => {
            state.isFetching = true;
        },
        updateLikeSuccess: (state,action) => {
            state.isFetching = false;
            state.post.userPost = action.payload;
            state.post.error = false;
        },
        updateLikeFailed: (state) => {
            state.isFetching = false;
            state.post.error = true;
        },

        // FirstLoading
        startFirstLoading: (state) => {
            state.post.firstLoading = true;
            state.post.isFetching = true;
        },
        resetFirstLoading: (state) => {
            state.post.firstLoading = false;
        },
        FinishLoading: (state) => {
            state.post.isFetching = false;
        },

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
    getAllPostStart,
    getAllPostSuccess,
    getAllPostFailed,
    resetFirstLoading,
    FinishLoading,
    startFirstLoading
} = postSlice.actions;

export default postSlice.reducer;