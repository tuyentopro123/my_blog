import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name:"auth",
    initialState: {
        login: {
            currentUser: null,
            notification:[],
            redirectNoti:null,
            showNotification:false,
            error: false,
        },
        isFetching: false,
        register: {
            error: false,
            success: false
        },
        logout: {
            error: false,
        },
        msg:"",
    },
    reducers: {
        // LOGIN
        loginStart: (state) => {
            state.isFetching = true;
        },
        loginSuccess: (state,action) => {
            state.isFetching = false;
            state.login.currentUser = action.payload.user;
            state.login.notification = [];
            state.login.error = false;
            state.msg = action.payload;
        },
        loginFailed: (state,action) => {
            state.isFetching = false;
            state.login.error = true;
            state.msg = action.payload;
        },

        // REGISTER
        registerStart: (state) => {
            state.isFetching = true;
        },
        registerSuccess: (state) => {
            state.isFetching = false;
            state.register.success = true;
            state.register.error = false;
        },
        registerFailed: (state) => {
            state.isFetching = false;
            state.register.error = true;
            state.register.success = false;
        },



        // NOTIFICATION
        getNotificationStart: (state) => {
            state.isFetching = true;
        },
        getNotificationSuccess: (state,action) => {
            state.isFetching = false;
            state.login.currentUser.notification_count = 0;
            state.login.notification = action.payload;
        },
        getNotificationFailed: (state) => {
            state.isFetching = false;
            state.login.error = true;
        },

        // ACCESS NOTIFICATION
        redirectNotificationStart: (state,action) => {
            state.login.redirectNoti = action.payload;
            state.login.showNotification = true;
        },
        redirectNotificationFinish: (state) => {
            state.login.redirectNoti = null;
            state.login.showNotification = false;
        }, 

        // GET CURRENT USER
        getCurrentUserStart: (state) => {
            state.isFetching = true;
        },
        getCurrentUserSuccess: (state,action) => {
            state.isFetching = false;
            state.login.currentUser = action.payload;
        },
        getCurrentUserFailed: (state) => {
            state.isFetching = false;
            state.login.error = true;
        },
        
        // LOGOUT
        logOutStart: (state) => {
            state.isFetching = true;
        },
        logOutSuccess: (state) => {
            state.isFetching = false;
            state.login.currentUser = null;
        },
        logOutFailed: (state) => {
            state.isFetching = false;
            state.logout.error = true;
        },
    }
})


export const {
    loginStart,
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
    getCurrentUserFailed,
    redirectNotificationStart,
    redirectNotificationFinish
} = authSlice.actions;

export default authSlice.reducer;