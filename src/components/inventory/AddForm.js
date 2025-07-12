import { useEffect, useState,useRef  } from "react";
import { useDispatch, useSelector } from "react-redux";
import numberWithCommas from "../../utils/numberWithCommas";
import {
  editInActive,
} from "../../features/accounts/accountsSlice";
import pb from "../../utils/pocketbase";
import {
  updateInvoice,
  createCatalogue,
  addToCart,editCartItemByLot,clearCart,editcartInActive,
  updateDiscountValue,
  updateLoadUnloadValue,
  updatePaidValue
} from "../../features/inventory/inventorySlice";
import FormField from "../reuseable/FormField";
import { useSWRConfig } from 'swr'
import axiosInstance from "../../utils/axios";
import { Select } from "antd";
import axios from "axios";

const { Option } = Select;
const AddForm = () => {

  const [options, setOptions] = useState([]);
  const [aclistnew, setaclistnew] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (value) => {
      if (!value) {
          setOptions([]);
          return;
      }
      setLoading(true);
      try {
          const response  = await axiosInstance.get(`/commondata/searchProduct.php?query=${value}`);
         
          setOptions(response.data);
        // console.log(response);
        
          
      } catch (error) {
          console.error("Error fetching data:", error);
      }
      setLoading(false);
  };

  const handleSearchac = async (value) => {
    if (!value) {
        setOptions([]);
        return;
    }
    setLoading(true);
    try {
        const response  = await axiosInstance.get(`/commondata/searchAc.php?query=${value}`);
       
        setaclistnew(response.data);
      
        
    } catch (error) {
        console.error("Error fetching data:", error);
    }
    setLoading(false);
};
  const { mutate } = useSWRConfig()

  const serverDate = localStorage.getItem('date');


  // const [cart, setCart] = useState([]);
  const [inputsForm, setInputsForm] = useState({
    e_date: serverDate,
    sell_type: 'SELL',
    bill_type: 'CASH',
    product_id: '',
    product_name: 'Select..',
    ac_id: 'Select..',
    ac_name: 'Select..',
    license_no: '',
    unit_1: '',
    s_rate: '',
    total_tk: '',
    payment: '',
    receive: '',
    remarks: 'N/A'
    
  });


  const [editMode, setEditMode] = useState(false);

  const dispatch = useDispatch();
  const {edit_invid,cart,cartedit,invoicedetail,paidValue,discountValue,loadUnloadValue} = useSelector((state) => state.inventory)||{};
 
  const { editing } = useSelector((state) => state.inventory) || {};

const [manualChange, setManualChange] = useState(false);
const getUserData = (event) => {
  event.preventDefault();
  const name = event.target.name;
  const value = event.target.value;

  setInputsForm((prev) => {
    const updated = {
      ...prev,
      [name]: value,
    };

    // User is manually editing total_tk
    if (name === 'total_tk') {
      const rate = parseFloat(prev.s_rate) || 1;
   updated.unit_1 = ((parseFloat(value) || 0) / rate).toFixed(2);

      setManualChange(true);
    }

    return updated;
  });
};

   const getSelectdata = (value, name,sl) => { // Accept 'name' as a parameter
  
    setInputsForm((prevState) => ({
      ...prevState,
      [name]: value,
   
      // Use 'name' to update the corresponding field dynamically
    }));
   
    inputRefs[sl+1]?.current.focus();
    inputRefs[sl + 1]?.current.select()
    
  };
  

  const getSelectdataselltyp = (value, name, sl) => {
    setInputsForm((prevState) => ({
      ...prevState,
      [name]: value,
      // Use 'name' to update the corresponding field dynamically
    }));
  
    if (name === "sell_type" && inputsForm.bill_type === "CASH") {
      // If the field being updated is 'sell_type' and bill type is 'CASH',
      // move focus to the next input
      inputRefs[3]?.current.focus();
      // inputRefs[3]?.current.select()
    } else if (name === "sell_type" && inputsForm.bill_type === "CREDIT") {
      // If the field being updated is 'sell_type' and bill type is 'CREDIT',
      // move focus to the A/C input
      inputRefs[2]?.current.focus(); // Assuming A/C input is at index sl + 2
      // inputRefs[2]?.current.select()
    } 
  };
  
   const [pStock, setpStock] = useState(0)

  const fetchStock =async(id)=>{
 
    try {
      const response = await axiosInstance.get(`/commondata/fetchSelectedStock.php?id=${id}`);
      setpStock(response.data[0].stockinunit2);
  
  } catch (error) {
      console.error('Error:', error);
  } 
  }
  const getSelectdatafac = (value,label, name,sl) => { // Accept 'name' as a parameter
 const selected = factoryList.find((p) => p.value === value);
  
  
    setInputsForm((prevState) => ({
      ...prevState,
      [name]: value,
      unit_1:1,
      s_rate:parseFloat(selected?.rate),
      product_name:label,
      // Use 'name' to update the corresponding field dynamically
    }));
    fetchStock(value)
   
    inputRefs[sl+1]?.current.focus();
    inputRefs[sl + 1]?.current.select()
  };
;

  // listen for edit mode active
  useEffect(() => {
    const { ac_id,bill_type,sell_type } = invoicedetail[0] || {};
    if (ac_id) {
    
 if(bill_type==="CREDIT"){
  setshowcredit(true)
 }else{
  setshowcredit(false)
 }
      setEditMode(true);
      setInputsForm((prevState) => ({
        ...prevState,
        ac_id,
        bill_type,sell_type
      }));
    } else {
      setEditMode(false);
      reset();
      // dispatch(editInActive)
    }
  }, [invoicedetail]);


  useEffect(() => {

    const { id,e_date, bill_type,product_name,product_id,ac_id,sell_type,unit_1,license_no,s_rate,total_tk,remarks} = cartedit || {};
 
    if (product_id) {
      setEditMode(true);
      setInputsForm((prevState) => ({
        ...prevState,
      id,
      e_date,
      sell_type,
      bill_type,
      product_id,
      product_name:cartedit.expand !==undefined?cartedit.expand.product_id.name:product_name,
      ac_id,
      s_rate,
     unit_1,
     license_no,
     remarks,

     total_tk
      }));
    } else {
      setEditMode(false);
      reset();
      // dispatch(editInActive)
    }
    
  }, [cartedit]);



  const fetchAc = async () => {
    try {
      const response = await axiosInstance.get("/commondata/getAccounts.php");
  
      const updatedAcarray = response?.data?.map((item) => ({
        value: item.id,
        label: item.name,
        address: item.address,
        contact: item.contact,
        actype: item.type,
      }));
  
      return updatedAcarray;
    } catch (error) {
      console.error("Error:", error);
      return [];
    }
  };
  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get("/commondata/getProducts.php");
  
      const updatedFactoryarray = response?.data?.map((item) => ({
        value: item.id,
        label: item.name,
        unit_1:item.unit_1,
        rate:item.rate
       
      }));
  
      return updatedFactoryarray;
    } catch (error) {
      console.error("Error:", error);
      return [];
    }
  };
  
  
  


