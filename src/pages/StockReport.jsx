import * as React from 'react';
import { useState,useEffect } from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateField } from '@mui/x-date-pickers/DateField';
import { Box, Typography, Grid, Button, TextField, CircularProgress } from '@mui/material';
import axiosInstance from '../utils/axios';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import FormField2 from '../components/reuseable/FormField2';
import numberWithCommas from '../utils/numberWithCommas';
export default function StockReport() {
  const [startDate, setStartDate] = React.useState(dayjs());
  const [endDate, setEndDate] = React.useState(dayjs());
  const [loading, setLoading] = React.useState(false);
  const [filterMenu, setFiltermenu] = useState([]);
  const [salesType, setSalestype] = React.useState('');
  const [balanceType, setBalancetype] = React.useState('');
  const [saleReport, setSalesreport] = useState([])

  const handleStartDateChange = (date) => {
    setStartDate(date);
    console.log('Start Date:', date.format('YYYY-MM-DD'));
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    console.log('End Date:', date.format('YYYY-MM-DD'));
  };

  const handleChange = (event) => {
    setSalestype(event.target.value);
  };
  const handleBalanceTypeChange = (event) => {
    setBalancetype(event.target.value); // Update balance type value when user selects an option
  };

  const handleShowDates = async () => {
    setLoading(true); // Set loading to true when fetching data

    try {
      const response = await axiosInstance.get(`commondata/fetchStock.php?type=${salesType}`);
      setSalesreport(response.data);
      setFiltermenu(response.data);
    } catch (error) {
      console.log('Error fetching data');
    }

    setTimeout(() => {
      setLoading(false); // Set loading to false after data fetching is complete
    }, 2000); // Example: Simulate 2 seconds delay
  };

  const totalPayment = filterMenu.reduce((total, item) => total + parseInt(item.payment), 0);
  const totalReceive = filterMenu.reduce((total, item) => total + parseInt(item.stockbalance), 0);

  // Inside your TransactionReport component
  const uniqueSubtypes = Array.from(new Set(filterMenu.map(item => item.subtype)));
  const handleSubtypeFilter = (subtype) => {
    // Filter filterMenu based on subtype
    let filteredData;
    if (subtype === 'PAY') {
      filteredData = filterMenu.filter(item => parseInt(item.balance) < 0);
    } else if (subtype === 'REC') {
      filteredData = filterMenu.filter(item => parseInt(item.balance) > 0);
    } else {
      filteredData = filterMenu.filter(item => parseInt(item.balance) !== 0);
    }
    setFiltermenu(filteredData);
  };
  

  const [typeList, setTypelist] = useState([]);
  const fetchTypes = async () => {
    try {
      const response = await axiosInstance.get("/commondata/getCategory.php");
  
      const updatedAcarray = response?.data?.map((item) => ({
        value: item.name,
        label: item.name,
        
      }));
  
      return updatedAcarray;
    } catch (error) {
      console.error("Error:", error);
      return [];
    }
  };
  useEffect(() => {
    (async()=>{
      const typesArray = await fetchTypes();
      setTypelist(typesArray);
    })()

  }, [])



  return (
    <div className="page-wrapper">
    <section className='content '>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateField', 'DateField']}>




        <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px',width:'100%' }}>
  {/* Header */}
  <div className="panel panel-default">
    <div className="panel-heading" style={{ padding: '10px 15px', backgroundColor: '#7d9a9c', color: '#4a235a', fontSize: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <strong>Stock Report</strong>
      {/* Navigation Buttons in Heading */}
     
    </div>
    <div className="panel-body">
      {/* Account Selector and Date Range */}
      <form className="form-inline" style={{ marginBottom: '20px' }}>
    

      <div className="form-group">
          <label htmlFor="account" style={{ marginRight: '10px' }}>Category</label>
          <select value={salesType} onChange={handleChange} className='form-control'>
            <option value="">Select..</option>
            <option  key="ALL" value="ALL"> ALL</option>
          {typeList.map((item) => (
             <option  key={item.value} value={item.value}> {item.label}</option>

))}

</select>
  
        </div>


        <button type="submit" className="btn btn-default" style={{ marginLeft: '20px' }} onClick={handleShowDates} disabled={loading}>Go</button>
      </form>

   

      {/* Table */}
      <div className="table-responsive ledger">
      <table className="table" >
            <thead style={{background:'#FFF8E1'}}>
              <tr>
                <th style={{ border: '1px solid #79a4ca' }} scope="col">#</th>
                <th style={{ border: '1px solid #79a4ca' }} scope="col">পণ্যের নাম </th>
                <th style={{ border: '1px solid #79a4ca' }} scope="col">ধরন  </th>
                <th style={{ border: '1px solid #79a4ca' }} scope="col">মজুদ</th>
                <th style={{ border: '1px solid #79a4ca' }} scope="col"> গড় মূল্য  </th>
                <th style={{ border: '1px solid #79a4ca' }} scope="col"> মজুদ   </th>
        
              </tr>
            </thead>
            <tbody>
              {filterMenu?.map((item, index) => (
                <tr key={index}>
                  <th style={{border: '1px solid #79a4ca'}} scope="row">{index + 1}</th>
                  <td style={{border: '1px solid #79a4ca',fontWeight:'bold'}}>{item.NAME}</td>
                  <td style={{border: '1px solid #79a4ca'}}>{item.category}</td>
                  <td style={{border: '1px solid #79a4ca',textAlign:'right'}}>{item.stockinunit2==='0'?'.00':numberWithCommas(parseFloat(item.stockinunit2).toFixed(3))}</td>
                  <td style={{border: '1px solid #79a4ca',textAlign:'right',color: parseFloat(item.avgstockunit2) > 10 ? 'green' : 'red'}}>{item.avgstockunit2==='0'?'.00':numberWithCommas(parseFloat(item.avgstockunit2).toFixed(3))}</td>
                  <td style={{border: '1px solid #79a4ca',textAlign:'right'}}>{numberWithCommas(parseFloat(item.stockbalance).toFixed(2))}</td>
                  
                 
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="5" style={{color:'red',fontWeight:'bold'}}><b>Total:</b></td>
              
                <td style={{textAlign:'right',fontWeight:'bold'}}>{numberWithCommas(parseFloat(totalReceive).toFixed(2))}</td>
             
              </tr>
            </tfoot>
          </table>
        {/* <table className="table table-bordered">
          <thead>
            <tr style={{ backgroundColor: '#e0e7f5', color: '#333' }}>
              <th>Date</th>
              <th>Transaction Type</th>
              <th>Memo No</th>
              <th>Payment</th>
              <th>Receiver</th>
              <th>Balance</th>
              <th>Description</th>
              <th>User</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ color: 'red', fontWeight: 'bold' }}>
              <td colSpan="7">Previous Balance</td>
              <td style={{ textAlign: 'right' }}>-8,80,000.00</td>
            </tr>
            <tr>
              <td>12/07/2022</td>
              <td>Purchase</td>
              <td style={{ color: '#007bff' }}>70</td>
              <td style={{ textAlign: 'right' }}>.00</td>
              <td style={{ textAlign: 'right' }}>8,80,000.00</td>
              <td style={{ textAlign: 'right', color: 'red' }}>-8,80,000.00</td>
              <td></td>
              <td>hamid</td>
            </tr>
            <tr>
              <td>12/07/2022</td>
              <td>Payment</td>
              <td style={{ color: '#007bff' }}>10777</td>
              <td style={{ textAlign: 'right' }}>10,000.00</td>
              <td style={{ textAlign: 'right' }}>.00</td>
              <td style={{ textAlign: 'right', color: 'red' }}>-8,70,000.00</td>
              <td></td>
              <td>hamid</td>
            </tr>
            <tr>
              <td>12/07/2022</td>
              <td>Payment</td>
              <td style={{ color: '#007bff' }}>10778</td>
              <td style={{ textAlign: 'right' }}>5,00,000.00</td>
              <td style={{ textAlign: 'right' }}>.00</td>
              <td style={{ textAlign: 'right', color: 'red' }}>-3,70,000.00</td>
              <td>Sonali Bank</td>
              <td>hamid</td>
            </tr>
            <tr style={{ fontWeight: 'bold', color: 'red' }}>
              <td colSpan="3">Total :</td>
              <td style={{ textAlign: 'right' }}>5,10,000.00</td>
              <td style={{ textAlign: 'right' }}>8,80,000.00</td>
              <td colSpan="3"></td>
            </tr>
          </tbody>
        </table> */}
      </div>
    </div>
  </div>
</div>
</DemoContainer>
      </LocalizationProvider>



      
    </section>
  </div>
  );
}
