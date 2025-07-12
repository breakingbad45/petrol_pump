import React, { useState } from "react";
import VehicleMask from "./VehicleMask";
const products = [
  { id: 1, product_name: 'অকটেন', rate: 100 },
  { id: 2, product_name: 'পেট্রোল', rate: 200 },
  { id: 3, product_name: 'ডিজেল', rate: 300 },
  { id: 4, product_name: 'এলপিজি', rate: 400 },
  { id: 5, product_name: 'ইঞ্জিন অয়েল', rate: 500 },
  { id: 6, product_name: 'গিয়ার অয়েল', rate: 600 },
  { id: 7, product_name: 'ব্রেক অয়েল', rate: 700 },
  { id: 8, product_name: 'গ্রীজ', rate: 800 },
  { id: 9, product_name: 'পরিশোধিত পানি', rate: 100 },
  { id: 10, product_name: 'বিবিধ', rate: 200},
];


const InvoiceForm = () => {
  const [form, setForm] = useState({
    date: "",
    vehicle_no: "",
    product: "",
    rate: "",
    qty: "",
    total: "",
  });

  const [cart, setCart] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // When product is selected, update rate
    if (name === "product") {
      const selected = products.find((p) => p.id.toString() === value);
      setForm((prev) => ({
        ...prev,
        product: value,
        rate: selected?.rate || "",
        qty: 1,
        total:selected?.rate*1,
      }));
    } else if (name === "qty") {
      const qty = Number(value);
      const rate = Number(form.rate);
      const total = qty && rate ? qty * rate : "";
      setForm((prev) => ({
        ...prev,
        qty: value,
        total: total,
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddToCart = (e) => {
    e.preventDefault();

    const selectedProduct = products.find((p) => p.id.toString() === form.product);
    if (!selectedProduct) return alert("Please select a valid product.");

    const newItem = {
      ...form,
      product_name: selectedProduct.product_name,
    };

    setCart((prev) => [...prev, newItem]);

    setForm({
      date: "",
      vehicle_no: "",
      product: "",
      rate: "",
      qty: "",
      total: "",
    });
  };

  const handleSubmitCart = () => {
    console.log("Submitted Cart:", cart);
  };


 const handlePrint = () => {
  const printWindow = window.open('', '_blank');

  const generateTableRows = () => {
    return products.map(p => {
      const item = cart.find(c => c.product_name === p.product_name);
      return `
        <tr>
          <td style="text-align: left; padding-left: 5px; font-weight: bold;">${p.product_name}</td>
          <td>${item ? item.qty : ''}</td>
          <td>${item ? item.rate : ''}</td>
          <td>${item ? item.total : ''}</td>
          <td></td>
        </tr>
      `;
    }).join('');
  };

  const rows = generateTableRows();

  const totalAmount = cart.reduce((sum, item) => sum + Number(item.total), 0);

  const formatDate = (d) => {
    if (!d) return "";
    const date = new Date(d);
    return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth()+1).padStart(2, '0')}/${date.getFullYear()}`;
  };

  const date = formatDate(form.date);
  const vehicle = form.vehicle_no || '';

  const invoiceHTML = `
    <!DOCTYPE html>
    <html lang="bn">
    <head>
      <meta charset="UTF-8">
      <title>Invoice Copy</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@500&display=swap');
        body { font-family: "Hind Siliguri", sans-serif; padding: 20px; background: #f0f0f0; }
        .invoice-container { display: flex; gap: 20px; justify-content: center; }
        .invoice { width: 400px; padding: 10px; background: white; position: relative; }
        .header { text-align: center; margin-bottom: 5px; position: relative; }
        .left-logo { position: absolute; left: 15px; top: 35px; }
        .right-logo { position: absolute; right: 10px; top: 35px; }
        .header h2 { font-size: 19px; color: red; margin: 5px 0; }
        .header p { margin: 2px 0; font-size: 12px; }
        .info { font-size: 12px; margin-bottom: 5px; }
        .info span { display: inline-block; width: 49%; }
        table { width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 10px; }
        table, th, td { border: 1px solid #000; }
        th, td { padding: 0px; text-align: center; }
        .footer { font-size: 12px; display: flex; justify-content: space-between; margin-top: 10px; }
        .signature { text-align: right; font-size: 12px; margin-top: 20px; }
        .copy-label { position: absolute; top: -12px; left: 10px; background: white; padding: 0 5px; font-size: 12px; color: red; font-weight: bold; }
        .vertical-dashed-line { border-left: 1px dashed black; height: 480px; }
      </style>
    </head>
    <body>
      <div class="invoice-container">
        ${['কাস্টমার কপি', 'অফিস কপি'].map(copyLabel => `
          <div class="invoice">
            <div class="copy-label">${copyLabel}</div>
            <div class="header">
              <img src="./bashundhara.png" height="50" class="left-logo" />
              <h2>মেসার্স তেতুলিয়া ফিলিং স্টেশন এন্ড এল.পি.জি</h2>
              <p>ডিলারঃ পদ্মা অয়েল কোম্পানী লিমিটেড</p>
              <p>প্রঃ মোঃ আবুল কালাম আজাদ</p>
              <p>ভজনপুর, তেতুলিয়া, পঞ্চগড়।</p>
              <img src="./bashundhara.png" height="45" class="right-logo" />
            </div>
            <div class="info">
              <span>গাড়ী নং: ${vehicle}</span>
              <span style="text-align:right;">তারিখ: ${date}</span>
            </div>
            <table>
              <thead>
                <tr>
                  <th>পণ্যের নাম</th>
                  <th>পরিমাণ</th>
                  <th>দর</th>
                  <th>টাকা</th>
                  <th>প্রাপ্তি</th>
                </tr>
              </thead>
              <tbody>${rows}</tbody>
            </table>
            <div class="footer">
              <div>মোট টাকা: ${totalAmount}</div>
              <div>কথায়: ..........................................</div>
            </div>
            <div class="signature">
              স্বাক্ষর<br>
              কাশিয়ার/ম্যানেজার
            </div>
          </div>
        `).join('<span class="vertical-dashed-line"></span>')}
      </div>
    </body>
    </html>
  `;

  printWindow.document.write(invoiceHTML);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
};



  return (
    <>
      <section className="col-lg-6 connectedSortable">
        <div className="box box-danger">
          <div className="tab-content no-padding">
            <div className="box-header header-custom">
              <h3 className="box-title">Invoice Form</h3>
            </div>
            <form className="form-horizontal" onSubmit={handleAddToCart}>
              <div className="box-body">
                <div className="form-group">
                  <label className="col-sm-4 control-label">Sell_type</label>
                  <div className="col-sm-8">
                    <input
                      required
                      className="form-control"
                      type="date"
                      name="date"
                      value={form.date}
                      onChange={handleChange}
                    />
                  </div>
                </div>
<VehicleMask
          name="vehicle_no"
          value={form.vehicle_no}
          onChange={handleChange}
          className="col-span-1 border p-1"
        />
                <div className="form-group">
                  <label className="col-sm-4 control-label">Product</label>
                  <div className="col-sm-8">
                    <select
                      required
                      className="form-control"
                      name="product"
                      value={form.product}
                      onChange={handleChange}
                    >
                      <option value="">Select Product</option>
                      {products.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.product_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="col-sm-4 control-label">Qty</label>
                  <div className="col-sm-8">
                    <input
                      required
                      className="form-control"
                      type="number"
                      name="qty"
                      value={form.qty}
                      onChange={handleChange}
                      placeholder="Quantity"
                      autoComplete="off"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="col-sm-4 control-label">Rate</label>
                  <div className="col-sm-8">
                    <input
                      required
                      className="form-control"
                      type="number"
                      name="rate"
                      value={form.rate}
                      onChange={handleChange}
                      placeholder="Rate"
                      autoComplete="off"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="col-sm-4 control-label">Total</label>
                  <div className="col-sm-8">
                    <input
                      required
                      className="form-control"
                      type="number"
                      name="total"
                      value={form.total}
                      readOnly
                      placeholder="Total"
                    />
                  </div>
                </div>

                <div className="box-footer">
                  <button type="button" className="btn bg-maroon">
                    Cancel
                  </button>
                  <button type="submit" className="btn bg-navy pull-right">
                    Add to Cart
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Cart Table and Actions */}
      <section className="col-lg-6 connectedSortable">
        <div className="box box-success">
          <div className="box-header with-border">
            <h3 className="box-title">Cart Items</h3>
          </div>
          <div className="box-body table-responsive">
            <table className="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Vehicle No</th>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Rate</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {cart.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center">
                      No items in cart
                    </td>
                  </tr>
                ) : (
                  cart.map((item, index) => (
                    <tr key={index}>
                      <td>{item.date}</td>
                      <td>{item.vehicle_no}</td>
                      <td>{item.product_name}</td>
                      <td>{item.qty}</td>
                      <td>{item.rate}</td>
                      <td>{item.total}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {cart.length > 0 && (
            <div className="box-footer text-right">
              <button onClick={handleSubmitCart} className="btn btn-success">
                Submit
              </button>
              <button onClick={handlePrint} className="btn btn-primary" style={{ marginLeft: "10px" }}>
                Print
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default InvoiceForm;
