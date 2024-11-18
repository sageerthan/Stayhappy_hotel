import React, { useContext, useState } from 'react'
import { loginUser } from '../utils/AuthApiFunctions'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Form, FormControl } from "react-bootstrap";
import { AuthContext } from './AuthProvider';

const Login = () => {
  const [login, setLogin] = useState({
    email: "",
    password: ""
  })
  const [error, setError ]= useState("")
  const [isValidated, setIsValidated] = useState(false)

  const navigate = useNavigate()
  const auth=useContext(AuthContext)
  const location=useLocation()
  const redirectUrl=location.state?.path ||"/"

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setLogin({ ...login, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setIsValidated(true);
      return;
    }

    setIsValidated(true);
    
    const success = await loginUser(login)
    if (success) {
      const token = success.token
      auth.handleLogin(token)
      navigate(redirectUrl,{replace:true})
    }
    else {
      setError("Invalid username or password")
    }
    
    setTimeout(() => {
      setError("")
    }, 3000)
  }
  return (
    <section className="container col-6 mt-5 mb-5">
      {error && <p className='alert alert-danger'>{error}</p>}
      <h2>Login</h2>
      <Form noValidate validated={isValidated} onSubmit={handleSubmit}>
        <div className='row mb-3'>
          <Form.Group>
            <Form.Label htmlFor="email" className='col-sm-2'>Email:</Form.Label>
            <FormControl
              required
              type="email"
              id="email"
              name="email"
              value={login.email}
              placeholder='Enter email address'
              onChange={handleInputChange}
            />
            <Form.Control.Feedback type="invalid">
              Please enter your email address
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group>
            <Form.Label htmlFor="password" className='col-sm-2'>Password:</Form.Label>
            <FormControl
              required
              type="password"
              id="password"
              name="password"
              value={login.password}
              placeholder="Enter your password"
              onChange={handleInputChange}
            />
            <Form.Control.Feedback type="invalid">
              Please enter your password
            </Form.Control.Feedback>
          </Form.Group>
          <div className="form-group mt-3 mb-2 flex-shrink-0">
            <button type="submit" className="btn" style={{ backgroundColor: '#f172b7', color: '#fff', border: 'none',marginRight:'10px'}}>
              Login
            </button>
            <span style={{marginLeft:"10px"}}>
              Don't have an account? <Link to={"/register"}>Register</Link>
            </span>
          </div>


        </div>
      </Form>

    </section>
  )
}

export default Login