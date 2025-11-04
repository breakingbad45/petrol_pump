import React,{useEffect} from 'react'
import { Link ,useLocation} from 'react-router-dom'
import pb from '../utils/pocketbase';
import { MdOutlineMoreVert } from "react-icons/md";

import { Scrollbars } from "react-custom-scrollbars";
const Layout = ({ children }) => {
  const serverDate = localStorage.getItem('date');

  function convertDateFormat(inputDate) {
    // Split the input date into year, month, and day
    var dateComponents = inputDate.split('-');
    
    // Rearrange the components to the "mm/dd/yyyy" format
    var outputDate = dateComponents[1] + '/' + dateComponents[2] + '/' + dateComponents[0];
    
    return outputDate;
  }
  
  const sidebarOverlay = () => {
    document.querySelector(".main-wrapper").classList.toggle("slide-nav");
    document.querySelector(".sidebar-overlay").classList.toggle("opened");
    document.querySelector("html").classList.toggle("menu-opened");
  };
  const location = useLocation();
  const url =location.pathname;
const parts = url.split('/');

  const extracted = '/' + parts[1];
const signOut =()=>{
  pb.authStore.clear();
  window.location.replace('/')
}

const divStyles = {
  overflow: 'hidden',
  width: '100%',
  height: '100%',
  background:'#fff'
};
  return (
    <div>

    <div>
      
      <div className="main-wrapper">
        {/* Header */}
        <div className="header">
          {/* Logo */}
          <div className="header-left active">
            <a className="logo logo-normal">
              <img src={`/assets/img/${pb.authStore.model.username}logo.png`}  alt="" />
            </a>
            <a href="index.html" className="logo logo-white">
              <img src="/assets/img/logo-white.png" alt="" />
            </a>
            <a href="index.html" className="logo-small">
              <img src={`/assets/img/${pb.authStore.model.username}logosmall.png`} alt="" />
            </a>
            <a id="toggle_btn" href="javascript:void(0);"><i data-feather="chevrons-left" class="feather-16"></i></a>
           
          </div>
          {/* /Logo */}
          <a id="mobile_btn"    onClick={sidebarOverlay} className="mobile_btn" href="#sidebar">
            <span className="bar-icon">
              <span />
              <span />
              <span />
            </span>
          </a>
          {/* Header Menu */}
          <ul className="nav user-menu">
            <p className='h-date'>Date : <strong>{convertDateFormat(serverDate)}</strong></p>
            {/* Search */}
            {/* <li className="nav-item">
              <div className="top-nav-search">
                <a  className="responsive-search">
                  <i className="fa fa-search" />
                </a>
                <form action="#">
                  <div className="searchinputs">
                    <input type="text" placeholder="Search Here ..." />
                    <div className="search-addon">
                      <span><img src="/assets/img/icons/closes.svg" alt="img" /></span>
                    </div>
                  </div>
                  <a className="btn" id="searchdiv"><img src="/assets/img/icons/search.svg" alt="img" /></a>
                </form>
              </div>
            </li> */}
            {/* /Search */}
            {/* Flag */}
            {/* <li className="nav-item dropdown has-arrow flag-nav">
              <a className="nav-link dropdown-toggle" data-bs-toggle="dropdown"  role="button">
                <img src="/assets/img/flags/us1.png" alt height={20} />
              </a>
              <div className="dropdown-menu dropdown-menu-right">
                <a  className="dropdown-item">
                  <img src="/assets/img/flags/us.png" alt height={16} /> English
                </a>
                <a  className="dropdown-item">
                  <img src="/assets/img/flags/fr.png" alt height={16} /> French
                </a>
                <a  className="dropdown-item">
                  <img src="/assets/img/flags/es.png" alt height={16} /> Spanish
                </a>
                <a  className="dropdown-item">
                  <img src="/assets/img/flags/de.png" alt height={16} /> German
                </a>
              </div>
            </li> */}
            {/* /Flag */}
            {/* Notifications */}
            <li className="nav-item dropdown">
              <a  className="dropdown-toggle nav-link" data-bs-toggle="dropdown">
                <img src="/assets/img/icons/notification-bing.svg" alt="img" /> <span className="badge rounded-pill">4</span>
              </a>
              <div className="dropdown-menu notifications">
                <div className="topnav-dropdown-header">
                  <span className="notification-title">Notifications</span>
                  <a href="" className="clear-noti"> Clear All </a>
                </div>
                <div className="noti-content">
                  <ul className="notification-list">
                    <li className="notification-message">
                      <a href="activities.html">
                        <div className="media d-flex">
                          <span className="avatar flex-shrink-0">
                            <img alt="" src="/assets/img/profiles/avatar-02.jpg" />
                          </span>
                          <div className="media-body flex-grow-1">
                            <p className="noti-details"><span className="noti-title">John Doe</span> added new task <span className="noti-title">Patient appointment booking</span></p>
                            <p className="noti-time"><span className="notification-time">4 mins ago</span></p>
                          </div>
                        </div>
                      </a>
                    </li>
                    <li className="notification-message">
                      <a href="activities.html">
                        <div className="media d-flex">
                          <span className="avatar flex-shrink-0">
                            <img alt="" src="/assets/img/profiles/avatar-03.jpg" />
                          </span>
                          <div className="media-body flex-grow-1">
                            <p className="noti-details"><span className="noti-title">Tarah Shropshire</span> changed the task name <span className="noti-title">Appointment booking with payment gateway</span></p>
                            <p className="noti-time"><span className="notification-time">6 mins ago</span></p>
                          </div>
                        </div>
                      </a>
                    </li>
                    <li className="notification-message">
                      <a href="activities.html">
                        <div className="media d-flex">
                          <span className="avatar flex-shrink-0">
                            <img alt src="/assets/img/profiles/avatar-06.jpg" />
                          </span>
                          <div className="media-body flex-grow-1">
                            <p className="noti-details"><span className="noti-title">Misty Tison</span> added <span className="noti-title">Domenic Houston</span> and <span className="noti-title">Claire Mapes</span> to project <span className="noti-title">Doctor available module</span></p>
                            <p className="noti-time"><span className="notification-time">8 mins ago</span></p>
                          </div>
                        </div>
                      </a>
                    </li>
                    <li className="notification-message">
                      <a href="activities.html">
                        <div className="media d-flex">
                          <span className="avatar flex-shrink-0">
                            <img alt src="/assets/img/profiles/avatar-17.jpg" />
                          </span>
                          <div className="media-body flex-grow-1">
                            <p className="noti-details"><span className="noti-title">Rolland Webber</span> completed task <span className="noti-title">Patient and Doctor video conferencing</span></p>
                            <p className="noti-time"><span className="notification-time">12 mins ago</span></p>
                          </div>
                        </div>
                      </a>
                    </li>
                    <li className="notification-message">
                      <a href="activities.html">
                        <div className="media d-flex">
                          <span className="avatar flex-shrink-0">
                            <img alt src="/assets/img/profiles/avatar-13.jpg" />
                          </span>
                          <div className="media-body flex-grow-1">
                            <p className="noti-details"><span className="noti-title">Bernardo Galaviz</span> added new task <span className="noti-title">Private chat module</span></p>
                            <p className="noti-time"><span className="notification-time">2 days ago</span></p>
                          </div>
                        </div>
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="topnav-dropdown-footer">
                  <a href="activities.html">View all Notifications</a>
                </div>
              </div>
            </li>
            {/* /Notifications */}
            <li className="nav-item dropdown has-arrow main-drop">
              <a  className="dropdown-toggle nav-link userset" data-bs-toggle="dropdown">
                <span className="user-img"><img src="/assets/img/profiles/avator1.jpg" alt />
                  <span className="status online" /></span>
              </a>
              <div className="dropdown-menu menu-drop-user">
                <div className="profilename">
                  <div className="profileset">
                    <span className="user-img"><img src="/assets/img/profiles/avator1.jpg" alt />
                      <span className="status online" /></span>
                    <div className="profilesets">
                      <h6>{pb.authStore.model.username}</h6>
                      <h5>Admin</h5>
                    </div>
                  </div>
                  <hr className="m-0" />
                  <a className="dropdown-item" href="profile.html"> <i className="me-2" data-feather="user" /> My Profile</a>
                  <a className="dropdown-item" href="generalsettings.html"><i className="me-2" data-feather="settings" />Settings</a>
                  <hr className="m-0" />
                  <a onClick={signOut}  className="dropdown-item logout pb-0"><img src="/assets/img/icons/log-out.svg" className="me-2" alt="img" />Logout</a>
                </div>
              </div>
            </li>
          </ul>
          {/* /Header Menu */}
          {/* Mobile Menu */}
          <div className="dropdown mobile-user-menu">
            <a  className="nav-link dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false"><MdOutlineMoreVert /></a>
            <div className="dropdown-menu dropdown-menu-right">
              <a className="dropdown-item" href="profile.html">My Profile</a>
              <a className="dropdown-item" href="generalsettings.html">Settings</a>
              <a onClick={signOut} className="dropdown-item" >Logout</a>
            </div>
          </div>
          {/* /Mobile Menu */}
        </div>
        {/* Header */}
        {/* Sidebar */}
  
        <div className="sidebar shadow-sm" >
          <div className="sidebar-inner slimscroll" style={divStyles}>
            <div id="sidebar-menu" className="sidebar-menu">
              <ul>
                <li className={location.pathname==="/dashboard"?"active":""}>
                <Link to="/dashboard" >
              <img src="/assets/img/icons/dashboard.svg" alt="img" /><span> Dashboard</span> 
        
</Link>
                  </li>
                  <li className={location.pathname==="/accounts"?"active":""}>
                <Link to="/accounts" >
              <img src="/assets/img/icons/dashboard.svg" alt="img" /><span> Accounts</span> 
        
</Link>
                  </li>
                  <li className={location.pathname==="/sellpurchase"?"active":""}>
                <Link to="/sellpurchase" >
         <img src="/assets/img/icons/product.svg" alt="img" /><span> Sell/Purchase</span> 
</Link>
                 </li>
                 <li className={location.pathname==="/transaction"?"active":""}>
                <Link to="/transaction" >
         <img src="/assets/img/icons/product.svg" alt="img" /><span> Transaction</span> 
</Link>
                 </li>

                 
                 {/* <li className={location.pathname==="/delivery" || extracted==="/deliverychalan"?"active":""}>
                <Link to="/delivery" >
                <img src="/assets/img/icons/eye.svg" alt="img" /><span> Delivery</span> 
                </Link>
                 </li> */}
               

              
                 <li className={location.pathname==="/ledger"?"active":""}>
                <Link to="/ledger" >
                <img src="/assets/img/icons/transfer1.svg" alt="img" /><span> Ledger</span> 
                </Link>
                 </li>
                 <li className={location.pathname==="/stock"?"active":""}>
                <Link to="/stock" >
                <img src="/assets/img/icons/transfer1.svg" alt="img" /><span> Stock</span> 
                </Link>
                 </li>
                 <li className={location.pathname==="/accountbalance"?"active":""}>
                <Link to="/accountbalance" >
                <img src="/assets/img/icons/transfer1.svg" alt="img" /><span> A/c Balance</span> 
                </Link>
                 </li>

                 <li className={location.pathname==="/profit"?"active":""}>
                <Link to="/profit" >
                <img src="/assets/img/icons/transfer1.svg" alt="img" /><span> Profit</span> 
                </Link>
                 </li>
                 <li className={location.pathname==="/finalreport"?"active":""}>
                <Link to="/finalreport" >
                <img src="/assets/img/icons/transfer1.svg" alt="img" /><span> Final Report</span> 
                </Link>
                 </li>
               <li className={location.pathname==="/dateset"?"active":""}>
                <Link to="/dateset" >
                <img src="/assets/img/icons/settings.svg" alt="img" /><span> Setting</span> 
                </Link>
                 </li>
             
              </ul>


            </div>
          </div>
        </div>
       
        {/* /Sidebar */}
      {children}
       <footer style={{borderTop:"1px double black", position: 'fixed', bottom: 0, width: '100%', background: '#fff', padding: '10px', textAlign: 'center' }}>
      <span style={{marginLeft:'195px',}}> <strong>Copyright © {new Date().getFullYear()} <a href="https://ittechpoint.netlify.app">It Tech Point BD</a>.</strong> All rights
    reserved.</span>
   
    </footer>
      </div>
    </div>
    
    
        </div>
  )
}

export default Layout