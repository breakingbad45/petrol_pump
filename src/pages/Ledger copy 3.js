import React, { useState ,useRef,useEffect} from "react";
import { Select, Button, Input, Popconfirm, message } from "antd";
import { DeleteOutlined,UndoOutlined } from '@ant-design/icons';
import axiosInstance from "../utils/axios";
import currencyConverter from "../utils/currencyConverter"
const { Option } = Select;



const initialRows = Array(5)
  .fill(null)
  .map((_, index) => ({
    key: index,
    pid:null,
    product: null,
    qty1: 1,
    qty2: 1,
    stock: 0,
    unit1: '',
    unit2: '',
    rate: '',
    total: 0,
    remark: "",
  }));

const ProductTable = () => {
  const [options, setOptions] = useState([]);
  const [productlst, setproductlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(initialRows);

  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get("/commondata/getProducts.php");
  
      const updatedFactoryarray = response?.data?.map((item) => ({
        value: item.id,
        label: item.name,
        unit_1:item.unit_1,
        unit_2:item.unit_2
      }));
  
      return updatedFactoryarray;
    } catch (error) {
      console.error("Error:", error);
      return [];
    }
  };
  const handleSelectProduct = (value, index,label) => {

    const selectedProduct = productlst.find((p) => p.value === value);
    const newData = [...data];
    newData[index] = {
      ...newData[index],
      pid:value,
      product: label,
      qty1: selectedProduct.unit_1,
      qty2: selectedProduct.unit_2,
      stock: selectedProduct.unit_1,
      unit1: 0,
      unit2: 0,
      rate:0
    };
    setData(newData);

    // Alert for low stock
    if (selectedProduct.stock === 0) {
      message.warning("Low stock for this product!");
    }else{
      setTimeout(() =>
        document.getElementById(`unit1-${index}`)?.select(), 100
      );

    }

  };

  const handleInputChange = (e, index, field) => {
    const newData = [...data];
    let value = parseFloat(e.target.value) || 0;
    newData[index][field] = value;

    if (field === "unit1") {
      newData[index].unit2 = value * newData[index].qty2;
    }

    newData[index].total = 
      (newData[index].unit1 ? newData[index].unit1 : newData[index].unit2) * 
      (newData[index].rate || 0);

    setData(newData);
  };

  const handleKeyPress = (e, index, nextField) => {
    if (e.key === "Enter") {
      if (nextField === "remark") {
        setTimeout(() => document.getElementById(`remark-${index}`)?.focus(), 100);
      } else {
        // Ensure product is selected
        if (!data[index].product) {
          message.warning("Please select a product.");
          return;
        }

        // Ensure unit1 has a valid value before focusing on unit2
        if (nextField === "rate" && !data[index].unit2) {
          message.warning("Unit2 cannot be zero or empty.");
          return;
        }

      
        // Ensure rate has a valid value before focusing on remark
        if (nextField === "remark" && (!data[index].rate || data[index].rate === 0)) {
          message.warning("Rate cannot be zero or empty.");
          return;
        }

        document.getElementById(`${nextField}-${index}`)?.focus();
        document.getElementById(`${nextField}-${index}`)?.select();
      }
    }
  };

  const handleRemarkKeyPress = (e, index) => {
    if (e.key === "Enter") {
      if (index === data.length - 1) {
        addNewRow();
        
      } else {
        setTimeout(() => document.getElementById(`product-${index + 1}`)?.focus(), 100);
      }
    }

    
   
  };

  const addNewRow = () => {
    setData((prevData) => [
      ...prevData,
      {
        key: prevData.length,
        pid:null,
        product: null,
        qty1: 1,
        qty2: 1,
        stock: 0,
        unit1: "",
        unit2: "",
        rate: "",
        total: "",
        remark: "",
      },
    ]);
    setTimeout(() => document.getElementById(`product-${data.length}`)?.focus(), 100);
  };

  const resetRow = (index) => {
    const newData = [...data];
    newData[index] = {
      key: null,
      product: null,
      qty1: 1,
      qty2: 1,
      stock: 0,
      unit1: "",
      unit2: "",
      rate: "",
      total: "",
      remark: "",
    };
    setData(newData);
  };

  const deleteRow = (index) => {
    const newData = data.filter((_, i) => i !== index);
    setData(newData);
  };

  const savedata =()=>{
    console.log(data);
    
    setData(initialRows)

  }

  const handleSearch = async (value) => {
    if (!value) {
        setOptions([]);
        return;
    }
    setLoading(true);
    try {
        const response  = await axiosInstance.get(`/commondata/searchProductnew.php?query=${value}`);
       
        setOptions(response.data);
      
        
    } catch (error) {
        console.error("Error fetching data:", error);
    }
    setLoading(false);
};
  const [values, setValues] = useState({
    billType: "cash",
    saleType: "sell",
    acid:"",
    account: "",
    dueDate: "",
    subtotal: data.reduce((acc, row) => acc + (row.total || 0), 0),
    discount: 0,
    paid: 0,
    grandTotal: 0,
    remaining: 0,
  });
  
  useEffect(() => {
   (async()=>{
const product= await fetchProducts()
setproductlist(product)
   })()
  }, [])


  
  useEffect(() => {
    setValues((prev) => ({
      ...prev,
      subtotal: data.reduce((acc, row) => acc + (row.total || 0), 0),
    }));
  }, [data]);
  
  
  // Refs for input focus handling
  const discountRef = useRef(null);
  const paidRef = useRef(null);
  const logButtonRef = useRef(null);

  // Handle input change and update calculated values
  const handleChange = (e) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value) || 0;

    const updatedValues = {
      ...values,
      [name]: numValue
    };

    // Recalculate totals
    updatedValues.grandTotal = updatedValues.subtotal - updatedValues.discount;
    updatedValues.remaining = updatedValues.grandTotal - updatedValues.paid;

    setValues(updatedValues);
  };

  // Handle Enter key to move focus
  const handleKeyDown = (e, nextRef) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission
      nextRef?.current?.focus(); // Move focus to the next input
      nextRef?.current?.select(); // Move focus to the next input
    }
  };

  const handleLogValues = () => {
    savedata()
    console.log("F:", values);
  };
 
  const accountRef = useRef(null);
  const dueDateRef = useRef(null);

  // Handle input changes
  const handleChange2 = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  // Handle keyboard navigation
  const handleKeyDown2 = (e, nextRef) => {
    if (e.key === "Enter" && nextRef?.current) {
      e.preventDefault();
      nextRef.current.focus();
    }
  };
  return (
    <div className="container inv" >
 <div style={{ display: "flex", justifyContent: "flex-start", marginTop: "10px", marginBottom: "15px" }}>
      <table>
        <tbody>
          {/* Bill Type */}
          <tr>
            <td>Bill Type</td>
            <td>
              <label>
                <input
                  type="radio"
                  name="billType"
                  value="cash"
                  checked={values.billType === "cash"}
                  onChange={handleChange2}
                />
                Cash
              </label>
              <label style={{ marginLeft: "10px" }}>
                <input
                  type="radio"
                  name="billType"
                  value="credit"
                  checked={values.billType === "credit"}
                  onChange={handleChange2}
                />
                Credit
              </label>
            </td>
          </tr>

          {/* Sale Type */}
          <tr>
            <td>Sale Type</td>
            <td>
              <select
                name="saleType"
                className="form-control"
                value={values.saleType}
                onChange={handleChange2}
              >
                <option value="sell">Sell</option>
                <option value="purchase">Purchase</option>
              </select>
            </td>
          </tr>

          {/* Account (Hidden if Cash is selected) */}
          {values.billType === "credit" && (
            <tr>
              <td>Account</td>
              <td>
                <select
                  name="account"
                  className="form-control"
                  value={values.account}
                  onChange={handleChange2}
                  onKeyDown={(e) => handleKeyDown2(e, dueDateRef)}
                  ref={accountRef}
                >
                  <option value="">Select Account</option>
                  <option value="account1">Account 1</option>
                  <option value="account2">Account 2</option>
                </select>
              </td>
            </tr>
          )}

          {/* Due Date (Hidden if Cash is selected) */}
          {values?.billType === "credit" && (
            <tr>
              <td>Due Date</td>
              <td>
                <input
                  type="date"
                  name="dueDate"
                  className="form-control"
                  value={values?.dueDate}
                  onChange={handleChange2}
                  ref={dueDateRef}
                />
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>


      <table style={{background:'white'}} >
        <thead>
          <tr >
            <th  style={{background:'#c6d7b4',padding:'10px'}}>#</th>
            <th  style={{background:'#c6d7b4',padding:'10px'}}>Product</th>
            <th  style={{background:'#c6d7b4',padding:'10px'}}>Stock</th>
            <th  style={{background:'#c6d7b4',padding:'10px'}}>Unit1</th>
            <th  style={{background:'#c6d7b4',padding:'10px'}}>Unit2</th>
            <th  style={{background:'#c6d7b4',padding:'10px'}}>Rate</th>
            <th  style={{background:'#c6d7b4',padding:'10px'}}>Total</th>
            <th  style={{background:'#c6d7b4',padding:'10px'}}>Remark</th>
            <th  style={{background:'#c6d7b4',padding:'10px'}}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={row.key}>
              <td align="center" style={{padding:'7px',background:'grey',color:"white"}}>{index + 1}</td>
              <td width={"30%"}>
                <Select
                 value={row.product || undefined} 
                  id={`product-${index}`}
                  showSearch
                  dropdownStyle={{ width: 'auto' }}  // dropdown width will adjust automatically
  dropdownMatchSelectWidth={false} 
            
                  style={{ width: "100%" }}
                  onSearch={(value) => handleSearch(value)}
                  
                  onChange={(value,option) => handleSelectProduct(value, index, option?.children,)}
                  loading={loading}
  filterOption={false} // Custom filtering handled via `onSearch`
  getPopupContainer={(trigger) => trigger.parentNode} // Ensures dropdown is visible
                >
                  {options.map((option) => (
    <Option key={option.id} value={option.id}>
      {option.name}
    </Option>
  ))}
                </Select>
              </td>
              <td>
                <input className="form-control text-right" style={{fontWeight:'bold',color:'red'}} value={currencyConverter(row.stock)} disabled />
              </td>
              <td>
                <input
                  id={`unit1-${index}`}
                  type="number"
                  className="form-control"
                  value={row.unit1}
                  onChange={(e) => handleInputChange(e, index, "unit1")}
                  onKeyPress={(e) => handleKeyPress(e, index, "unit2")}
                />
              </td>
              <td>
                <input
                  id={`unit2-${index}`}
                  type="number"
                  className="form-control"
                  value={row.unit2}
                  onChange={(e) => handleInputChange(e, index, "unit2")}
                  onKeyPress={(e) => handleKeyPress(e, index, "rate")}
                />
              </td>
              <td>
                <input
                  id={`rate-${index}`}
                  type="number"
                  className="form-control"
                  value={row.rate}
                  onChange={(e) => handleInputChange(e, index, "rate")}
                  onKeyPress={(e) => handleKeyPress(e, index, "remark")}
                />
              </td>
              <td>
                <input  className="form-control text-right" style={{fontWeight:'bold'}} value={currencyConverter(row.total)} disabled />
              </td>
              <td>
                <input
                  id={`remark-${index}`}
                  className="form-control"
                  placeholder="Memo"
                  value={row.remark}
                  onChange={(e) => handleInputChange(e, index, "remark")}
                  onKeyPress={(e) => handleRemarkKeyPress(e, index)}
                />
              </td>
              <td>
                <div style={{display:'flex'}}>
                <Button type="primary" onClick={() => resetRow(index)} shape="circle" icon={<UndoOutlined />}>
        
      </Button>
      <Popconfirm
                  title="Are you sure you want to delete this row?"
                  onConfirm={() => deleteRow(index)}
                  okText="Yes"
                  cancelText="No"
                >
      <Button type="primary" danger shape="circle" icon={<DeleteOutlined />}>
        
        </Button>
        </Popconfirm>
               
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    
      

      <div style={{ display: 'flex', justifyContent: 'flex-end',marginTop:'10px'}} className="">
  <table>
    <tbody>
      <tr>
        <td>Subtotal</td>
        <td>
          <input
            type="number"
            readOnly
            className="form-control"
            name="subtotal"
            value={values.subtotal}
            onChange={handleChange}
            onKeyDown={(e) => handleKeyDown(e, discountRef)}
            autoFocus
          />
        </td>
      </tr>
      <tr>
        <td>Discount</td>
        <td>
          <input
            type="number"
            autoComplete="off"
            className="form-control"
            name="discount"
            value={values.discount}
            onChange={handleChange}
            onKeyDown={(e) => handleKeyDown(e, paidRef)}
            ref={discountRef}
          />
        </td>
      </tr>
      <tr>
        <td>Paid</td>
        <td>
          <input
            type="number"
            autoComplete="off"
            className="form-control"
            name="paid"
            value={values.paid}
            onChange={handleChange}
            onKeyDown={(e) => handleKeyDown(e, logButtonRef)}
            ref={paidRef}
          />
        </td>
      </tr>
      <tr>
        <td>Change</td>
        <td>
          <input
            className="form-control"
            type="number"
            value={values.remaining.toFixed(2)}
            id="change"
            readOnly
          />
        </td>
      </tr>
    </tbody>
  </table>
</div>

<div className="text-right">
<div className="btn-group">
    <button className="save-btn"  onClick={handleLogValues}
        ref={logButtonRef}>Save</button>
    <button className="cancel-btn">Cancel</button>
  </div>
      </div>
      

    </div>
  );
};

export default ProductTable;