const [factoryList, setFactorylist] = useState([]);
const [acList, setAclist] = useState([]);
  useEffect(()=>{
  mutate("fetchinvdata");
(async()=>{

  const acData = await fetchAc();
  const productsData = await fetchProducts();
  setAclist(acData);
  setFactorylist(productsData)





})()
return () => {
  reset();
  dispatch(clearCart())
  dispatch(editcartInActive())
}
  },[])




  const reset = () => {
    setInputsForm({
      e_date: new Date().toISOString().slice(0, 10),
      sell_type: 'SELL',
      bill_type: 'CASH',
      product_id: '',
      product_name: 'Select..',
      ac_id: 'Select..',
      ac_name: '',
      license_no: '',
      unit_1: '0',
      s_rate: '0',
      total_tk: '0',
      payment: '',
      receive: '',
      remarks: 'N/A'
 
    });
  
    dispatch(updateDiscountValue(0))
    dispatch(updateLoadUnloadValue(0))
    dispatch(updatePaidValue(0))
   
    setshowcredit(true)
    setEditMode(false)
  };
  const handleCreate =async () => {
   
    if (
      inputsForm.sell_type === "" ||
    cart.length === 0
    ) {
      // Show an alert for incomplete fields
      alert("Please fill in all fields.");
    } else {
      await dispatch(createCatalogue({cart,serverDate,paidValue,discountValue,loadUnloadValue}));
      await mutate('fetchinvdata');
      ;

      reset();
      inputRefs[1]?.current.focus();
    }
  };



  const addCart = () => {
  
    // Check if required fields are filled
    if (
      inputsForm.sell_type === "" ||
      inputsForm.bill_type === "" ||
    
      inputsForm.product_id === "Select.." ||
      inputsForm.s_rate === "0" ||
      inputsForm.total_tk === "0" 
    ) {
      // Show an alert for incomplete fields
      alert("Please fill in all fields.");
      return;
    }
  // console.log(inputsForm.license_no,pStock);
    // If sell_type is "SELL", check if unit_1 exceeds available grade stock
    if (inputsForm.sell_type === "SELL" && parseInt(inputsForm.license_no) > parseInt(pStock)) {
      alert("Low stock. Please purchase.");
      return;
    }
  
    // Create a new task object
    const newTask = {
      id: Date.now(),
      e_date: inputsForm.e_date,
      sell_type: inputsForm.sell_type,
      bill_type: inputsForm.bill_type,
      ac_id: inputsForm.ac_id,
      product_id: inputsForm.product_id,
      product_name: inputsForm.product_name,
      license_no: inputsForm.license_no,
      unit_1: inputsForm.unit_1,
      s_rate: inputsForm.s_rate,
      total_tk: inputsForm.total_tk,
      remarks: inputsForm.remarks,
    };
  
    // Dispatch action to add the new task to the cart
    dispatch(addToCart(newTask));
  
    // Reset form fields after adding to cart
    setInputsForm((prevInputsForm) => ({
      ...prevInputsForm,
      license_no: "",
      unit_1: "0",
      s_rate: "0",
      total_tk: "0",
    }));
  
    // Focus on the next input field
    inputRefs[5]?.current.focus();
  };
  
  
