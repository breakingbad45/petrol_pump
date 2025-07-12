import React from 'react'
import pb from '../../utils/pocketbase'
import { useDispatch, useSelector } from "react-redux";
const fuser = localStorage.getItem('user');
const user =JSON.parse(fuser)

const Header = () => {
  const { loaddata,cart, discountValue, paidValue, loadUnloadValue, editing } = useSelector((state) => state.inventory) || {};

  return (
    <div className="row">
    <div className="col-sm-8 col-xs-12">
      <img src="./assets/akhiinternational.png" style={{float: 'left', overflow: 'hidden', width: 100, marginRight: 15, marginBottom: 10}} />    
      <div>
        <h4 className="text-capitalize">{user.company}</h4>
        <span>{user.address}</span><br />
        <span>Phone: {user.contact}</span><br />
        <span>Email: {user.email}</span>
      </div>
    </div>
    <div className="col-sm-4 col-xs-12 text-center">
      <h1 style={{backgroundColor:'#ecc409',color:'#004345',fontWeight:'bold',padding:'5'}}>৳ {cart.reduce((sum, item) => sum + Number(item.unit_2) * Number(item.s_rate), 0).toFixed(2)}</h1>
    </div>
  </div>

  )
}

export default Header