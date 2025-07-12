// src/components/Modal.js
import React from 'react';
import Modal from 'react-modal';
const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  };
Modal.setAppElement('#root'); // Set the app element for accessibility

function CustomModal({
  show,
  handleClose,
  total,
  subtotal,
  discountPercent,
  discountValue,
  paid,
  change,
  due,
  handleDiscountChange,
  handleDiscountPercentChange,
  setPaid,
  handlePaidKeyPress,
  handleCheckout
}) {
  return (
    <Modal
    isOpen={show}
   
    onRequestClose={handleClose}
    style={customStyles}
    contentLabel="Example Modal"
  >
   <div className="modal-body " style={{display:'flex',justifyContent:'space-between'}}>
        <h4>Bill Summary</h4>
        <button className="" onClick={handleClose}>X</button>
      </div>
      <table className="summary-table">
        <tr>
            <td className="amount">Subtotal </td>
            <td className="colon">:</td>
            <td className="amount">{subtotal}</td>
        </tr>
        <tr>
        <td className="amount">Discount <select value={discountPercent} onChange={(e)=>handleDiscountPercentChange(e)}>
                        <option value="0">%</option>
                        <option value="5">5%</option>
                        <option value="10">10%</option>
                      </select></td>
            <td className="colon">:</td>
            <td className="amount"><input type="text" className="editable-input" value={discountValue} onChange={handleDiscountChange} /></td>
        </tr>
        <tr>
        <td className="amount">Total</td>
            <td className="colon">:</td>
            <td className="amount">{total.toFixed(2)}</td>
        </tr>

        <tr>
        <td className="amount">Paid</td>
            <td className="colon">:</td>
            <td className="amount"><input type="text"  className="editable-input" value={paid} onChange={(e) => setPaid(Number(e.target.value))} onKeyPress={handlePaidKeyPress}/></td>
        </tr>

        <tr>
        <td className="amount">Change</td>
            <td className="colon">:</td>
            <td className="amount">{change.toFixed(2)}</td>
        </tr>
        <tr>
        <td className="amount">Due</td>
            <td className="colon">:</td>
            <td className="amount">{due.toFixed(2)}</td>
        </tr>
    </table>

            
             <div className="col-md-12 " >
  <div className="row" style={{padding:'5px'}}>
    <div className="col-md-6 text-center" style={{backgroundColor: 'lightblue', padding: 5}}>
      <span style={{fontWeight: 'bold', fontSize: 20}}>Total :</span>
    </div>
    <div className="col-md-6 text-center" style={{backgroundColor: 'lightgreen', padding: 5}}>
      <span style={{fontWeight: 'bold', fontSize: 20}}>{total.toFixed(2)}</span>
    </div>
  </div>
</div>

<div className="modal-footer">
        <button onClick={handleCheckout}>Print & Checkout</button>
      </div>

  </Modal>
  );
}

export default CustomModal;