useEffect(()=>{
  inputRefs[1]?.current.focus();
},[])
  const editCart=()=>{
    if (
      inputsForm.sell_type === "" ||
      inputsForm.bill_type === "" ||
      inputsForm.ac_id === "Select.." ||
      inputsForm.product_id === "Select.." ||
      inputsForm.unit_1 === "" ||
      inputsForm.s_rate === "" ||
      inputsForm.total_tk === "" 
    ) {
      // Show an alert for incomplete fields
      alert("Please fill in all fields.");
    } else {
    
    dispatch(editCartItemByLot({ id: inputsForm.id, inputsForm }));
    setInputsForm((prevInputsForm) => ({
      ...prevInputsForm, // Keep the rest of the fields the same
      license_no: "",
      unit_1: "0",
      s_rate: "0",
      total_tk: "0",
      remarks: "N/A",
      cus_id:""
    }));
    setEditMode(false)
  }
   
  }



  const cartRef = useRef(null);
  const inputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    
  ];

 
  const handleKeyPress = (event, index,value) => {
    console.log(index);
    
    const currentElement = document.activeElement;
    const isUnit1Input = currentElement.getAttribute('name') === 'unit_1';
  if(isUnit1Input){
    if (event.key === 'Enter' &&
    currentElement.getAttribute('aria-haspopup') !== 'listbox' ) {

      if(index===7){
        cartRef.current.focus();
      }else if (index===3){
        event.preventDefault(); // Prevent the default Enter key behavior
        inputRefs[index + 1]?.current.focus(); // Move focus to the next input
   
      }else if (index===4){
        event.preventDefault(); // Prevent the default Enter key behavior
        inputRefs[index + 1]?.current.focus(); // Move focus to the next input
   
      }else{
       
        event.preventDefault(); // Prevent the default Enter key behavior
        inputRefs[index + 1]?.current.focus(); // Move focus to the next input
     inputRefs[index + 1]?.current.select()
      }
    }
  } else{
    if (event.target.value !=="0" && event.key === 'Enter' &&
    currentElement.getAttribute('aria-haspopup') !== 'listbox' ) {

      if(index===7){
        cartRef.current.focus();
      }else if (index===3){
        if(showlicense===true){
          event.preventDefault(); // Prevent the default Enter key behavior
        inputRefs[index + 1]?.current.focus(); // Move focus to the next input
        } else{
           inputRefs[index + 2]?.current.focus();
            //  inputRefs[index + 2]?.current.select()
        }
   
      }else if(index===2){
 event.preventDefault(); // Prevent the default Enter key behavior
        inputRefs[index + 1]?.current.focus(); // Move focus to the next input
   
      }else if(index===4){
 event.preventDefault(); // Prevent the default Enter key behavior
        inputRefs[index + 1]?.current.focus(); // Move focus to the next input
   
      }else{
       
        event.preventDefault(); // Prevent the default Enter key behavior
        inputRefs[index + 1]?.current.focus(); // Move focus to the next input
     inputRefs[index + 1]?.current.select()
      }
    }
  }
  };
