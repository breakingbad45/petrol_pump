import React from 'react'
import Header from './Header'
import CartBody from './CartBody'
const CartItem = () => {
  return (


<section className="col-lg-8 connectedSortable">
  <div className="box box-primary">
    <div className="box-header header-custom">
      <h3 className="box-title">Details</h3>
    </div>
    <div className="box-tools pull-right">
    </div>
    <div className="box-body form-horizontal">
      <div className="box-body">
        <div id="cart_i">
          <div>
       
          <Header/>
 <CartBody/>

     
        </div>
      </div>     {/*  <input type="submit" name="create_pdf" class="btn btn-danger" value="Get Report" />   */}
    </div>
  </div>
  </div>
  </section>


  )
}

export default CartItem