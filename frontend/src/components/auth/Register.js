import React,{useState} from 'react'
import { registerUser } from '../utils/AuthApiFunctions'
import {Form,FormControl} from 'react-bootstrap'
import {Link} from 'react-router-dom'

const Register = () => {
    const[registration,setRegistration]=useState({
        firstName:"",
        lastName:"",
        email:"",
        password:""
    })
    const[errorMessage,setErrorMessage]=useState("")
    const[successMessage,setSuccessMessage]=useState("")
    const[isValidated,setIsValidated]=useState(false)
    const handleInputChange=(e)=>{
        setRegistration({...registration,[e.target.name]:e.target.value})
    }
    const handleSubmit=async(e)=>{
        e.preventDefault()
        try{
          const result=await registerUser(registration)
          setSuccessMessage(result)
          setErrorMessage("")
        }catch(error){
          setSuccessMessage("")
          setErrorMessage(`Registration error:${error.message}`)
        }
        setIsValidated(true)
        setTimeout(()=>{
          setSuccessMessage("")
          setErrorMessage("")
        },3000)
    }
  return (
    <section className='container col-6 mt-5 mb-5'>
      {successMessage && <p className='alert alert-success'>{successMessage}</p>}
      {errorMessage && <p className='alert alert-danger'>{errorMessage}</p>}
      <h2>Register</h2>
      <Form noValidate validated={isValidated} onSubmit={handleSubmit}>
        <div className='row mb-3'>
          <Form.Group>
            <Form.Label htmlFor="firstName" className='col-sm-2'>FirstName:</Form.Label>
            <FormControl
              required
              type="text"
              id="firstName"
              name="firstName"
              value={registration.firstName}
              placeholder="Enter your first name"
              onChange={handleInputChange}
            />
            <Form.Control.Feedback type="invalid">
              Please enter your first name
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group>
            <Form.Label htmlFor="lastName" className='col-sm-2'>LastName:</Form.Label>
            <FormControl
              required
              type="text"
              id="lastName"
              name="lastName"
              value={registration.lastName}
              placeholder="Enter your last name"
              onChange={handleInputChange}
            />
            <Form.Control.Feedback type="invalid">
              Please enter your last name
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group>
            <Form.Label htmlFor="email" className='col-sm-2'>Email:</Form.Label>
            <FormControl
              required
              type="email"
              id="email"
              name="email"
              value={registration.email}
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
              value={registration.password}
              placeholder="Enter your password"
              onChange={handleInputChange}
            />
            <Form.Control.Feedback type="invalid">
              Please enter your password
            </Form.Control.Feedback>
          </Form.Group>
          
          <div className="form-group mt-3 mb-2 flex-shrink-0">
            <button type="submit" className="btn" style={{ backgroundColor: '#f172b7', color: '#fff', border: 'none',marginRight:'10px'}}>
              Register
            </button>
            <span style={{marginLeft:"10px"}}>
              Already have an account? <Link to={"/login"}>Login</Link>
            </span>
          </div>
        </div>
      </Form>

    </section>
  )
}

export default Register