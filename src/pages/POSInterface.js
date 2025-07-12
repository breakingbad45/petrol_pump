import React, { useState, useEffect ,useRef} from "react";
import FormField from "../components/reuseable/FormField3";
import axiosInstance from "../utils/axios";
import { Link,useLocation ,useNavigate} from "react-router-dom";


const categories = [
  {
    name: "জিয়াই ফিটিংস",
    subcategories: [

      "এলবো",
      "টি",
      "জয়েন সকেট",
      "R সকেট",
      "ইউনিয়ন",
    ],
  },
  {
    name: "PVC ফিটিংস",
    subcategories: [

      "এলবো",
      "টি",
      "জয়েন সকেট",
      "R সকেট",
      "ইউনিয়ন",
      "বন ফ্লাগ",
      "এলবো ব্রাশ",
      "টি ব্রাশ",
      "R সকেট ব্রাশ"
    ],
  },
  {
    name: "C.P.V.C ফিটিংস",
    subcategories: [

      "এলবো",
      "এলবো ব্রাশ",
      "টি",
      "জয়েন সকেট",
      "R সকেট",
      "টি ব্রাশ",
      "লং কেন",
      "ফিমেল সকেট ব্রাশ",
      "মেল সকেট ব্রাশ",
      "চাবি",
      "আটা",
      "পাইপ"
      
    ],
  },
  {
    name: "SANITARY ফিটিংস",
    subcategories: [
      "থ্রেট পাইপ",
      "U.P.V.C পাইপ",
      "প্লেন বেন",
      "প্লেন টি",
      "লোকাল বেন",
      "লোকাল টি",
      "প্লেন বেন লোকাল",
      "প্লেন টি লোকাল",
      "ডোর বেন",
      "বেন ডোর",
      "ডোর টি",
      "বেগ ডোর টি",
      "টি",
      "অফসাইড বেন",
      "লংট্রাপ বেন",
      "সট্ট্রাপ বেন",
      "ইনকেপ",
      "কেপ",
      "জালি",
      "নেট",
      "বেন",
      "কয়েল পাইপ"


    ],
  },
  {
    name: "বাথরুম ফিটিংস ",
    subcategories: ["PVC","METAL"],
  },
  {
    name: "বডিং",
    subcategories: ["পাইপ","ফিল্টার"],
  },
  {
    name: "টিবওয়েল",
    subcategories: [],
  },
];



const customers = [
  { id: 1, name: "Walk-in Customer" },
  { id: 2, name: "Ravi Kumar" },
  { id: 3, name: "Sunita Sharma" },
];

