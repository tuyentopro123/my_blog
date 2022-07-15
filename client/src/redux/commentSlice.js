import { createSlice } from "@reduxjs/toolkit";

const commentSlice = createSlice({
    name:"comment",
    initialState: {
        commentpost: {
            commentOfPost:null,
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
        createCommentSuccess: (state) => {
            state.commentpost.isFetching = false;
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

         // GET REPLY COMMENT
        getReplyCommentNoti: (state,action) => {
            state.commentpost.replyComment = action.payload;
        },

        setReplyCommentNoti: (state,action) => {
            state.commentpost.replyComment = null;
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
        interCommentFailed: (state) => {
            state.commentpost.isFetching = false;
            state.commentpost.error = true;
        },


        resetCommentOfPost: (state) => {
            state.commentpost.commentOfPost = null;
        }

    }
})


export const {
    createCommentStart,
    createCommentSuccess,
    createCommentFailed,
    interCommentStart,
    interCommentSuccess,
    interCommentFailed,
    getReplyCommentNoti,
    setReplyCommentNoti,
    deleteCommentStart,
    deleteCommentSuccess,
    deleteCommentFailed,
    getCommentStart,
    getCommentSuccess,
    getCommentFailed,
    resetCommentOfPost
} = commentSlice.actions;

export default commentSlice.reducer;