// console.log(editing.length>0);


const sellType = [
  { value: "SELL", label: "SELL" },
  { value: "PUR", label: "PURCHASE" }
];

const editInvoice = async () => {
  
  try {
    await dispatch(updateInvoice({
      cart,
      id: edit_invid,
      paidValue,
      discountValue,
      loadUnloadValue
    }));

    await mutate('fetchinvdata');
   
    reset();
    dispatch(clearCart());
    dispatch(editInActive());
  } catch (error) {
  }
};

  useEffect(() => {
    dispatch(editInActive());
    
  }, []);




// const [unitcal, setunitcal] = useState()
//   useEffect(() => {
//     const filteredArray = factoryList.filter(obj => obj.value === inputsForm.product_id);

//      setunitcal(filteredArray[0]?.license_no)
//   }, [inputsForm.product_id])
  
  // useEffect(() => {
  //   setInputsForm(prevInputsForm => {
  //     const newUnit2 = inputsForm.unit_1 === '0' ? inputsForm.license_no : (inputsForm.unit_1 * unitcal || 0);
  //     return {
  //       ...prevInputsForm,
  //       // license_no: newUnit2,
  //       // total_tk: newUnit2 * inputsForm.s_rate,
  //     };
  //   });
  // }, [inputsForm.license_no,inputsForm.unit_1, unitcal]);
  
 useEffect(() => {
  if (!manualChange) {
    setInputsForm((prev) => ({
      ...prev,
      total_tk: (
        prev.unit_1 !== '0'
          ? prev.unit_1 * prev.s_rate
          : prev.license_no * prev.s_rate || 0
      ).toFixed(2),
    }));
  }

  // Reset manual flag so future useEffect runs work normally
  setManualChange(false);
}, [inputsForm.unit_1, inputsForm.s_rate, inputsForm.license_no]);

  

const [showcredit, setshowcredit] = useState(false);
const [showlicense, setShowlicense] = useState(false);
const handleBillTypeChange = (value) => {
  if(value==="CREDIT"){
    setInputsForm((prevState) => ({
      ...prevState,
      ac_id: "Select...",
    }));
  }
  setInputsForm((prevState) => ({
    ...prevState,
    bill_type: value,
  }));
  setshowcredit(!showcredit)
};

// useEffect(() => {
// if(showcredit===false){
//   setInputsForm((prevState) => ({
//     ...prevState,
//     ac_id: "1",
//   }));
// }


// }, [])

