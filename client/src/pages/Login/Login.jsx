import React,{ useState,useEffect } from 'react'
import './Login.scss'
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../redux/apiRequest";
import bgLogin from '../../assets/img/bg-login.gif'
import Helmet from '../../components/Helmet/Helmet';


const Login = () => {


  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector((state)=> state.auth.login?.currentUser)
  const msg = useSelector((state)=> state.auth.msg)
  const [err,setErr] = useState(false)
  const [values, setValues] = useState({
    email: "",
    password: "",
  })
  
  useEffect(() => {
    if(err) {
      if(msg._id) {
        console.log("thanh cong")
      } else {
        document.querySelectorAll(".form__error")[1].style.display = "block"
        setErr(false)
      }
    }
  },[msg])
  
  const handleChange = (e) => {
    const value = e.target.value
    setValues({...values, [e.target.name]: value})
  }
  
  const handleLogin = (e) => {
    e.preventDefault()
    setErr(true)
    const newUser = {
      email: values.email,
      password: values.password
    };
    loginUser(newUser,dispatch,navigate);
  }

    const listOptions = [
        {
          name: 'email',
          label: 'Email',
          type: 'email',
          placeholder: 'abcxyz@gmail.com',
          errorMessage: "It should be a valid email address!",
          required: true,
        },
        {
          name: 'password',
          label: 'Password',
          type: 'password',
          errorMessage: "Incorrect account or password",
          required: true,
        },
      ]

      useEffect(() => {
        document.getElementById("password").addEventListener("focus", () => {
          document.querySelectorAll(".form__error")[1].style.display = "none"
        })
        if(user) {
          navigate("/")
        }
      },[])

  return (
    <Helmet title="Login">
      <div className="login">
          <div className="login_bg" style={{backgroundImage: `url(${bgLogin})`}}></div>
          <div className="login_container">
              <h1>Login</h1>
              <form onSubmit={handleLogin}>
                  {
                  listOptions.map((option, index) => (
                      <FormItem key={index} onChange={handleChange} {...option}/>
                  ))
                  }
                  <button type="submit"> đăng nhập </button>
              </form>
              <div className="login_footer">
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