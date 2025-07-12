import * as React from 'react';
import { useState } from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateField } from '@mui/x-date-pickers/DateField';
import { Box, Typography, Grid, Button, TextField, CircularProgress } from '@mui/material';
import numberWithCommas from '../utils/numberWithCommas';
import axiosInstance from '../utils/axios';
export default function TransactionReport() {
  const [startDate, setStartDate] = React.useState(dayjs());
  const [endDate, setEndDate] = React.useState(dayjs());
  const [loading, setLoading] = React.useState(false);


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

  const [fstartDate, setFstartDate] = useState(currentDateUTC6);
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
const [transactionReport, settransactionReport] = useState([])
const [filterMenu, setFiltermenu] = useState([])
  const handleShowDates = async() => {
    setLoading(true); // Set loading to true when fetching data


    const start_date = fstartDate;
    const end_date = fendDate;
    
    try {
      const response = await axiosInstance.get(`commondata/getTransaction.php?start_date=${start_date}&end_date=${end_date}`);
      settransactionReport(response.data);
      setFiltermenu(response.data)
    } catch (error) {
     console.log('Error fetching data');
    }
    


    setTimeout(() => {
      setLoading(false); // Set loading to false after data fetching is complete
    }, 2000); // Example: Simulate 2 seconds delay
  };

  
  
  const totalPayment = filterMenu.reduce((total, item) => total + parseInt(item.payment), 0);
  const totalReceive = filterMenu.reduce((total, item) => total + parseInt(item.receive), 0);
  // Inside your TransactionReport component
const uniqueSubtypes = Array.from(new Set(transactionReport.map(item => item.subtype)));

const handleSubtypeFilter = (subtype) => {
  // Filter transactionReport based on subtype
  const filteredData = transactionReport.filter(item => item.subtype === subtype);
  setFiltermenu(filteredData);
};
  return (
     <div className="page-wrapper">
      <section className='content '>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={['DateField', 'DateField']}>




          <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px',width:'100%' }}>
    {/* Header */}
    <div className="panel panel-default">
      <div className="panel-heading" style={{ padding: '10px 15px', backgroundColor: '#69c39f', color: '#4a235a', fontSize: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <strong>Transaction Report</strong>
        {/* Navigation Buttons in Heading */}
        <div className="btn-group">

        {uniqueSubtypes.map((subtype, index) => (
           <button type="button"     onClick={() => handleSubtypeFilter(subtype)} className="btn btn-default">    {subtype}</button>
   
  ))}
         
        </div>
      </div>
      <div className="panel-body">
        {/* Account Selector and Date Range */}
        <form className="form-inline" style={{ marginBottom: '20px' }}>
      
          <div className="form-group" style={{ marginLeft: '20px' }}>
            <label htmlFor="fromDate" style={{ marginRight: '10px' }}>Date</label>
            <DateField
              id="startDateInput"
              defaultValue={dayjs(startDate)}
              format="YYYY-MM-DD"
              className="p-5 form-group"
              onChange={handleStartDateChange}
            />
            
            <label htmlFor="toDate" style={{ margin: '0 10px' }}>to</label>
            <DateField
              id="startDateInput"
              defaultValue={dayjs(endDate)}
              format="YYYY-MM-DD"
              className="p-5 form-group"

              onChange={handleEndDateChange}
            />
           
          </div>
          <button type="submit" className="btn btn-default" style={{ marginLeft: '20px' }} onClick={handleShowDates} disabled={loading}>Go</button>
        </form>

     

        {/* Table */}
        <div className="table-responsive ledger">
        <table className="table" >
              <thead style={{background:'#e38bb9'}}>
                <tr>
                  <th style={{ border: '1px solid #79a4ca' }} scope="col">#</th>
                  <th style={{ border: '1px solid #79a4ca' }} scope="col">মেমো নম্বর </th>
                  <th style={{ border: '1px solid #79a4ca' }} scope="col">তারিখ </th>
                  <th style={{ border: '1px solid #79a4ca' }} scope="col">গ্রাহকের নাম </th>
                  <th style={{ border: '1px solid #79a4ca' }} scope="col">একাউন্টের ধরণ</th>
                  <th style={{ border: '1px solid #79a4ca' }} scope="col"> প্রদান </th>
                  <th style={{ border: '1px solid #79a4ca' }} scope="col"> গ্রহন  </th>
                  <th style={{ border: '1px solid #79a4ca' }} scope="col">বিবরণ</th>
                  <th style={{ border: '1px solid #79a4ca' }} scope="col">ইউজার </th>
                </tr>
              </thead>
              <tbody>
                {filterMenu?.map((item, index) => (
                  <tr key={index}>
                    <th style={{border: '1px solid #79a4ca'}} scope="row">{index + 1}</th>
                    <td style={{border: '1px solid #79a4ca'}} >{item.inv_id}</td>
                    <td style={{border: '1px solid #79a4ca'}}>{item.e_date}</td>
                    <td style={{border: '1px solid #79a4ca',fontWeight:'bold'}}>{item.ac_name}</td>
                    <td style={{border: '1px solid #79a4ca'}}>{item.subtype}</td>
                    <td style={{border: '1px solid #79a4ca',textAlign:'right'}}>{item.payment==='0'?'.00':item.payment}</td>
                    <td style={{border: '1px solid #79a4ca',textAlign:'right'}}>{item.receive==='0'?'.00':item.receive}</td>
                    <td style={{border: '1px solid #79a4ca',textAlign:'center'}}>{item.remarks}</td>
                    <td style={{border: '1px solid #79a4ca',textAlign:'center'}}>{item.posted}</td>
                   
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="5" style={{color:'red',fontWeight:'bold'}}><b>Total:</b></td>
                
                  <td style={{textAlign:'right',fontWeight:'bold'}}>{numberWithCommas(totalPayment)}</td>
                  <td style={{textAlign:'right',fontWeight:'bold'}}>{numberWithCommas(totalReceive)}</td>
                  <td></td>
                  <td></td>
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
