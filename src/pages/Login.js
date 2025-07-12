import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from '../utils/axios';

const Login = () => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentRequired, setPaymentRequired] = useState(false);
  const navigate = useNavigate();

  const currentMonth = new Date().getMonth() + 1;  // Get the current month (1-12)
  const organization = "AKHIINTERNATIONAL";        // Organization to check payment status for

  useEffect(() => {
    // Remove certain body classes
    document.body.classList.remove('hold-transition', 'skin-blue', 'sidebar-mini');
    return () => {
      document.body.classList.add('hold-transition', 'skin-blue', 'sidebar-mini');
    };
  }, []);

  // Check if payment has been made for the current month and organization
  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        const response = await axiosInstance.get('/payment/checkPayment.php', {
          params: {
            month: currentMonth,
            organization: organization
          }
        });
        if (response.data.length>0) {
          // If payment exists, proceed with login
          setPaymentRequired(false);
        } else {
          // If no payment, redirect to payment page
          setPaymentRequired(true);
          navigate('/payment');
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
        setError('Error checking payment status.');
      }
    };

    checkPaymentStatus();
  }, [currentMonth, organization, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(''); // Clear previous errors
    try {
      const response = await axiosInstance.post('/login/login.php', { username, password });
      if (response.data.success) {
        // Check payment status and navigate accordingly
        localStorage.setItem('sessionToken', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        navigate('/dashboard');
      } else {
        setError(response.data.message || 'Login failed');
      }
    } catch (error) {
      setError('There was an error!');
      console.error('There was an error!', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = () => {
    // Redirect to the payment URL
    window.location.href = 'https://shop.bkash.com/it-tech-point-bd01886194791/pay/bdt355/00v04c';
  };

  return (
    <>
      <div className='login-box2'>
        <div className="login-box">
          <div className="login-logo">
            <a style={{ color: 'white' }}><b>Welcome </b>back</a>
          </div>
          <div className="login-box-body">
            <p className="login-box-msg">Sign in to start your session</p>
            <form onSubmit={handleSubmit}>
              <div className="form-group has-feedback">
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Email" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)} 
                />
                <span className="glyphicon glyphicon-envelope form-control-feedback" />
              </div>
              <div className="form-group has-feedback">
                <input 
                  type="password" 
                  className="form-control" 
                  placeholder="Password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)} 
                />
                <span className="glyphicon glyphicon-lock form-control-feedback" />
              </div>
              <div className="row">
                <div className="col-xs-8"></div>
                <div className="col-xs-4">
                  <button 
                    type="submit" 
                    className="btn btn-primary btn-block btn-flat"
                  >
                    {loading ? (
                      <span className="fa fa-refresh fa-spin" role="status" aria-hidden="true"></span>
                    ) : (
                      "Sign In"
                    )}
                  </button>
                </div>
              </div>
              {error && <h1 className="text-danger small">{error}</h1>}
            </form>
            {paymentRequired && (
              <div className="payment-prompt">
                <button style={{width:'100%'}} onClick={handlePayment} className="btn btn-danger">Proceed to Payment</button>
              </div>
            )}
            <Link to={'/signup'} className="text-center">Register a new user</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
