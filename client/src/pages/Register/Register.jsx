import './Register.scss'
import { useState } from 'react'
import bgLogin from '../../assets/img/bg-login.gif'
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { registerUser } from "../../redux/apiRequest";
import Helmet from '../../components/Helmet/Helmet';

const Register = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [values, setValues] = useState({
    username:"",
    email: "",
    password: "",
    sex:"",
  })

  const handleChange = (e) => {
    const value = e.target.value
    setValues({...values, [e.target.name]: value})
  }
  const handleRegister = (e) => {
    e.preventDefault()
    const newUser = {
        username: values.username,
        email: values.email,
        password: values.password,
        sex:values.sex ? values.sex : "male" ,
    };
    registerUser(newUser,dispatch,navigate)
}
    const listOptions = [
        {
          name: 'username',
          label: 'Username',
          type: 'text',
          placeholder: 'Nguyễn Văn A',
          errorMessage: "Username should be 3-16 characters",
          required: true,
        },
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
          errorMessage: "Must contain at least one  number and one uppercase and lowercase letter, and at least 8 or more characters",
          pattern: '{8,}',
          required: true,
        },
        {
          name: 'confirmpassword',
          label: 'Confirmpassword',
          type: 'password',
          errorMessage: "Passwords don't match!",
          pattern: values.password,
          required: true,
        },
      ]
  return (
    <Helmet title="Register">
      <div className="register">
          <div className="register_bg" style={{backgroundImage: `url(${bgLogin})`}}></div>
          <div className="register_container">
              <h1>Register</h1>
              <form onSubmit={handleRegister}>
              {
                listOptions.map((option, index) => (
                  <FormItem key={index} onChange={handleChange} {...option}/>
                ))
              }
                  <div className="register__sex">
                    <label htmlFor="sex">Sex:</label>
                    <select name="sex" id="sex" onChange={handleChange}>
                      <option value='male'>male</option>
                      <option value='female'>female</option>
                    </select>
                  </div>
                  <button type="submit"> đăng ký </button>
              </form>
              <div className="register_footer">
                  Bạn đã có tài khoản?
                  <Link to='/login'>
                      <button>Đăng nhập ngay</button>
                  </Link>
              </div>
          </div>
      </div>
    </Helmet>
  )
}

export default Register;

const FormItem = ({label, name, onChange, errorMessage, ...inputProps}) => {
    const [focus, setFocus] = useState(true)
  
    const handleFocus = () => {
      if(name === 'confirmpassword') setFocus(false)
      else setFocus(true)
    }
  
    return (
      <div className="form__item">
        <label htmlFor={`${name}`}>{label}:</label>
        <input  
          id = {`${name}`} 
          name={name}
          {...inputProps}
          onChange = {name === 'confirmpassword' ? null : onChange}
          focus = {focus.toString()}
          onBlur = {() => setFocus(false)}
          onFocus= {handleFocus}
        />
        <span className='form__error'>{errorMessage}</span>
      </div>
    )
  }