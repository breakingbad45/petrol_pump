import React from 'react'
import { MdSpaceDashboard, MdRemoveRedEye, MdMenu, MdOutlineLogout ,MdOutlineAccountCircle} from "react-icons/md";
import { NavLink,useNavigate } from 'react-router-dom';
import '../Styles/adminlte.min.css'
import '../Script/adminlte.min.js'
import pb from '../utils/pocketbase';
// import $ from 'jquery'
// import 'bootstrap/dist/css/bootstrap.css';
import FullscreenToggle from './FullscreenToggle';

const Navigation = ({ children }) => {
  const navigate = useNavigate();
  const signOut = () =>{
    pb.authStore.clear()
    navigate('/')
  }
  const menu = [
    {
      path: '/dashboard',
      name: 'Dashboard',
      icon: <MdSpaceDashboard />
    },
    {
      path: '/reports',
      name: 'Reports',
      icon: <MdRemoveRedEye />
    },
    {
      path: '/',
      name: 'Log out',
      icon: <MdOutlineLogout />
    },
    {
      path: '/accounts',
      name: 'Accounts',
      icon: <MdOutlineAccountCircle />
    }
  ]
  const sidebarbg = {
    backgroundColor: '#353957',
  }


  return (
    <>
      <div className="wrapper">
        {/* Navbar */}
        <nav className="bg-indigo main-header navbar navbar-expand navbar-white navbar-light border-0">
          <ul className="navbar-nav">
            <li className="nav-item">
              <NavLink className="nav-link" data-widget="pushmenu"><MdMenu style={{ fontSize: '1.5em',color:'#fff' }} /></NavLink>
            </li>
          </ul>
          <ul className="navbar-nav ms-auto d-flex align-items-center justify-content-end">
            <li className="nav-item">
              <FullscreenToggle />
            </li>
            <li className="nav-item">
              <button onClick={signOut} className="btn btn-sm btn-link nav-link">
                Log out<MdOutlineLogout />
              </button>
            </li>
          </ul>
        </nav>

        <aside className="main-sidebar sidebar-dark-success elevation-4" style={sidebarbg}>
          <NavLink to="/" className="brand-link">
            <img src="/logo192.png" alt="E-Auction" className="brand-image img-circle elevation-3" />
            <span className="brand-text font-weight-light">E-Auction</span>
          </NavLink>
          <div className="sidebar">
            <nav className="mt-2">
              <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                {menu.map((item, i) => (
                  <li key={i} className="nav-item">
                    <NavLink to={item.path} className='nav-link'>
                      <i className="nav-icon">{item.icon}</i>
                      <p>{item.name}</p>
                    </NavLink>
                  </li>
                ))}
                
              </ul>
             
            </nav>
          </div>
        </aside>
        {/* /. Sidebar */}

        {/* Main Content */}
        <div className="content-wrapper bg-white">
          <div className="container-fluid">
            <main>{children}</main>
          </div>
        </div>
        {/* /. Main Content */}

        {/* Footer */}
        <footer className="main-footer">
          <div className="float-right">
         
          </div>
          <span>Copyright @2023-24 It Tech Point Bd </span>
        </footer>

        {/* /. Footer */}
      </div>
    </>
  )
}

export default Navigation