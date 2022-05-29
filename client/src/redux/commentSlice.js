import { createSlice } from "@reduxjs/toolkit";

const commentSlice = createSlice({
    name:"comment",
    initialState: {
        commentpost: {
            commentOfPost:[],
            replyComment:null,
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

// <-------- (COMMENT) -------->

        // CREATE COMMENT
        createCommentStart: (state) => {
            state.commentpost.isFetching = true;
        },
        createCommentSuccess: (state,action) => {
            state.commentpost.isFetching = false;
            state.commentpost.commentOfPost = action.payload;
            state.msg.comment = "";
            state.commentpost.error = false;
        },
        createCommentFailed: (state,action) => {
            state.commentpost.isFetching = false;
            state.msg.comment = action.payload.response.data.errors.comment?.message;
            state.commentpost.error = true;
        },

        // DELETE COMMENT
        deleteCommentStart: (state) => {
            state.commentpost.isFetching = true;
        },
        deleteCommentSuccess: (state,action) => {
            state.commentpost.isFetching = false;
            state.commentpost.commentOfPost = action.payload;
            state.commentpost.error = false;
        },
        deleteCommentFailed: (state) => {
            state.commentpost.isFetching = false;
            state.commentpost.error = true;
        },

        // GET COMMENT
        getCommentStart: (state) => {
            state.commentpost.isFetching = true;
        },
        getCommentSuccess: (state,action) => {
            state.commentpost.isFetching = false;
            state.commentpost.commentOfPost = action.payload;
            state.commentpost.replyComment = null;
            state.commentpost.error = false;
        },
        getCommentFailed: (state) => {
            state.commentpost.isFetching = false;
            state.commentpost.error = true;
        },

         // GET REPLY COMMENT
        getReplyCommentStart: (state) => {
            state.commentpost.isFetching = true;
        },
        getReplyCommentSuccess: (state,action) => {
            state.commentpost.isFetching = false;
            state.commentpost.replyComment = action.payload;
            state.commentpost.error = false;
        },
        getReplyCommentFailed: (state) => {
            state.commentpost.isFetching = false;
            state.commentpost.error = true;
        },

        // INTER OF COMMENT
        interCommentStart: (state) => {
            state.commentpost.isFetching = true;
        },
        interCommentSuccess: (state,action) => {
            state.commentpost.isFetching = false;
            state.commentpost.commentOfPost = action.payload;
            // state.msg.comment = "";
            state.commentpost.error = false;
        },
        interCommentFailed: (state,action) => {
            state.commentpost.isFetching = false;
            // state.msg.comment = action.payload.response.data.errors.comment?.message;
            state.commentpost.error = true;
        },

    }
})


export const {
    createCommentStart,
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
} = commentSlice.actions;

export default commentSlice.reducer;