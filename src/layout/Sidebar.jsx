import React from 'react'
import { Link,useLocation } from "react-router-dom";
const Sidebar = () => {
    const location = useLocation();
  return (
    <div>
          <aside className="main-sidebar">
          <section className="sidebar">
            <div className="user-panel">
              <div className="pull-left image">
                <img src="dist/img/user2-160x160.jpg" className="img-circle" style={{border:'1px solid black'}} alt="User Image" />
              </div>
              <div className="pull-left info">
                <p>Alexander Pierce</p>
                <a href="#"><i className="fa fa-circle text-success" /> Online</a>
             
              </div>
              
            </div>
            <hr style={{margin:'0px'}}/>        
            <ul className="sidebar-menu" data-widget="tree">
            <li className={location.pathname==="/dashboard"?"active":""}>
            <Link to="/dashboard">
    <i className="fa fa-th" /> <span> Dashboard   </span>
    <span className="pull-right-container">
      <small className="label pull-right bg-green">new</small>
    </span>
    </Link>
</li>
<li  className={location.pathname==="/accounts"?"active":""}>
            <Link to="/accounts">
    <i className="fa fa-th" /> <span> Accounts   </span>
    <span className="pull-right-container">
      <small className="label pull-right bg-green">new</small>
    </span>
    </Link>
</li>

<li  className={location.pathname==="/transaction"?"active":""}>
            <Link to="/transaction">
    <i className="fa fa-th" /> <span> Transaction   </span>
    <span className="pull-right-container">
      <small className="label pull-right bg-green">new</small>
    </span>
    </Link>
</li>

<li  className={location.pathname==="/salaryform"?"active":""}>
            <Link to="/salaryform">
    <i className="fa fa-th" /> <span> Salary Form   </span>
    <span className="pull-right-container">
      <small className="label pull-right bg-green">new</small>
    </span>
    </Link>
</li>

<li  className={location.pathname==="/dualtransaction"?"active":""}>
            <Link to="/dualtransaction">
    <i className="fa fa-th" /> <span> Dual Transaction   </span>
    <span className="pull-right-container">
      <small className="label pull-right bg-green">new</small>
    </span>
    </Link>
</li>
              {/* <li className="active treeview">
                <a href="#">
                  <i className="fa fa-dashboard" /> <span>Dashboard</span>
                  <span className="pull-right-container">
                    <i className="fa fa-angle-left pull-right" />
                  </span>
                </a>
           
                <ul className="treeview-menu">
            
    
                  <li className="active"><a >    
        <i className="fa fa-circle-o" /> <Link to="/dashboard">Dashboard v1   </Link></a></li> 
                  <li><a href="index2.html"><i className="fa fa-circle-o" /> Dashboard v2</a></li>
                </ul>
              </li> */}
            </ul>
          </section>
        </aside>
    </div>
  )
}

export default Sidebar