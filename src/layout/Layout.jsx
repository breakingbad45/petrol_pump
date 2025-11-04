
import React from 'react'
import { Link,useLocation ,useNavigate} from "react-router-dom";
const Layout = ({children}) => {
    const location = useLocation();
    const history = useNavigate();
    const formattedDate = new Date();

    // Convert the UTC time to UTC+6
    const utcPlus6Date = new Date(formattedDate.getTime() + (6 * 60 * 60 * 1000));
    
    // Format the date and time as desired
    const currentDate = utcPlus6Date.toISOString().slice(0, 10); // YYYY-MM-DD
  
    const fuser = localStorage.getItem('user');
    const user =JSON.parse(fuser)
    const formatdate = user.mode === "1" ? user.date : currentDate;
    const modedate = user.mode === "1" ? "Manual" : 'Auto';
 
    // Create a date object for September 5, 2024
const date = new Date(formatdate);

// Define arrays for Bengali numbers and month names
const banglaNumbers = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
const banglaMonths = [
  'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 
  'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
];

// Function to convert English numbers to Bengali numbers
function convertToBanglaNumber(number) {
  return number.toString().split('').map(num => banglaNumbers[num]).join('');
}

// Get the day, month, and year
const day = convertToBanglaNumber(date.getDate());
const month = banglaMonths[date.getMonth()];
const year = convertToBanglaNumber(date.getFullYear());

// Format the date in Bengali
const banglaDate = `${day} ${month} ${year}`;


    
  const handleLogout = () => {
    localStorage.removeItem('sessionToken');
    history('/');
  };

  return (
    <div>
  <div>
           <header className="main-header">
          <a href="index2.html" className="logo">
          <span className="logo-mini" style={{fontFamily:'SolaimanLipi'}}><b>{user?.short}</b></span>
          <span className="logo-lg" style={{fontFamily:'SolaimanLipi'}}><b></b>{user?.company}</span>
          </a>
          <nav className="navbar navbar-static-top">
            <a href="#" className="sidebar-toggle" data-toggle="push-menu" role="button">
              <span className="sr-only">Toggle navigation</span>
            </a>
            <span className="" style={{color:'yellow',fontWeight:'bold',float:'left',padding:'15px 15px'}}>তারিখ : {banglaDate}</span>
            <span style={{marginTop:'10px',background:'green',fontWeight:'bold',float:'left',padding:'5px',color:'white',borderRadius:'5px'}}>{modedate}</span>
       
            <div className="navbar-custom-menu">

              <ul className="nav navbar-nav">
                <li className="dropdown user user-menu">
                  <a href="#" className="dropdown-toggle" data-toggle="dropdown">
                    
                    <img src='./assets/akhiinternational.png' className="user-image" alt="User Image" />
                    <span className="hidden-xs">{user?.username}</span>
                  </a>
                  <ul className="dropdown-menu">
                    <li className="user-header">
                      <img src={user?.image} className="img-circle" alt="User Image" />
                      <p>
                      {user?.username}
                        <small>Member since {user?.created_at}</small>
                      </p>
                    </li>
                
                    <li className="user-footer">
                      <div className="pull-left">
                        <a href="#" className="btn btn-default btn-flat">Profile</a>
                      </div>
                      <div onClick={handleLogout} className="pull-right">
                        <a href="#" className="btn btn-default btn-flat">Sign out</a>
                      </div>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </nav>
        </header>
    </div>
    <div>
          <aside className="main-sidebar">
          <section className="sidebar">
    
            <div style={{margin:'0px'}}/>        
            <ul className="sidebar-menu" data-widget="tree">
            <li className={location.pathname==="/dashboard"?"active":""}>
            <Link to="/dashboard">
    <i className="fa fa-dashboard" /> <span> Dashboard   </span>
    <span className="pull-right-container">
   
    </span>
    </Link>
</li>


<li  className={location.pathname==="/accounts"?"active":""}>
            <Link to="/accounts">
    <i className="fa fa-users " /> <span> Accounts   </span>
    <span className="pull-right-container">
      
    </span>
    </Link>
</li>
<li  className={location.pathname==="/products"?"active":""}>
            <Link to="/products">
    <i className="fa fa-product-hunt" /> <span> Products   </span>
    <span className="pull-right-container">
      
    </span>
    </Link>
</li>
<li  className={location.pathname==="/transaction"?"active":""}>
            <Link to="/transaction">
    <i className="fa fa-money" /> <span> Transaction   </span>
    <span className="pull-right-container">
      
    </span>
    </Link>
</li>

<li  className={location.pathname==="/salaryform"?"active":""}>
            <Link to="/salaryform">
    <i className="fa fa-money" /> <span> Salaryform   </span>
    <span className="pull-right-container">
      
    </span>
    </Link>
</li>
<li  className={location.pathname==="/reading"?"active":""}>
            <Link to="/reading">
    <i className="fa fa-money" /> <span> Reading   </span>
    <span className="pull-right-container">
      
    </span>
    </Link>
</li>
<li  className={location.pathname==="/temporary"?"active":""}>
            <Link to="/temporary">
    <i className="fa fa-money" /> <span> Temporary   </span>
    <span className="pull-right-container">
      
    </span>
    </Link>
</li>
<li  className={location.pathname==="/dualtransaction"?"active":""}>
            <Link to="/dualtransaction">
    <i className="fa fa-university" /> <span> Dual Transaction   </span>
    <span className="pull-right-container">
      
    </span>
    </Link>
</li>
{/* <li  className={location.pathname==="/pos"?"active":""}>
            <Link to="/pos">
    <i className="fa fa-shopping-cart" /> <span>Pos </span>
    <span className="pull-right-container">
      
    </span>
    </Link>
</li> */}
<li  className={location.pathname==="/inventory"?"active":""}>
            <Link to="/inventory">
    <i className="fa fa-shopping-cart" /> <span>Inventory </span>
    <span className="pull-right-container">
      
    </span>
    </Link>
</li>

<li  className={location.pathname==="/inventory2"?"active":""}>
            <Link to="/inventory2">
    <i className="fa fa-shopping-cart" /> <span>Inventory 2 </span>
    <span className="pull-right-container">
      
    </span>
    </Link>
</li>
<li  className={location.pathname==="/reportmenu"?"active":""}>
            <Link to="/reportmenu">
    <i className="fa fa-id-card" /> <span> Report & Ledger   </span>
    <span className="pull-right-container">
      
    </span>
    </Link>
</li>

<li  className={location.pathname==="/dateset"?"active":""}>
            <Link to="/dateset">
    <i className="fa fa-calendar" /> <span> Date set   </span>
    <span className="pull-right-container">
      
    </span>
    </Link>
</li>


            </ul>
          </section>
        </aside>
    </div>

    

    <div className="content-wrapper">


{children}
 </div>
 <div>
           <footer className="main-footer" style={{bottom:'0px !important',position:'absolute'}}>
          <div className="pull-right hidden-xs">
            <b>Version</b> 2.4.18
          </div>
          <strong>Copyright © 2014-2019 <a >AdminLTE</a>.</strong> All rights reserved.
        </footer>
    </div>
     
       
    </div>
  )
}

export default Layout