import React from 'react';

function Cart({
    handleModalShow,   
  cart,
  handleIncreaseQty,
  handleDecreaseQty,
  handleDeleteFromCart,
  total,
  paid,
  change,
  due,
  discountPercent,
  discountValue,
  handleDiscountChange,
  handleDiscountPercentChange,
  setPaid,
  handlePaidKeyPress,
  handleCheckout,
  handleOrder,
  selectedTable
}) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px' }}>
        <span style={{ fontSize: '20px', fontWeight: 'bold' }}>Your Cart</span>
        <span style={{ fontSize: '16px' }}>Table : {selectedTable}</span>
      </div>

      <div className="cart">
        <table className="table">
          <tbody>
            {cart.map((item) => (
              <tr key={item.id} style={{ backgroundColor: 'white', padding: '2px' }}>
               
                <td style={{ textAlign: 'left', width: 'auto' }}>{item.name}</td>
                <td style={{ width: 'auto' }}>
                 
                  {item.qty}
     
                </td>
                <td style={{ width: 'auto' }}>{item.rate}</td>
                <td style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: 'auto' }}>
                  <span
                    className="glyphicon glyphicon-trash delete-icon"
                    aria-hidden="true"
                    onClick={() => handleDeleteFromCart(item.id)}
                  ></span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="col-md-12">
        <div className="row" style={{ padding: '5px' }}>
          <div className="col-md-6 col-xs-6 text-center" style={{ backgroundColor: 'lightblue', padding: 5 }}>
            <span style={{ fontWeight: 'bold', fontSize: 20 }}>Total :</span>
          </div>
          <div className="col-md-6 col-xs-6 text-center" style={{ backgroundColor: 'lightgreen', padding: 5 }}>
            <span style={{ fontWeight: 'bold', fontSize: 20 }}>{total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="col-md-12">
        <div className="row" style={{ padding: '5px' }}>
          <button className="col-md-6 col-xs-6 text-center" onClick={handleModalShow} style={{ backgroundColor: 'lightblue', padding: 5 }}>
            <span style={{ fontWeight: 'bold', fontSize: 20 }}>Generate Bill</span>
          </button>
          <button className="col-md-6 col-xs-6 text-center" style={{ backgroundColor: 'lightgreen', padding: 5 }}>
            <span style={{ fontWeight: 'bold', fontSize: 20 }}>Dine in</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;