useEffect(() => {
if(showcredit===false){
  setInputsForm((prevState) => ({
    ...prevState,
    ac_id: "1",
  }));
}


}, [])

useEffect(() => {
  if (inputsForm.sell_type === "SELL") {
    setShowlicense(false);
  } else {
    setShowlicense(true);
  }
}, [inputsForm.sell_type]);

  return (

    <>
     <section className="col-lg-4 connectedSortable">
  <div className="box box-danger">
    {/* Tabs within a box */}
    <div className="tab-content no-padding">
      {/* Morris chart - Sales */}
      <div className="box-header header-custom">
        <h3 className="box-title">Account Info</h3>
      </div>
      <div className="form-horizontal" id="fupForm" name="form1" method="post">
        <div className="box-body">
          <div className="box-body">




                   
          <div className="form-group">
  <label htmlFor="accntname" className="col-sm-4 control-label">
    Bill Type
  </label>
  <div className="col-sm-8">
    <label>
      <input
       ref={inputRefs[0]}
       sl={0}
        type="radio"
        className="flat-red"
        checked={inputsForm.bill_type === "CASH"}
        onChange={() => handleBillTypeChange("CASH")}
        onKeyDown={(event) => handleKeyPress(event, 0)}
      />{" "}
      CASH
    </label>
    <label>
      <input
       ref={inputRefs[0]}
       sl={0}
        type="radio"
        className="flat-red"
        checked={inputsForm.bill_type === "CREDIT"}
        onChange={() => handleBillTypeChange("CREDIT")}
      />{" "}
      CREDIT
    </label>
  </div>
</div>
       


          <FormField
          refs={inputRefs[1]}
          sl={1}
          handleKeyPress={handleKeyPress}
          label="Sell Type"
          name="sell_type"
          value={inputsForm.sell_type}
          type="select"
          options={sellType.map((type) => ({
            value: type.value,
            label: type.label,
          }))}
           onChange={(value) => getSelectdataselltyp(value, "sell_type",1)}
        />
         
      {showcredit===false && (
       
       <div className="form-group">
       <label htmlFor="accntno" className="col-sm-4 control-label">Account</label>
       <div className="col-sm-8">
         <Select
           ref={inputRefs[2]} // Corrected from `refs` to `ref`
           sl={2}
           handleKeyPress={handleKeyPress}
           label="Product"
           name="product_id"
           value={inputsForm.ac_id}  // Bind the value to your form state
           showSearch
           style={{ width: '100%' }}
           dropdownStyle={{ width: 'auto' }}  // dropdown width will adjust automatically
           dropdownMatchSelectWidth={false}  // Set dropdown width
           placeholder="Search items"
           onSearch={(value) => handleSearchac(value)} // Search handler
           onChange={(value) => getSelectdata(value, "ac_id", 2)} // Option change handler
           loading={loading}
           filterOption={false} // Custom filtering handled via `onSearch`
           optionLabelProp="label" // Ensure both value and label are available
         >
           {aclistnew?.data?.map((option) => (
             <Option key={option.id} value={option.id} label={option.name}>
               <div style={{ display: "flex", flexDirection: "row", alignItems: "center", width: "100%" ,borderBottom:'1px dashed grey'}}>
              <span style={{background:'#3399FF',color:'white',padding:'5px'}}>  {option.id}</span>
                 <div style={{ display: "flex", flexDirection: "column", marginLeft: "10px" }}>
                   <span className="form-body" style={{ fontSize: "12px", fontWeight: "bold" }}>
                     {option.name}
                   </span>
                   <span className="form-body" style={{ fontSize: "11px", color: "black" }}>
                       {option.address} 
                     </span>
                   <div style={{ display: "flex", flexDirection: "row",marginBottom:'4px' }}>
                   
                     <span className="form-body" style={{ fontSize: "10px", color: "black",marginRight:'5px' }}>
                       {option.contact}
                     </span>
                     <span
                       className="form-body"
                       style={{
  
                         fontSize: "8px",
                         color: "white",
                         backgroundColor: "#009999",
                         padding: "0px 5px",
                         borderRadius: "15%",
                       }}
                     >
                       {option.type}
                     </span>
                   </div>
                 </div>
                 <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", marginLeft: "auto" }}>
                   <span style={{
                     fontSize: "12px",
                     color: "indigo",
                     fontWeight: 'bold'
                   }}>
                     {numberWithCommas(parseInt(option.balance).toFixed(2))}
                   </span>
                 </div>
               </div>
             </Option>
           ))}
         </Select>
       </div>
     </div>
     
)}



         <FormField
         refs={inputRefs[3]}
         sl={3}
         handleKeyPress={handleKeyPress}
          label="Remarks"
          name="remarks"
          value={inputsForm.remarks}
          type="text"
          onChange={getUserData}
        />
        {showlicense===true && (
<FormField
          refs={inputRefs[4]}
          sl={4}
          handleKeyPress={handleKeyPress}
          label="License"
          name="license_no"
          value={inputsForm.license_no}
          type="text"
          onChange={getUserData}
        />
        )}
        
         

<div className="form-group">
    <label htmlFor="accntno" className="col-sm-4 control-label">Product</label>
    <div className="col-sm-8">
   
    <Select
  ref={inputRefs[5]} // Corrected from `refs` to `ref`
  sl={5}
  handleKeyPress={handleKeyPress}
  label="Product"
  name="product_id"
  value={inputsForm.product_id}
  showSearch
  style={{ width: '100%' }}
  dropdownStyle={{ width: 'auto' }}  // dropdown width will adjust automatically
  dropdownMatchSelectWidth={false} 
  placeholder="Search items"
  onSearch={(value) => handleSearch(value)} // Ensures handleSearch is called properly
  onChange={(value, option) =>
    getSelectdatafac(value, option?.children, "product_id", 5)
  } // Use `option?.children` for label extraction
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


    </div>
  </div>
        {/* <FormField
        loading={loading}
        handleSearch={handleSearch} 
           refs={inputRefs[4]}
           sl={4}
           handleKeyPress={handleKeyPress}
          label="Product"
          name="product_id"
          value={inputsForm.product_id}
          type="select"
          options={factoryList.map((type) => ({
            value: type.value,
            label: type.label,
          }))}
          onChange={(value,label) => getSelectdatafac(value,label, "product_id",4)}
        /> */}


        
        <FormField
        refs={inputRefs[6]}
        sl={6}
        
        handleKeyPress={handleKeyPress}
          label="Qty"
          name="unit_1"
          value={inputsForm.unit_1}
          type="number"
          onChange={getUserData}
        />
       
        <FormField
        refs={inputRefs[7]}
        sl={7}
        handleKeyPress={handleKeyPress}
        label="Rate"
        name="s_rate"
        value={inputsForm.s_rate}
        type="number"
        onChange={getUserData}
        />
         <FormField
        refs={inputRefs[8]}
        sl={8}
        handleKeyPress={handleKeyPress}
        label="Total"
        name="total_tk"
        value={inputsForm.total_tk}
        type="number"
        onChange={getUserData}
        />
        <p>Stock : <b>{parseFloat(pStock).toFixed(3)}</b></p>
       
          </div>
          {/* /.box-body */}
          <div className="box-footer">

          

      <div style={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
        <button  className="m-1 btn bg-maroon btn-flat "  ref={cartRef} onClick={editMode?editCart:addCart} type="">{editMode?"Update Cart":"Add Cart"}</button>
       <br/>
        <button className="m-1 btn bg-navy  "   onClick={editing.length>0 ? editInvoice : handleCreate}>
          {editing.length>0?"Update":"Save"}
        </button>
      
        {/* <button onClick={editCart} type="">edit cart</button> */}
        {/* <button onClick={editInvoice} type="">update db cart</button> */}
      </div>






               </div>
          {/* /.box-footer */}
        </div></div>
    </div>
  </div></section>




    </>
  
  );
};

export default AddForm;