const ProductCart = () => {
  const [selectedCategory, setSelectedCategory] = useState(categories[0].name);
  const [selectedSubCategory, setSelectedSubCategory] = useState(
    categories[0].subcategories[0] || ""
  );
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(1);
  const [discount, setDiscount] = useState(0);
  const [paid, setPaid] = useState(0);
  const [billDate, setBillDate] = useState(
    () => new Date().toISOString().split("T")[0]
  );
  const qtyRefs = useRef({});
  const rateRefs = useRef({});


  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch products from backend on component mount
    const fetchProducts = async () => {
      try {
        const response = await fetch("https://petrolpump.fahimtraders.com/backend/commondata/getProducts.php"); // Adjust URL if needed
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const result = products.filter(
      (p) =>
        p.category === selectedCategory &&
        (!selectedSubCategory ||
          p.s_category === selectedSubCategory ||
          p.s_category === "")
    );
    setFilteredProducts(result);
  }, [selectedCategory, selectedSubCategory,products]);

const [invid, setinvid] = useState();
  const handleSubmit = async () => {
    const datetime = Date.now().toString();
  setinvid(datetime);
    // Basic validation
    if (cart.length === 0) {
      alert("Cart is empty. Please add at least one item.");
      return;
    }
  
    if (!selectedCustomer) {
      alert("Please select a customer.");
      return;
    }
  
    const order = {
      invid:datetime,
      sell_type: sellType,
      bill_type: billType,
      remarks: remarks,
      customer: selectedCustomer,
      billDate,
      items: cart,
      discount,
      paid,
      grandTotal,
      due,
    };
  
    console.log("Order submitted:", order);
  
    try {
      const response = await fetch("https://petrolpump.fahimtraders.com/backend/inventory/createDatanew.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(order),
      });
  
      if (!response.ok) {
        throw new Error("Failed to submit order");
      }
  
      const result = await response.json();


      if (window.confirm("Order Submitted Successfully!\nDo you want to print the receipt?")) {
       handlePrint(result.inv_id,result.date) // User clicked OK
      } else {
        // User clicked Cancel — do nothing or add your logic here
      }
      
      // Reset form state if needed
      setCart([]);
      setRemarks("");
      setPaid(0);
      setDiscount(0);
      setSelectedCustomer(null);
      window.location.reload();
      // s(0);
      // setDue(0);
    } catch (error) {
      console.error("Error submitting order:", error);
      alert("There was an error submitting the order. Please try again.");
    }
  };
  
  
  const handlePrint = (inv_id,date) => {
    const customer = customers.find((c) => c.id === selectedCustomer);
    const netTotal = cart.reduce((sum, item) => sum + item.qty * item.price, 0);
    const grandTotal = netTotal - discount;
    const due = grandTotal - paid;
  
    const html = `
      <html>
      <head>
        <title>Cash Memo</title>
        <style>
          @page { size: A4 potrait; margin: 10mm; }
          * { box-sizing: border-box; }
          body { margin: 0; font-family: Arial, sans-serif; font-size: 12px; }
          .invoice-container { display: flex; justify-content: space-between; gap: 20px; padding: 10px; }
          .invoice { width: 100%; border-right: 1px dashed #000; padding: 10px; }
          .center { text-align: center; }
    .bordered-table tbody {
  font-size: 12px !important;
}

          .bordered-table { width: 100%; border-collapse: collapse; margin-top: 10px; table-layout: fixed; }
          .bordered-table thead th { border: 1px solid #000; padding: 1px 6px; }
          .bordered-table td { border-left: 1px solid #000; border-right: 1px solid #000; padding: 1px 6px; height: 10px; vertical-align: top; overflow: hidden; text-overflow: ellipsis; }
          .bordered-table tr:last-child td { border-bottom: 1px solid #000; }
          .footer { margin-top: 20px; display: flex; justify-content: space-between; font-size: 10px; }
          .signature { margin-top: 30px; text-align: right; font-style: italic; }
          .bold { font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          ${[1, 2].map(() => `
            <div class="invoice">
              <div class="center">
                <div style="font-size: 10px;">CASH MEMO</div>
                <h2 style="margin: 0;">M/S AK AZAD TILES & SANITARY</h2>
                <div class="bold">Hardware & Sanitary Goods</div>
                <div>Bhajanpur, Tetulia, Panchagarh</div>
                <br/>
                <div><strong>Cash Memo No.</strong> ${inv_id} &nbsp;&nbsp;&nbsp; <strong>Date:</strong> ${date}</div>
              </div>
  
              <p style="margin: 6px 0;"><strong>To,</strong><br/>
              ${customer?.name}<br/></p>
              ${remarks}<br/></p>
  
              <table class="bordered-table">
                <thead>
                  <tr>
                    <th style="width: 10%;">Sl.</th>
                    <th>Description of Goods</th>
                    <th style="width: 15%;">Qty/Unit</th>
                    <th style="width: 20%;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${cart.map((item, i) => `
                    <tr>
                      <td>${i + 1}</td>
                      <td>${item.name}</td>
                      <td align="center">${item.qty}</td>
                      <td align="right">${item.qty * item.price}</td>
                    </tr>
                  `).join("")}
                  ${Array(30 - cart.length).fill().map(() => `
                    <tr><td></td><td></td><td></td><td></td></tr>
                  `).join("")}
                 
                  <tr style="border-top:1px solid black">
                    <td colspan="2" rowspan="3" style="border: none;"></td>
                    <td style="border:1px solid black">Discount</td>
                    <td style="border:1px solid black;text-align:right">${discount || 0}/-</td>
                  </tr>
                 
                  <tr>
                    <td style="border:1px solid black">Paid</td>
                    <td style="border:1px solid black;text-align:right">${paid || 0}/-</td>
                  </tr>
                  <tr>
                    <td style="border:1px solid black"><strong>Net</strong></td>
                    <td style="border:1px solid black;text-align:right"><strong>${grandTotal}/-</strong></td>
                  </tr>
                </tbody>
              </table>
  
              <div class="footer">
                <div>White Original copy<br/>Pink duplicate Copy</div>
                <div>Rate Incl. Vat</div>
                <div><strong>FOR MAHADEV ENTERPRISES</strong></div>
              </div>
  
              <div class="signature">Authorised Signature</div>
            </div>
          `).join("")}
        </div>
      </body>
      </html>
    `;
  
    const printWindow = window.open('', '', 'width=800,height=800');
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.document.close();

  };
  
  
  
  
  
  
  const handleCancel = () => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      setCart([]);
      setDiscount(0);
      setPaid(0);
      setBillDate(new Date().toISOString().split("T")[0]);
      setSelectedCustomer(customers[0].id);
    }
  };
  

  const addToCart = (product) => {
    setCart((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      if (exists) {
        return prev.map((p) =>
          p.id === product.id ? { ...p, qty: p.qty + 1 } : p
        );
      }
      return [...prev, { ...product, qty: 1, price: product.price || 0 }];
    });
  
    // Focus qty input after cart is updated and DOM is rendered
    setTimeout(() => {
      qtyRefs.current[product.id]?.focus();
      qtyRefs.current[product.id]?.select();
    }, 0);
  };
  

  const updateQty = (id, value) => {
    const qty = Math.max(1, parseInt(value) || 1); // prevent 0 or NaN
    setCart((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, qty } : p
      )
    );
  };
  

  const updateRate = (id, rate) => {
    setCart((prev) =>
      prev.map((p) => (p.id === id ? { ...p, price: parseFloat(rate) } : p))
    );
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((p) => p.id !== id));
  };

  const total = cart.reduce((acc, item) => acc + item.qty * item.price, 0);
  const grandTotal = total - discount;
  const due = Math.max(grandTotal - paid, 0);

  const currentCategory = categories.find((c) => c.name === selectedCategory);
  const hasSubcategories = currentCategory?.subcategories.length > 0;

  const [types, settypes] = useState([]);

  const fetchAc = async () => {
    try {
      const response = await axiosInstance.get("/commondata/getAccounts.php");

  
      const updatedAcarray = response?.data?.map((item) => ({
        value: item.id,
        label: item.name,
        address: item.address,
        contact: item.contact,
        actype: item.type,
        balance: item.balance,
      }));
  
      return updatedAcarray;
    } catch (error) {
      console.error("Error:", error);
      return [];
    }
  };

useEffect(()=>{


(async()=>{
//   const records = await pb.collection('Eligibility').getFullList({
//     sort: '-created',
// });
// localStorage.setItem('sale', JSON.stringify(records));
const acData = await fetchAc();
settypes(acData)
})()


},[])
const [billType, setBillType] = useState("CASH");
  const [sellType, setSellType] = useState("SELL");
  const [remarks, setRemarks] = useState("N/A");

  
  return (
    <div className="container-fluid">
      <div className="row">
    
        
        {/* Left: Products */}
        <div className="col-md-7">
          
          <div style={{padding:'2px',background:'#2a89ff',color:'white',borderBottom:'3px solid blue'}}>
              <h4 style={{textAlign:'center',fontWeight:'bold'}}>M/S AK AZAD TILES & SANITARY</h4>
             <button type=""> <Link to="/dashboard">Back</Link> </button>
              </div>
          {/* Category Buttons */}
          <div className="row" style={{paddingLeft:'15px'}}>
            {categories.map((cat) => (
              <div
                key={cat.name}
                onClick={() => {
                  setSelectedCategory(cat.name);
                  setSelectedSubCategory(cat.subcategories[0] || "");
                }}
                className={`category-button btn ${
                  selectedCategory === cat.name ? "btnactive" : "btn-default"
                }`}
                style={{ marginRight: 5, cursor: "pointer" }}
                onMouseEnter={(e) => e.currentTarget.classList.add("btn-info")}
                onMouseLeave={(e) => {
                  if (selectedCategory !== cat.name)
                    e.currentTarget.classList.remove("btn-info");
                }}
              >
                {cat.name}
              </div>
            ))}
          </div>

          {/* Subcategories */}
          <div className="row" style={{ marginTop: 15 }}>
            <div className="col-sm-3 sub-category-scroll">
              <div style={{padding:'2px',background:'#2a89ff',color:'white',borderBottom:'3px solid blue'}}>
              <h4 style={{textAlign:'center',fontWeight:'bold'}}>{selectedCategory}</h4>
                
              </div>
      
              {hasSubcategories ? (
                currentCategory.subcategories.map((sub) => (
                  <div
                    key={sub}
                    onClick={() => setSelectedSubCategory(sub)}
                    className={`btn btn-block ${
                      selectedSubCategory === sub ? "btn-info" : "btn-default"
                    }`}
                    style={{ marginBottom: 5, cursor: "pointer" }}
                  >
                    {sub}
                  </div>
                ))
              ) : (
                <div style={{ textAlign: "center", marginTop: 20 }}>
                  <img src="./assets/error.png" alt="No Subcategory Found" />
                  <p>No subcategory found</p>
                </div>
              )}
            </div>

            {/* Products List */}
            <div className="col-sm-9 product-scroll">
              <input
                type="text"
                className="form-control"
                placeholder="Search products"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ marginBottom: 10 }}
              />
         
         <div className="row" style={{ padding: '15px' }}>
  <table className="table table-bordered" style={{ backgroundColor: '#fff' ,padding: '15px'}}>
    <thead style={{background:'darkturquoise'}}>
      <tr>
        <th>Sl</th>
        <th>Product</th>
        <th>Brand</th>
        <th>Stock</th>
      </tr>
    </thead>
    <tbody>
      {filteredProducts
        .filter((p) =>
          p.name.toLowerCase().includes(search.toLowerCase())
        )
        .map((product,i) => (
          <tr
  key={product.id}
  onClick={() => addToCart(product)}
  className={`custom-row ${
    cart.some((item) => item.id === product.id) ? "selected-row" : ""
  }`}
  style={{ cursor: "pointer" }}
>
            <td className="custom-td">{i+1}</td>
            <td className="custom-td">{product.name}</td>
            <td className="custom-td">{product.brand}</td>
            <td className="custom-td">{product.rate}</td>
          </tr>
        ))}
    </tbody>
  </table>
</div>

            </div>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="col-md-5">
          <div className="panel-order" style={{ height: "100%" }}>
            <h4>
              <span className="glyphicon glyphicon-list-alt" /> Order Summary
            </h4>
            <form className="form-horizontal">
            <div className="form-group">
        <label htmlFor="billType" className="col-sm-4 control-label">
          Bill Type
        </label>
        <div className="col-sm-8">
          <label style={{ marginRight: "10px" }}>
            <input
              type="radio"
              name="billType"
              className="flat-red"
              value="CASH"
              checked={billType === "CASH"}
              onChange={() => setBillType("CASH")}
            />
            {" "}CASH
          </label>
          <label>
            <input
              type="radio"
              name="billType"
              className="flat-red"
              value="CREDIT"
              checked={billType === "CREDIT"}
              onChange={() => setBillType("CREDIT")}
            />
            {" "}CREDIT
          </label>
        </div>
      </div>

      {/* Sell Type */}
      <div className="form-group">
        <label htmlFor="sellType" className="col-sm-4 control-label">
          Sell Type
        </label>
        <div className="col-sm-8">
          <select
            className="form-control"
            value={sellType}
            onChange={(e) => setSellType(e.target.value)}
          >
            <option value="SELL">SELL</option>
            <option value="PUR">PURCHASE</option>
            <option value="RETURN">RETURN</option>
          </select>
        </div>
      </div>

      {/* Remarks */}
      <div className="form-group">
        <label htmlFor="remarks" className="col-sm-4 control-label">
          Remarks
        </label>
        <div className="col-sm-8">
          <input
            type="text"
            name="remarks"
            id="remarks"
            className="form-control"
            placeholder="Remarks"
            autoComplete="off"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            required
          />
        </div>
      </div>

      {billType === "CREDIT" && (
  <div className="form-group">
    <FormField
      sl={0}
      // handleKeyPress={"handleKeyPress"}
      label="A/C"
      name="ac_name"
      value={selectedCustomer}
      onChange={(value) => setSelectedCustomer(value)}
      type="select"
      options={types.map((type) => ({
        value: type.value,
        label: type.label,
        address: type.address,
        contact: type.contact,
        type: type.actype
      }))}
    />
  </div>
)}

    </form>

          
            {/* <div className="form-group">
              <label>Date:</label>
              <input
                type="date"
                className="form-control"
                value={billDate}
                onChange={(e) => setBillDate(e.target.value)}
              />
            </div> */}



            <div className="cart-table-wrapper">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Total</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
         

                  {cart.map((item,i) => (
                    <tr key={item.id}>
                      <td>{i+1}</td>
                      <td>{item.name}</td>
                      <td>
                      <input
                          type="number"
                          value={item.qty}
                          ref={(el) => (qtyRefs.current[item.id] = el)}
        onChange={(e) =>
          setCart((prev) =>
            prev.map((p) =>
              p.id === item.id ? { ...p, qty: +e.target.value } : p
            )
          )
        }
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            rateRefs.current[item.id]?.focus();
            rateRefs.current[item.id]?.select();
          }
        }}
                          style={{ width: 60 }}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={item.price}
                          ref={(el) => (rateRefs.current[item.id] = el)}
        onChange={(e) =>
          setCart((prev) =>
            prev.map((p) =>
              p.id === item.id ? { ...p, price: +e.target.value } : p
            )
          )
        }
                          style={{ width: 60 }}
                        />
                      </td>
                      <td>₹{(item.qty * item.price).toFixed(2)}</td>
                      <td>
                        <button onClick={() => removeFromCart(item.id)}>
                          x
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="container-fluid" style={{ maxWidth: 600, padding: 0, margin: 0 }}>
  {/* Row 1: Discount and Paid */}
  <div className="row" style={{ margin: 0 }}>
    {/* Discount */}
    <label className="col-sm-1 control-label text-right" style={{ padding: 0 }}>DISCOUNT</label>
    <div className="col-sm-1 text-center" style={{ padding: 0 }}>:</div>
    <div className="col-sm-2" style={{ padding: 0 }}>
      <input
        type="text"
        value={discount}
        onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
        className="form-control text-right"
        style={{ margin: 0 }}
      />
    </div>
    {billType === "CREDIT" && (

  <>
  <label className="col-sm-1 control-label text-right" style={{ padding: 0 }}>PAID</label>
  <div className="col-sm-1 text-center" style={{ padding: 0 }}>:</div>
  <div className="col-sm-2" style={{ padding: 0 }}>
    <input
      type="text"
      value={paid}
      onChange={(e) => setPaid(parseFloat(e.target.value) || 0)}
      className="form-control text-right"
      style={{ margin: 0 }}
    />
  </div>
  </>
    )}
  
     {/* Total */}
     <label className="col-sm-1 control-label text-right" style={{ padding: 0 }}>TOTAL</label>
    <div className="col-sm-1 text-center" style={{ padding: 0 }}>:</div>
    <div className="col-sm-2" style={{ padding: 0 }}>
      <input
        type="text"
        value={total.toFixed(2)}
        readOnly
        className="form-control text-right"
        style={{ margin: 0 }}
      />
    </div>
  </div>

  {/* Row 2: Total, G.Total, Due */}
  <div className="row" style={{ margin: 0, marginTop: 5 }}>
   

    {/* Grand Total */}
    <label className="col-sm-1 control-label text-right" style={{ padding: 0 }}>G.TOTAL</label>
    <div className="col-sm-1 text-center" style={{ padding: 0 }}>:</div>
    <div className="col-sm-2" style={{ padding: 0 }}>
      <input
        type="text"
        readOnly
        value={grandTotal.toFixed(2)}
        className="form-control text-right"
        style={{ backgroundColor: '#f5f5f5', margin: 0 }}
      />
    </div>

    <label className="col-sm-1 control-label text-right" style={{ padding: 0 }}>DUE</label>
    <div className="col-sm-1 text-center" style={{ padding: 0 }}>:</div>
    <div className="col-sm-2" style={{ padding: 0 }}>
      <input
        type="text"
        readOnly
        value={due.toFixed(2)}
        className="form-control text-right"
        style={{ backgroundColor: '#f5f5f5', margin: 0 }}
      />
    </div>
  </div>
  </div>

  {/* Row 3: Due (Optional if you want to keep it separate) */}
  <div className="row" style={{ margin: 0, marginTop: 5 }}>
    
</div>



            <div className="form-group" style={{ marginTop: 10 }}>
  <button className="btn btn-success" onClick={handleSubmit} style={{ marginRight: 10 }}>
    Submit
  </button>
  <button className="btn btn-primary" onClick={handlePrint} style={{ marginRight: 10 }}>
    Print
  </button>
  <button className="btn btn-danger" onClick={''}>
    Cancel
  </button>
</div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCart;
