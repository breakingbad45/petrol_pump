import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import {
  editcartActive,
  deleteCart,
  updatePaidValue,
  updateDiscountValue,
  updateLoadUnloadValue
} from "../../features/inventory/inventorySlice";

const CartBody = () => {
  const dispatch = useDispatch();
  const { loaddata,cart, discountValue, paidValue, loadUnloadValue, editing } = useSelector((state) => state.inventory) || {};

  const handleChangeLoadUnload = (e) => {
    dispatch(updateLoadUnloadValue(e.target.value));
  };

  const handleChangeDiscount = (e) => {
    dispatch(updateDiscountValue(e.target.value));
  };
  
  const handleChangePaid = (e) => {
    dispatch(updatePaidValue(e.target.value));
  };

  const [netT, setnetT] = useState(0);

  useEffect(() => {
    const total = cart.reduce((sum, item) => sum + Number(item.total_tk), 0);
    const net_total = total - Number(discountValue) + Number(loadUnloadValue) - Number(paidValue);
    setnetT(net_total.toFixed(2));
    const b_t_Status=cart[0]?.bill_type==="CASH"

    if(b_t_Status){
      dispatch(updatePaidValue(cart.reduce((sum, item) => sum + Number(item.total_tk), 0)));
    }
  }, [cart, discountValue, paidValue, loadUnloadValue,dispatch]);

  useEffect(() => {


    if (editing.length !== undefined) {
      const additionalData = loaddata;
      const discount = additionalData ? Number(additionalData.split('-')[0]) : 0;
      const loadUnload = additionalData ? Number(additionalData.split('-')[1]) : 0;
      const paid = additionalData ? Number(additionalData.split('-')[2]) : 0;
  
      dispatch(updateDiscountValue(discount));
      dispatch(updateLoadUnloadValue(loadUnload));
      dispatch(updatePaidValue(paid));
    }
  }, [editing, dispatch,loaddata]);
  
  return (
    <>
      <div style={{ height: "250px", overflowY: "auto" }}>
        {cart.length > 0 ? (
          <table className="table table-bordered table-striped">
            <thead style={{ background: "aquamarine" }}>
              <tr>
                <th>#</th>
                <th>Product</th>
                <th>Qty</th>
                <th>Rate</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{item.expand !== undefined ? item.expand.product_id.name : item.product_name}</td>
                  <td style={{ textAlign: "right" }}>{Number(item.unit_2).toFixed(2)}</td>
                  <td style={{ textAlign: "right" }}>{Number(item.s_rate).toFixed(3)}</td>
                  <td style={{ textAlign: "right" }}>{Number(item.total_tk).toFixed(2)}</td>
                  <td style={{ textAlign: "right" }}>
                    <div className="btn-group">
                      <button onClick={() => dispatch(editcartActive(item))} type="button" className="btn bg-navy btn-xs">
                        <i className="fa fa-edit" />
                      </button>
                      <button className="btn bg-maroon btn-xs" onClick={() => dispatch(deleteCart(item))}>
                        <i className="fa fa-trash" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="2"></td>
                <td style={{ textAlign: "right", fontWeight: "bold" }}>{cart.reduce((sum, item) => sum + Number(item.unit_1), 0).toFixed(2)}</td>
                <td style={{ textAlign: "right", fontWeight: "bold" }}></td>
                <td></td>
                <td style={{ textAlign: "right", fontWeight: "bold" }}>{cart.reduce((sum, item) => sum + Number(item.total_tk) , 0).toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        ) : (
          <div className="text-center p-5">
            <img src="https://cdni.iconscout.com/illustration/premium/thumb/empty-cart-7359557-6024626.png" alt="img" className="img-fluid" style={{ width: "100px", height: "100px" }} />
            <h4>Your cart is empty !!</h4>
          </div>
        )}
      </div>

      <table className="">
        <tbody>
          <tr>
            <td width="60%" ></td>
            <td width="20%" ><strong>DISCOUNT</strong></td>
            <td width="10%" align="center" > :</td>
            <td width="20%" align="right" ><input style={{ textAlign: 'right' }} type="text" className="form-group" name="discount" value={discountValue} onChange={handleChangeDiscount} /></td>
          </tr>
          <tr>
            <td width="60%" ></td>
            <td width="20%" ><strong>LOAD/UNLOAD</strong></td>
            <td width="10%" align="center" > :</td>
            <td width="20%" align="right" ><input type="text" style={{ textAlign: 'right' }} className="form-group" name="loadunload" value={loadUnloadValue} onChange={handleChangeLoadUnload} /></td>
          </tr>
          <tr>
            <td width="50%" ></td>
            <td width="20%" ><strong>PAID</strong></td>
            <td width="10%" align="center" > :</td>
            <td width="20%" align="right" ><input type="text" style={{ textAlign: 'right' }} className="form-group" name="paid" value={paidValue} onChange={handleChangePaid} /></td>
          </tr>
          <tr>
            <td width="50%" ></td>
            <td width="20%" ><strong>DUE</strong></td>
            <td width="10%" align="center" > :</td>
            <td width="20%" align="right" ><input type="text" style={{ textAlign: 'right' }} className="form-group" name="" value={netT} readOnly /></td>
          </tr>
        </tbody>
      </table>
    </>
  );
}

export default CartBody;
