import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name:"user",
    initialState: {
        users: {
            isFetching: false,
            error: false
        },
    },
    reducers: {
        // UPDATE USER
        updateUserStart: (state) => {
            state.users.isFetching = true;
        },
        updateUserSuccess: (state) => {
            state.users.isFetching = false;
            state.users.error = false;
        },
        updateUserFailed: (state) => {
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
    updateUserStart,
    updateUserSuccess,
    updateUserFailed,
    deleteUserStart,
    deleteUserSuccess,
    deleteUserFailed,
   
} = userSlice.actions;

export default userSlice.reducer;