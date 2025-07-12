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
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const Ledger = () => {






 
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
  useEffect(()=>{
(async()=>{
//   const records = await pb.collection('Eligibility').getFullList({
  const acData = await fetchAc();
  settypes(acData)

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
  // console.log(startDate);
  



  const [ledgerForm, setLedgerform] = useState({
    ac_id: "Select..",
    start_date:fstartDate,
    end_date:fendDate,
  });
  const [ledgerData, setLedgerdata] = useState([]);
  const [previousDue, setPreviousdue] = useState();
// console.log(ledgerData);

  const getLedgerdata = async () => {
    const user_id = ledgerForm.ac_id;
    const start_date = startDate;
    const end_date = endDate;

    try {
        const response = await axiosInstance.get(`commondata/getLedger.php?user_id=${user_id}&start_date=${start_date}&end_date=${end_date}`);
        const data = response.data.data;

        let totalPay = 0;
        let totalRec = 0;
        let currentBalance = response.data.previous_due ? parseInt(response.data.previous_due) : 0;
        setPreviousdueamount(response.data.previous_due ? (parseInt(response.data.previous_due)) : 0);
console.log(typeof(parseInt(response.data.previous_due) ));

        const updatedLedgerData = data.map((entry) => {
            const payment = parseFloat(entry.payment) || 0;
            const receive = parseFloat(entry.receive) || 0;

            totalPay += payment;
            totalRec += receive;

            // Here we're assuming that payments reduce the balance and receipts increase the balance
            currentBalance = parseFloat( (currentBalance)) + payment - receive;

            return {
                ...entry,
                balance: currentBalance.toFixed(2),
            };
        });

        setLedgerdata(updatedLedgerData);
        setTotalPayment(totalPay.toFixed(2));
        setTotalReceive(totalRec.toFixed(2));
        setBalance(currentBalance.toFixed(2));

        setDisablebutton(updatedLedgerData.length === 0);
        if (updatedLedgerData.length === 0) {
            alert("No data found !!");
        }
    } catch (error) {
        console.log('Error fetching data');
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
      ac_id: value,
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


  const propsdata ={
    amountword:"",
    img:`/assets/bashundhara.png`,
    cname:'',
    address:'',
    contact:'',
    email:'',
    season:'2023 2024',
    prompt:'',
    date:'',
    billno:'',
    buyer:'',
    warehouse:"",
    sale:'',
    totalpkg:'',
    totalkg:'',
    subtotal:'',
    vat:"",
    grandtotal:""
  }
  function toProperCase(str) {
    if (!str) return ''; // Handle empty or null strings
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
const [accountsDetails, setAccountsDetails] = useState(null);
const selectac = [{
  ac_id: accountsDetails?.value,
  ac_name: accountsDetails?.label,
  address: accountsDetails?.address,
  contact: accountsDetails?.contact,
  start_date:fstartDate,
  end_date:fendDate,
}];



  useEffect(() => {
    // Filter the `types` array to find the account that matches `transactionForm.ac_id`
    const newdata = types.filter((type) => type.value === ledgerForm.ac_id);

    // Set the filtered data to the `accountsDetails` state, assuming only one match
    if (newdata.length > 0) {
      setAccountsDetails(newdata[0]);
    } else {
      setAccountsDetails(null); // Reset if no match
    }
  }, [ledgerForm.ac_id, types]); // Ensure `types` is a dependency if it changes
  
  const generatePDF = () => {
    const doc = new jsPDF("landscape");
    let pageCount = 1;
    let finalY = 110;
    // Add Logo at top left (adjust size and position as needed)
    doc.addImage("/assets/bashundhara.png", "PNG", 10, 5, 25, 20);

    // Company Header (Only on first page)
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("M/S TETULIA FILING STATION", 140, 10, { align: "center" });
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("Proprietor: MD AZAD", 140, 15, { align: "center" });
    doc.text("Address: BHAJANPUR,TETULIA,PANCHAGARH", 140, 20, { align: "center" });
    doc.text("Contact: 01777", 140, 25, { align: "center" });
    doc.line(10, 30, 280, 30); // Straight horizontal line


    // Account Info Section (Left side)
    doc.setFontSize(10);

    // A/C NAME
    doc.setFont("helvetica", "normal");
    doc.text("A/C NAME", 15, 35);
    doc.setFont("helvetica", "bold");
    doc.text(`: ${accountsDetails.label}`, 55, 35);
    
    // ADDRESS
    doc.setFont("helvetica", "normal");
    doc.text("ADDRESS", 15, 40);
    doc.setFont("helvetica", "bold");
    doc.text(`: ${accountsDetails.address}`, 55, 40);
    
    // CONTACT
    doc.setFont("helvetica", "normal");
    doc.text("CONTACT", 15, 45);
    doc.setFont("helvetica", "bold");
    doc.text(`: ${accountsDetails.contact}`, 55, 45);
    
    // DATE FROM
    doc.setFont("helvetica", "normal");
    doc.text("DATE FROM", 15, 50);
    doc.setFont("helvetica", "bold");
    doc.text(`: ${startDate} TO ${endDate}`, 55, 50);
    
    // Previous Balance (Right side)
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(`Previous Balance: ${numberWithCommas(parseFloat(previousDueamount))}`, 230, 50);

    // Ensure table starts below account info
    finalY = 55;

    // Table
    const columns = ["ID",  "Date","Remarks","Product", "Qty", "Rate", "Payment","Receive", "Balance"];
    const totalPayment = ledgerData.reduce((sum, item) => sum + (parseInt(item.payment) || 0), 0);
    const totalReceive = ledgerData.reduce((sum, item) => sum + (parseInt(item.receive) || 0), 0);
    const rows = ledgerData.map((item) => [
      { content: item.id, styles: { halign: "left" } },
      { content: item.e_date, styles: { halign: "left" } },
      { content: item.remarks, styles: { halign: "left" } },
      { content: item.name, styles: { halign: "left" } },
      { content: item.unit_2 === '0' ? "-" : item.unit_2, styles: { halign: "right" } },

      { content: item.s_rate === '0' ? "-" : numberWithCommas(item.s_rate), styles: { halign: "right" } },

      { content: item.payment === '0' ? "-" : numberWithCommas(item.payment), styles: { halign: "right" } },

      { content: item.receive === '0' ? "-" : numberWithCommas(item.receive), styles: { halign: "right" } },

      { content: numberWithCommas(item.balance), styles: { halign: "right", textColor: item.balance < 0 ? [255, 0, 0] : [0, 0, 0] } },
    ]);
    rows.push([
      { content: "Total", colSpan: 7, styles: { halign: "right", fontStyle: "bold" } },
      { content: numberWithCommas(totalPayment.toFixed(2)), styles: { halign: "right", fontStyle: "bold" } },
      { content: numberWithCommas(totalReceive.toFixed(2)), styles: { halign: "right", fontStyle: "bold" } },
      { content: "", styles: { halign: "right" } },
    ]);
    autoTable(doc, {
      head: [columns],
      body: rows,
      startY: finalY,
      theme: "striped",
      styles: { fontSize: 10 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      margin: { top: 20 },
      didDrawPage: (data) => {
        // Footer on every page
        doc.setFontSize(9);
        doc.setFont("helvetica", "italic");
        const timestamp = `Generated on: ${new Date().toLocaleString()}`;
        doc.text(timestamp, 15, 200);
        doc.text(`Page ${pageCount}`, 260, 200);
        pageCount++;
      },
    });

    window.open(doc.output("bloburl"), "_blank");
  };


  return (
    <div className="page-wrapper">
      
     
    <LocalizationProvider dateAdapter={AdapterDayjs}>
  <DemoContainer components={['DateField', 'DateField']}>





    <div style={{ fontFamily: 'Arial, sans-serif', padding: '10px',width:'100%' }}>
    {/* Header */}
    <div className="panel panel-default">
      <div className="panel-heading" style={{ padding: '10px 15px', backgroundColor: '#9daccc', color: '#4a235a', fontSize: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <strong>Account Statement/ Ledger</strong>
        {/* Navigation Buttons in Heading */}
        <div className="btn-group">
       
       
     
          <button type="button" className="btn btn-default">Traditional Ledger</button>
      
        </div>
      </div>
      <div className="panel-body">
        {/* Account Selector and Date Range */}
        <form className="form-inline" style={{ marginBottom: '20px' }}>
          <div className="form-group">
            <label htmlFor="account" style={{ marginRight: '10px' }}>Account</label>

              <FormField2
                    refs={inputRefs[0]}
                    sl={0}
                     handleKeyPress={handleKeyPress}
                     
                     name="ac_id"
                   
                      value={ledgerForm.ac_id.ac_id}
                      type="select"
                      options={types.map((type) => ({
                        value: type.value,
                        label: type.label,
                        address:type.address,
                        contact:type.contact,
                        type:type.actype
                      }))}
                      onChange={(value) => getSelectdata(value, "ac_id",0)}
                    />
          
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
          <button className="btn btn-default form-group"  disabled={disableButton} type="button" onClick={generatePDF}>Print</button>
          <LedgerViewer disableButton={disableButton} data={ledgerData} propsdata={propsdata} ledgerForm={selectac} previousDue={previousDueamount}/>
        </form>

<div className="header-table" style={{padding:'5px'}}>
<table width="100%">
  <tbody><tr align="center"> 
      <td width="72%" align="left" valign="top">&nbsp;</td>
      <td rowSpan={2}><em><strong><img src="https://cdn-icons-png.flaticon.com/512/8345/8345328.png" alt style={{height: 150, padding: 6}} onerror="this.onerror=null;this.src='../assets/img/profile.png';" /></strong></em></td>
    </tr>
    <tr align="center" valign="top"> 
      <td width="72%" height={151} align="left"><table width="100%">
          <tbody><tr> 
              <td width="16%" align="left" nowrap>একাউন্টের নাম</td>
              <td width="9%" align="center"><strong>:</strong></td>
              <td width="75%" align="left" nowrap><strong>{accountsDetails?.label}</strong></td>
            </tr>
            <tr> 
              <td width="16%" align="left" nowrap>ঠিকানা </td>
              <td width="9%" align="center"><strong>:</strong></td>
              <td width="75%" align="left" nowrap><strong>{accountsDetails?.address}</strong></td>
            </tr>
            <tr> 
              <td width="16%" align="left" nowrap>মোবাইল </td>
              <td width="9%" align="center"><strong>:</strong></td>
              <td width="75%" align="left" nowrap><strong>{accountsDetails?.contact}</strong></td>
            </tr>
            <tr> 
              <td align="left" nowrap>লিমিট </td>
              <td align="center"><strong>:</strong></td>
              <td align="left" nowrap><strong>{accountsDetails?.limit}</strong></td>
            </tr>
           
            <tr> 
              <td width="16%" align="left" nowrap>তারিখ</td>
              <td width="9%" align="center"><strong>:</strong></td>
              <td width="75%" align="left" nowrap className="bn-font">{startDate}<strong> হইতে</strong> {endDate}</td>
            </tr>
          </tbody></table></td>
    </tr>
  </tbody></table>
 <h3  className="header-table" style={{textAlign: 'center', marginTop: 15, marginBottom: 10}}> একাউন্ট লেজার/খতিয়ান  </h3>
  
</div>

        {/* Actions and Search Bar */}
       


        {/* Table */}
        <div className="table-responsive ledger">
    <table className="statement-table">
        <thead>
            <tr style={{ backgroundColor: '#e0e7f5', color: '#333' }}>
                <th style={{ fontWeight: 'bold', textAlign: 'center' }}>তারিখ</th>
                <th style={{ fontWeight: 'bold', textAlign: 'center' }}>মন্তব্য</th>
                <th style={{ fontWeight: 'bold', textAlign: 'center' }}>পণ্যের নাম</th>
                <th style={{ fontWeight: 'bold', textAlign: 'center' }}>পরিমাণ</th>
                <th style={{ fontWeight: 'bold', textAlign: 'center' }}>দর</th>
                <th style={{ fontWeight: 'bold', textAlign: 'center' }}>প্রদান</th>
                <th style={{ fontWeight: 'bold', textAlign: 'center' }}>গ্রহণ</th>
                <th style={{ fontWeight: 'bold', textAlign: 'center' }}>ব্যালান্স</th>
                <th style={{ fontWeight: 'bold', textAlign: 'center' }}>লেনদেনের ধরন</th>
                <th style={{ fontWeight: 'bold', textAlign: 'center' }}>ইউজার</th>
            </tr>
        </thead>
        <tbody>
            <tr style={{ color: 'red' }}>
                <td style={{ fontWeight: 'bold', textAlign: 'center' }} colSpan="7">পূর্ববর্তী বকেয়া</td>
                <td style={{ textAlign: 'right', fontWeight: 'bold' }}>
                    {numberWithCommas(parseFloat(previousDueamount))}
                </td>
                <td></td>
                <td></td>
            </tr>
            {ledgerData && ledgerData.map((ledger, i) => (
                <tr key={i}>
                    <td>{ledger.e_date}</td>
                    <td style={{ textAlign: 'left' }}>
                        {ledger.payment === '0' && ledger.sell_type === 'TRANSACTION' ? (
                            <span><strong>Receive</strong>---{ledger.remarks}</span>
                        ) : ledger.receive === '0' && ledger.sell_type === 'TRANSACTION' ? (
                            <span><strong>Payment</strong>---{ledger.remarks}</span>
                        ) : (
                            ledger.remarks
                        )}
                    </td>
                    <td style={{ fontWeight: 'bold', textAlign: 'center' }}>{ledger.name}</td>
                    <td style={{ textAlign: 'center' }}><span className="text-bold">{ledger.unit_2 === '0' ? '.00' : ledger.unit_2}</span> Ltr</td>
                    <td style={{ textAlign: 'center' }}>{ledger.s_rate === '0' ? '.00' : ledger.s_rate}</td>
                    <td style={{ textAlign: 'right' }}>{ledger.payment === '0' ? '.00' : numberWithCommas(ledger.payment)}</td>
                    <td style={{ textAlign: 'right' }}>{ledger.receive === '0' ? '.00' : numberWithCommas(ledger.receive)}</td>
                    <td style={{ textAlign: 'right', color: ledger.balance >= 0 ? 'green' : 'red' }}>
                        {numberWithCommas(ledger.balance)}
                    </td>
                    <td style={{ textAlign: 'center' }}>{toProperCase(ledger.sell_type)}</td>
                    <td>{ledger.posted}</td>
                </tr>
            ))}
            <tr style={{ fontWeight: 'bold', color: 'red' }}>
                <td colSpan="5">মোট :</td>
                <td style={{ textAlign: 'right' }}>{numberWithCommas(totalPayment)}</td>
                <td style={{ textAlign: 'right' }}>{numberWithCommas(totalReceive)}</td>
                <td colSpan="3"></td>
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

export default Ledger;
