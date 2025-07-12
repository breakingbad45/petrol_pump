import React, { useState,useEffect,useRef } from "react";
import pb from "../utils/pocketbase";
import FormField2 from "../components/reuseable/FormField2";
import LedgerViewer from "../components/ledger/LedgerViewer";
import {useNavigate } from 'react-router-dom';
import numberWithCommas from "../utils/numberWithCommas";
import axiosInstance from "../utils/axios";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateField } from '@mui/x-date-pickers/DateField';
import { Select } from "antd";
const { Option } = Select;

const ProductLedger = () => {
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
        
          
      } catch (error) {
          console.error("Error fetching data:", error);
      }
      setLoading(false);
  };





 
  const [totalPayment, setTotalPayment] = useState(0);
  const [totalReceive, setTotalReceive] = useState(0);
  const [balance, setBalance] = useState(0);
  const [previousDueamount, setPreviousdueamount] = useState(0);
  // State variables for input values
  const [season, setSeason] = useState("");
  const [sale, setSale] = useState("");
  const [promptDate, setPromptDate] = useState("");

  const [types, settypes] = useState([]);
  var originalDate = new Date();

// Subtract one month
originalDate.setMonth(originalDate.getMonth() - 1);

// Format the result as a string (MM/DD/YYYY)
var resultDate = (originalDate.getMonth() + 1) + '/' + originalDate.getDate() + '/' + originalDate.getFullYear();
 
