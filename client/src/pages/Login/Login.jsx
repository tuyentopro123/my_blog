import React,{ useState,useEffect } from 'react'
import './Login.scss'
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../redux/apiRequest";
import bgLogin from '../../assets/img/bg-mobile.webp'
import Helmet from '../../components/Helmet/Helmet';
import facebook from '../../assets/img/facebook.png'
import google from '../../assets/img/google.png'

const Login = () => {

      
  const handleGoogle = async() => {
    window.open('http://localhost:8000/auth/google',"_self")
  }

  const handleFacebook = async() => {
    window.open('http://localhost:8000/auth/facebook',"_self")
  }


  return (
    <Helmet title="Login">
      <div className="login">
          <div className="login__bg" style={{backgroundImage: `url(${bgLogin})`}}></div>
          <div className="login__container">
              <h2>VANTUYEN</h2>
              <h1>ĐĂNG NHẬP VÀO TRANG CHỦ</h1>

              <div className="login__society">
                  <div className="login__society__item" onClick={handleGoogle}>
                    <img src={google} alt="" />
                    <span>Đăng nhập với Google</span>
                  </div>
                  <div className="login__society__item" onClick={handleFacebook}>
                    <img src={facebook} alt="" />
                    <span>Đăng nhập với Facebook</span>
                  </div>
              </div>
              <div className="login__footer">
                  Bạn chưa có tài khoản?
                  <Link to='/register'>
                      <button>Đăng ký</button>
                  </Link>
              </div>
          </div>
      </div>
    </Helmet>
  )
}

export default Login;

const FormItem = ({label, name, onChange, errorMessage, ...inputProps}) => {
    const [focus, setFocus] = useState(true)
  
    return (
      <div className="form__item">
        <label htmlFor={`${name}`}>{label}:</label>
        <input  
          id = {`${name}`} 
          name={name}
          {...inputProps}
          onChange = {onChange}
          focus = {focus.toString()}
          onBlur = {() => setFocus(false)}
          onFocus= {() => setFocus(true)}
        />
        <span className='form__error'>{errorMessage}</span>
      </div>
    )
  }