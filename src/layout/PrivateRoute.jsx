import { useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "../reuseable/Loader";
const PrivateRoute = () => {
  const [loading, setLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem('sessionToken');
      try {
        const response = await axios.get(
          `https://petrolpump.fahimtraders.com/backend/login/login.php?token=${token}`
        );
        if (response.data.success) {
          setIsValid(true);
        } else {
          navigate('/'); // Redirect to login if session is invalid
        }
      } catch (error) {
        console.error('Error:', error);
        navigate('/'); // Redirect to login on error
      } finally {
        setLoading(false); // Stop loading once session check is complete
      }
    };

    checkSession();
  }, [navigate]);

  if (loading) {
    return <Loader />; // Show loading spinner while checking session
  }

  return isValid ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoute;
