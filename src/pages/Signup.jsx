import React, { useState } from 'react';
import axiosInstance from '../utils/axios';
import { Link,useLocation ,useNavigate} from "react-router-dom";

const Signup = () => {
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [contact, setContact] = useState('');
    const [designation, setDesignation] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axiosInstance.post('login/signup.php', {

                username,
                password,
                name,
                contact,
                designation
            });

            if (response.data.message) {
                setMessage(response.data.message);
                navigate('/')
            } else if (response.data.error) {
                setMessage(`Error: ${response.data.error}`);
            }
        } catch (error) {
            setMessage(`Error: ${error.message}`);
        }
    };

    return (
        <div>



<div className='login-box2'>
<div   className="login-box">
  <div className="login-logo">
    <a style={{color:'white'}}><b>Welcome </b>back</a>
  </div>
  <div className="login-box-body">
    <p className="login-box-msg">Sign up form</p>

    

    <form onSubmit={handleSubmit}>
      
      <div className="form-group has-feedback">
        <input type="text" className="form-control" placeholder="Email" value={username}
       onChange={(e) => setUsername(e.target.value)} />
        <span className="glyphicon glyphicon-envelope form-control-feedback" />
      </div>
      <div className="form-group has-feedback">
        <input type="password" className="form-control" placeholder="Password" value={password}
         onChange={(e) => setPassword(e.target.value)}/>
        <span className="glyphicon glyphicon-lock form-control-feedback" />
      </div>
      <div className="form-group has-feedback">
        <input type="text" className="form-control" placeholder="Name" value={name}
         onChange={(e) => setName(e.target.value)}/>
        <span className="glyphicon glyphicon-lock form-control-feedback" />
      </div>
      <div className="form-group has-feedback">
        <input type="text" className="form-control" placeholder="contact" value={contact}
         onChange={(e) => setContact(e.target.value)}/>
        <span className="glyphicon glyphicon-lock form-control-feedback" />
      </div>
      <div className="form-group has-feedback">
        <input type="text" className="form-control" placeholder="designation" value={designation}
         onChange={(e) => setDesignation(e.target.value)}/>
        <span className="glyphicon glyphicon-lock form-control-feedback" />
      </div>

     
      <div className="row">
        <div className="col-xs-8">
          <div className="checkbox icheck">
            
          </div>
        </div>
        <div className="col-xs-4">
          <button type="submit" className="btn btn-primary btn-block btn-flat">Sign In</button>
        </div>
      </div>
      

      {message && <p>{message}</p>}

    </form>

    {/* <a href="#">I forgot my password</a><br />
    <a href="register.html" className="text-center">Register a new membership</a> */}
  </div>
</div>
</div>




            
        </div>
    );
};

export default Signup;
