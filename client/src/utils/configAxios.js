import axios from 'axios'

const BASE_URL = 'https://my-blog-kfgs.vercel.app/'

export const publicRequest = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
})