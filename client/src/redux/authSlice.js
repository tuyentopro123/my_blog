import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name:"auth",
    initialState: {
        login: {
            currentUser: null,
            notification:[],
            redirectNoti:null,
            showNotification:false,
            isFetching: false,
            error: false,
        },
        register: {
            isFetching: false,
            error: false,
            success: false
        },
        logout: {
            isFetching: false,
            error: false,
        },
        msg:"",
    },
    reducers: {
        // LOGIN
        loginStart: (state) => {
            state.login.isFetching = true;
        },
        loginSuccess: (state,action) => {
            state.login.isFetching = false;
            state.login.currentUser = action.payload;
            state.login.notification = [];
            state.login.error = false;
            state.msg = action.payload;
        },
        loginFailed: (state,action) => {
            state.login.isFetching = false;
            state.login.error = true;
            state.msg = action.payload;
        },

        // REGISTER
        registerStart: (state) => {
            state.register.isFetching = true;
        },
        registerSuccess: (state) => {
            state.register.isFetching = false;
            state.register.success = true;
            state.register.error = false;
        },
        registerFailed: (state) => {
            state.register.isFetching = false;
            state.register.error = true;
            state.register.success = false;
        },

        // UPDATE USER
        updateUserStart: (state) => {
            state.login.isFetching = true;
        },
        updateUserSuccess: (state,action) => {
            state.login.isFetching = false;
            state.login.currentUser = action.payload;
            state.login.error = false;
        },
        updateUserFailed: (state) => {
            state.login.isFetching = false;
            state.login.error = true;
        },

        // NOTIFICATION
        getNotificationStart: (state) => {
            state.login.isFetching = true;
        },
        getNotificationSuccess: (state,action) => {
            state.login.isFetching = false;
            state.login.currentUser.notification_count = 0;
            state.login.notification = action.payload;
        },
        getNotificationFailed: (state) => {
            state.login.isFetching = false;
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
            state.login.isFetching = true;
        },
        getCurrentUserSuccess: (state,action) => {
            state.login.isFetching = false;
            state.login.currentUser = action.payload;
        },
        getCurrentUserFailed: (state) => {
            state.login.isFetching = false;
            state.login.error = true;
        },
        
        // LOGOUT
        logOutStart: (state) => {
            state.logout.isFetching = true;
        },
        logOutSuccess: (state) => {
            state.logout.isFetching = false;
            state.login.currentUser = null;
        },
        logOutFailed: (state) => {
            state.logout.isFetching = false;
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
    updateUserStart,
    updateUserSuccess,
    updateUserFailed,
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