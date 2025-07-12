import {useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginVerify } from "../../features/login/loginSlice";
import { useNavigate } from 'react-router-dom';
import pb from "../../utils/pocketbase";
const LoginForm = () => {


    let navigate = useNavigate();
    // console.log(pb.authStore.isValid);
    // console.log(pb.authStore.token);
    // console.log(pb.authStore.model.id);
    const dispatch = useDispatch();
    const { isLoading, isError ,error} = useSelector((state) => state.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailChange = (event) => {
   
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    // Dispatch the loginVerify action
    const result = await dispatch(loginVerify({
      email,
      password
    }));
    // If there's no error, navigate to the dashboard
    if (result.payload && result.payload.record.verified===true) {
      localStorage.removeItem("date");
      if(pb.authStore.model !=null){
        const response = await pb.collection('dateset').getFirstListItem(`posted="${pb.authStore.model.expand.reference.id}"`, {
        });
        
           if(response.automode ===true){
     
            function getCurrentDate() {
              var currentDate = new Date();
            
              var month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
              var day = currentDate.getDate().toString().padStart(2, '0');
              var year = currentDate.getFullYear();
            
              return year+ '-'+month + '-' + day ;
            }
            
            var formattedDate = getCurrentDate();
  
        localStorage.setItem('date', (formattedDate))
           } else{
            localStorage.setItem('date', (response.date));
           }
      }
      setLoading(false)
      navigate('/dashboard'); // Change this route to the actual dashboard route
    }else{
      navigate('/dashboard');
    }
  };

  return (

<>

<form onSubmit={handleSubmit}>
      
      <div className="form-group has-feedback">
        <input type="text" className="form-control" placeholder="Email" value={email}
          onChange={handleEmailChange} />
        <span className="glyphicon glyphicon-envelope form-control-feedback" />
      </div>
      <div className="form-group has-feedback">
        <input type="password" className="form-control" placeholder="Password" value={password}
          onChange={handlePasswordChange} />
        <span className="glyphicon glyphicon-lock form-control-feedback" />
      </div>
      <div className="row">
        <div className="col-xs-8">
          <div className="checkbox icheck">
            
          </div>
        </div>
        <div className="col-xs-4">
          <button type="submit" className="btn btn-primary btn-block btn-flat">{loading ? (
        <span className="fa fa-refresh fa-spin" role="status" aria-hidden="true"></span>
      ) : (
    ""
      )}Sign In</button>
        </div>
      </div>
      

      {error && <h1 className="text-danger small">{error}</h1>}
    </form>



</>


   
    
  );
};

export default LoginForm;
