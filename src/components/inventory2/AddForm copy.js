


import React, { useState } from "react";
import CustomAutocomplete from "./CustomAutocomplete";
const productArray = [
  { id: 1, name: "Paracetamol", rate: 10 },
  { id: 2, name: "Ibuprofen", rate: 20 },
  { id: 3, name: "Amoxicillin", rate: 30 }
];

const AccountForm = () => {
  const [form, setForm] = useState({
    sale_type: "SELL",
    account_name: "AKHI AND APU TRADERS",
    license_no: "14555",
    remarks: "N/A",
    product: "",
    qty: 0,
    rate: 0,
    total: 0
  });

  const [cart, setCart] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({ qty: 0, rate: 0, total: 0 });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedForm = {
      ...form,
      [name]: name === "qty" || name === "rate" ? parseFloat(value) : value
    };
    if (name === "product") {
      const selected = productArray.find(p => p.id === parseInt(value));
      updatedForm.rate = selected ? selected.rate : 0;
    }
    updatedForm.total = updatedForm.qty * updatedForm.rate;
    setForm(updatedForm);
  };

  const handleAdd = () => {
    console.log("Form Data:", form);
    setCart([...cart, form]);
    setForm({ ...form, product: "", qty: 0, rate: 0, total: 0 });
  };

  const handleDelete = (index) => {
    const updatedCart = [...cart];
    updatedCart.splice(index, 1);
    setCart(updatedCart);
  };

  const openEditModal = (index) => {
    setEditIndex(index);
    setModalData(cart[index]);
    setShowModal(true);
  };

  const handleModalChange = (e) => {
    const { name, value } = e.target;
    const updated = {
      ...modalData,
      [name]: name === "qty" || name === "rate" ? parseFloat(value) : value
    };
    updated.total = updated.qty * updated.rate;
    setModalData(updated);
  };

  const handleUpdate = () => {
    const updatedCart = [...cart];
    updatedCart[editIndex] = modalData;
    setCart(updatedCart);
    setShowModal(false);
  };
const sampleData = [
  { id: '101', name: 'PAMA OIP KLT' },
  { id: '102', name: 'Banana' },
  { id: '103', name: 'Orange' },
];



  return (
    <div className="row">
      {/* Left Column */}
     
      <div className="col-md-6">
        <div className="box box-primary">
          <div className="box-header with-border">
            <h3 className="box-title">Account Info</h3>
          </div>
        <div className="box-body">
  <div className="form-group row">
    <label className="col-sm-4 control-label">Sell Type</label>
    <div className="col-sm-8">
      <select className="form-control" name="sale_type" value={form.sale_type} onChange={handleChange}>
        <option value="SELL">SELL</option>
        <option value="PURCHASE">PURCHASE</option>
      </select>
    </div>
  </div>
 <CustomAutocomplete
  data={sampleData}
  onSelect={(item) => console.log('Selected:', item)}
/>
  <div className="form-group row">
    <label className="col-sm-4 control-label">Account</label>
    <div className="col-sm-8">
      <input className="form-control" name="account_name" value={form.account_name} onChange={handleChange} />
    </div>
  </div>

  <div className="form-group row">
    <label className="col-sm-4 control-label">License</label>
    <div className="col-sm-8">
      <input className="form-control" name="license_no" value={form.license_no} readOnly />
    </div>
  </div>

  <div className="form-group row">
    <label className="col-sm-4 control-label">Remarks</label>
    <div className="col-sm-8">
      <input className="form-control" name="remarks" value={form.remarks} onChange={handleChange} />
    </div>
  </div>

  <div className="form-group row">
    <label className="col-sm-4 control-label">Product</label>
    <div className="col-sm-8">
      <select className="form-control" name="product" value={form.product} onChange={handleChange}>
        <option value="">Select</option>
        {productArray.map((p) => (
          <option key={p.id} value={p.id}>{p.name}</option>
        ))}
      </select>
    </div>
  </div>

  <div className="form-group row">
    <label className="col-sm-4 control-label">Qty</label>
    <div className="col-sm-8">
      <input className="form-control" type="number" name="qty" value={form.qty} onChange={handleChange} />
    </div>
  </div>

  <div className="form-group row">
    <label className="col-sm-4 control-label">Rate</label>
    <div className="col-sm-8">
      <input className="form-control" type="number" name="rate" value={form.rate} onChange={handleChange} />
    </div>
  </div>

  <div className="form-group row">
    <label className="col-sm-4 control-label">Total</label>
    <div className="col-sm-8">
      <input className="form-control" readOnly value={form.total.toFixed(2)} />
    </div>
  </div>

  <div className="form-group row">
    <div className="col-sm-offset-4 col-sm-8">
      <button className="btn btn-primary btn-block" onClick={handleAdd}>Add Cart</button>
    </div>
  </div>
</div>

        </div>
      </div>

      {/* Right Column - Cart List */}
      <div className="col-md-6">
        <div className="box box-success">
          <div className="box-header with-border">
            <h3 className="box-title">Cart List</h3>
          </div>
          <div className="box-body">
            <ul className="list-group">
              {cart.map((item, index) => (
                <li className="list-group-item" key={index}>
                  {item.product} - {item.qty} x {item.rate} = {item.total.toFixed(2)}
                  <div className="pull-right">
                    <button className="btn btn-xs btn-warning" onClick={() => openEditModal(index)}>Edit</button>{" "}
                    <button className="btn btn-xs btn-danger" onClick={() => handleDelete(index)}>Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Modal (React Controlled) */}
      {showModal && (
        <div className="modal-backdrop" style={styles.backdrop}>
          <div className="modal-dialog" style={styles.modal}>
            <div className="modal-content">
              <div className="modal-header">
                <h4>Edit Item</h4>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label>Qty</label>
                  <input className="form-control" name="qty" value={modalData.qty} onChange={handleModalChange} />
                </div>
                <div className="form-group">
                  <label>Rate</label>
                  <input className="form-control" name="rate" value={modalData.rate} onChange={handleModalChange} />
                </div>
                <div className="form-group">
                  <label>Total</label>
                  <input className="form-control" value={modalData.total.toFixed(2)} readOnly />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" onClick={handleUpdate}>Update</button>
                <button className="btn btn-default" onClick={() => setShowModal(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Minimal modal styling
const styles = {
  backdrop: {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 1050,
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  modal: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "5px",
    width: "400px"
  }
};

export default AccountForm;
