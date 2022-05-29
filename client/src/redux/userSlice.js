import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name:"user",
    initialState: {
        users: {
            user: null,
            isFetching: false,
            error: false
        },
    },
    reducers: {
        // GET USER
        getUsersStart: (state) => {
            state.users.isFetching = true;
        },
        getUsersSuccess: (state,action) => {
            state.users.isFetching = false;
            state.users.user = action.payload;
        },
        getUsersFailed: (state) => {
            state.users.isFetching = false;
            state.users.error = true;
        },

        // DELETE USER
        deleteUserStart: (state) => {
            state.users.isFetching = true;
        },
        deleteUserSuccess: (state) => {
            state.users.isFetching = false;
        },
        deleteUserFailed: (state) => {
            state.users.isFetching = false;
            state.users.error = true;
        },

        
    }
})


export const {
    getUsersStart,
    getUsersSuccess,
    getUsersFailed,
    deleteUserStart,
    deleteUserSuccess,
    deleteUserFailed,
   
} = userSlice.actions;

export default userSlice.reducer;