// const isLogged = pb.authStore.isValid;
// const isDue = pb.authStore.model.ps;
// const navigate = useNavigate();
// useEffect(() => {
//  if(!isLogged){
//   navigate('/')
//  } else if(isDue){
//   navigate('/payment')
//  }
// }, []);
const fetchProduct = async () => {
  try {
    const response = await axiosInstance.get("/commondata/getProducts.php");

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
  useEffect(()=>{
(async()=>{
//   const records = await pb.collection('Eligibility').getFullList({
  const products = await fetchProduct();
  settypes(products)

})()
  },[])
  // useEffect(() => {
  
  //   (async()=>{
  //       const response = await pb.collection('adminsale').getFirstListItem(`broker_id="${pb.authStore.model.id}"`, {
  //           expand: 'relField1,relField2.subRelField',
  //       })
  //       setSeason(response.season)
  //       setSale(response.sale)
  //       setPromptDate(response.prompt_date)

  //   })()
  // }, []);
  // Function to handle the update button click

  const getDateWithUTCOffset = (offset, monthsAgo = 0) => {
    const currentDate = new Date();
    currentDate.setUTCMonth(currentDate.getUTCMonth() - monthsAgo);
  
    const utcMilliseconds = currentDate.getTime() + currentDate.getTimezoneOffset() * 60000;
    const dateWithOffset = new Date(utcMilliseconds + offset * 3600000);
  
    const year = dateWithOffset.getFullYear();
    const month = String(dateWithOffset.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(dateWithOffset.getDate()).padStart(2, '0');
  
    return `${year}-${month}-${day}`;
  };
  
  // Example usage for UTC+6, current date
  const currentDateUTC6 = getDateWithUTCOffset(6);

  // Example usage for UTC+6, date 1 month ago
  const dateOneMonthAgoUTC6 = getDateWithUTCOffset(6, 1);

  // Set the initial state with the current date for start date and end date
  const [startDate, setStartDate] = useState(dateOneMonthAgoUTC6);
  const [endDate, setEndDate] = useState(currentDateUTC6);

  const [fstartDate, setFstartDate] = useState(dateOneMonthAgoUTC6);
  const [fendDate, setFendDate] = useState(currentDateUTC6);
  const [disableButton, setDisablebutton] = useState(true);

 
  
  const handleStartDateChange = (value) => {
    const formattedDate = dayjs(value).format("YYYY-MM-DD");
    setStartDate(formattedDate);
    setFstartDate(formattedDate);
  };
  
  // Handle changes in the end date input
  const handleEndDateChange = (value) => {
    const formattedDate = dayjs(value).format("YYYY-MM-DD");
    setEndDate(formattedDate);
    setFendDate(formattedDate);
  };






  const [ledgerForm, setLedgerform] = useState({
    product_id: "Select..",
    start_date:fstartDate,
    end_date:fendDate,
  });


  const [ledgerData, setLedgerdata] = useState([]);
  const [previousDue, setPreviousdue] = useState();

  const getLedgerdata = async () => {
    const product_id = ledgerForm.product_id;
    const start_date = startDate;
    const end_date = endDate;
 
  
    try {
      const response = await axiosInstance.get(`commondata/getProductledger.php?product_id=${product_id}&start_date=${start_date}&end_date=${end_date}`);
      const data = response.data.data;
   
  
      let totalInQty = 0;
      let totalOutQty = 0;
      let currentBalance = response.data.previous_due ? parseFloat(response.data.previous_due) : 0;
      setPreviousdueamount(currentBalance);
  
      const updatedLedgerData = data.map((entry) => {
        const inqty = parseFloat(entry.inqty) || 0; // Incoming quantity
        const outqty = parseFloat(entry.outqty) || 0; // Outgoing quantity
  
        totalInQty += inqty;
        totalOutQty += outqty;
  
        // Calculate stock and update balance
        currentBalance = currentBalance + inqty - outqty;
  
        return {
          ...entry,
          balance: currentBalance.toFixed(2),
        };
      });

      setLedgerdata(updatedLedgerData);
      setTotalPayment(totalInQty.toFixed(2)); // Update this function to set the total incoming quantity
      setTotalReceive(totalOutQty.toFixed(2)); // Update this function to set the total outgoing quantity
      setBalance(currentBalance.toFixed(2));
  
      setDisablebutton(updatedLedgerData.length === 0);
      if (updatedLedgerData.length === 0) {
        alert("No data found !!");
      }
    } catch (error) {
      console.log('Error fetching data:', error);
    }
  };
  
  

  const cartRef = useRef(null);
  const inputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null)
  ];
  const getSelectdata = (value,sl) => {
    setLedgerform((prevState) => ({
      ...prevState,
      product_id: value,
    }));
    // inputRefs[1]?.current.focus();
    // inputRefs[1]?.current.select();
  };
  const handleKeyPress = (event, index,value) => {
    const currentElement = document.activeElement;
    if (event.target.value !=="" && event.key === 'Enter' &&
    currentElement.getAttribute('aria-haspopup') !== 'listbox' ) {

      if(index===4){
         cartRef.current.focus();
      }else{
        
        event.preventDefault(); // Prevent the default Enter key behavior
        inputRefs[index + 1]?.current.focus(); // Move focus to the next input
        inputRefs[index + 1]?.current.select();
      }
    }
  };

 
  function toProperCase(str) {
    if (!str) return ''; // Handle empty or null strings
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
console.log(ledgerData);

  return (
    <div className="page-wrapper">
      
     
    <LocalizationProvider dateAdapter={AdapterDayjs}>
  <DemoContainer components={['DateField', 'DateField']}>





    <div style={{ fontFamily: 'Arial, sans-serif', padding: '10px',width:'100%' }}>
    {/* Header */}
    <div className="panel panel-default">
      <div className="panel-heading" style={{ padding: '10px 15px', backgroundColor: '#9daccc', color: '#4a235a', fontSize: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <strong>Product Ledger</strong>
        {/* Navigation Buttons in Heading */}
        <div className="btn-group">
       
              {/* <LedgerViewer disableButton={disableButton} data={ledgerData} propsdata={propsdata} ledgerForm={ledgerForm} previousDue={previousDueamount}/>
     
          <button type="button" className="btn btn-default">Traditional Ledger</button> */}
      
        </div>
      </div>
      <div className="panel-body">
        {/* Account Selector and Date Range */}
        <form className="form-inline" style={{ marginBottom: '20px' }}>
         
        <div className="form-group">
    <label htmlFor="accntno" className="col-sm-4 control-label">Product</label>
    <div className="col-sm-8">
   
    <Select
  inputRef={inputRefs[0]}
  sl={0}
   handleKeyPress={handleKeyPress}
   label="Product"
   name="product_id"
   value={ledgerForm.product_id}
  showSearch
  style={{ width: '100%' }}
  dropdownStyle={{ width: 'auto' }}  // dropdown width will adjust automatically
  dropdownMatchSelectWidth={false} 
  placeholder="Search items"
  onSearch={(value) => handleSearch(value)} // Ensures handleSearch is called properly
  onChange={(value, option) =>
    getSelectdata(value, option?.children, "product_id", 0)
  } // Use `option?.children` for label extraction
  loading={loading}
  filterOption={false} // Custom filtering handled via `onSearch`
>
  {options.map((option) => (
    <Option key={option.id} value={option.id}>
      {option.name}
    </Option>
  ))}
</Select>


    </div>
  </div>
          <div className="form-group">
          
          </div>
          <div className="form-group" style={{ marginLeft: '20px' }}>
            <label htmlFor="fromDate" style={{ marginRight: '10px' }}>Date</label>
            <DateField
              id="startDateInput"
              defaultValue={dayjs(startDate)}
              format="YYYY-MM-DD"
              className="p-5 form-group"
              onChange={handleStartDateChange}
            />
           
          </div>
          <div className="form-group" style={{ marginLeft: '20px' }}>
            <label htmlFor="fromDate" style={{ marginRight: '10px' }}>To</label>
            <DateField
              id="startDateInput"
              defaultValue={dayjs(endDate)}
              format="YYYY-MM-DD"
              className="p-5 form-group"

              onChange={handleEndDateChange}
            />
           
          </div>

          
          <button type="button"   onClick={getLedgerdata} className="btn btn-default form-group" style={{ marginLeft: '20px' }}>Get Data</button>
        </form>

        {/* Actions and Search Bar */}
    
        {/* Table */}
        <div className="table-responsive ledger">
        <table className="table table-bordered">
            <thead>
              <tr style={{ backgroundColor: '#e0e7f5', color: '#333' }}>
                <th style={{fontWeight:'bold',textAlign:'center'}}>তারিখ </th>
                <th style={{fontWeight:'bold',textAlign:'center'}}>ইনভয়েস</th>
                <th style={{fontWeight:'bold',textAlign:'center'}}>একাউন্টের নাম </th>
                <th style={{fontWeight:'bold',textAlign:'center'}}>লাইসেন্স </th>
                <th  style={{fontWeight:'bold',textAlign:'center'}}>পণ্যের নাম</th>
                <th  style={{fontWeight:'bold',textAlign:'center'}}>ক্রয় মূল্য</th>
                <th  style={{fontWeight:'bold',textAlign:'center'}}>বিক্রয় মূল্য</th>
                <th  style={{fontWeight:'bold',textAlign:'center'}}>ক্রয় পরিমান </th>
                <th  style={{fontWeight:'bold',textAlign:'center'}}>বিক্রয় পরিমান </th>
                <th  style={{fontWeight:'bold',textAlign:'center'}}>মজুদ পরিমান  </th>
          
              </tr>
            </thead>
            
              <tbody>
              <tr style={{ color: 'red', }}>
                <td style={{fontWeight: 'bold',textAlign:'center'}} colSpan="7">পূর্ববর্তী মজুদ</td>
                <td style={{ textAlign: 'right' }}>{previousDueamount}</td>
             
              </tr>
                {ledgerData&&ledgerData?.map((ledger,i)=>
                <>
                <tr key={i}>
                <td>{ledger.e_date}</td>
          
                <td style={{fontWeight:'bold', textAlign:'left'}}>{ledger.id}</td>

                <td style={{fontWeight:'bold', textAlign:'left'}}>{ledger.account_name}</td>
                <td style={{fontWeight:'bold', textAlign:'left'}}>{ledger.license_no}</td>
                <td style={{fontWeight:'bold', textAlign:'left'}}>{ledger.product_name}</td>
       <td style={{fontWeight:'bold', textAlign:'left', color:'red'}}>
  {isNaN(ledger.totalintk / ledger.inqty) ? '0.00' : (ledger.totalintk / ledger.inqty).toFixed(3)}
</td>
<td style={{fontWeight:'bold', textAlign:'left', color:'green'}}>
  {isNaN(ledger.totalouttk / ledger.outqty) ? '0.00' : (ledger.totalouttk / ledger.outqty).toFixed(3)}
</td>

                
  <td style={{ textAlign:'right'}}>{ledger.inqty==='0'?'.00':ledger.inqty}</td>
                <td style={{ textAlign:'right'}}>{ledger.outqty==='0'?'.00':parseFloat(ledger.outqty).toFixed(3)}</td>
                <td style={{ textAlign:'right'}}>{ledger.balance==='0'?'.00':parseFloat(ledger.balance).toFixed(3)}</td>
           
               
              </tr>
                </>
                )}
                 <tr style={{ fontWeight: 'bold', color: 'red' }}>
                <td colSpan="7">মোট  :</td>
                <td style={{ textAlign: 'right' }}>{numberWithCommas(totalPayment)}</td>
                <td style={{ textAlign: 'right' }}>{numberWithCommas(totalReceive)}</td>
                <td colSpan=""></td>
              </tr>
              </tbody>
              </table>
        </div>
      </div>
    </div>
  </div>



  </DemoContainer>
</LocalizationProvider>

      
    </div>
  );
};

export default ProductLedger;
