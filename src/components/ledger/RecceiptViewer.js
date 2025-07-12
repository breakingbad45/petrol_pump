import React,{useState,useEffect} from 'react';
import pb from '../../utils/pocketbase';
import numberWithCommas from '../../utils/numberWithCommas';
import { numberToWords } from 'amount-to-words';
import bn, { engToDate } from "number-to-bangla";
import axiosInstance from '../../utils/axios';
const formattedDate = new Date();

// Convert the UTC time to UTC+6
const utcPlus6Date = new Date(formattedDate.getTime() + (6 * 60 * 60 * 1000));

// Format the date and time as desired
const currentDate = utcPlus6Date.toISOString().slice(0, 10); // YYYY-MM-DD

const fuser = localStorage.getItem('user');
const user =JSON.parse(fuser)
const date = user?.mode === "0" ? user.date : currentDate;

const ReceiptViewer = ({ data}) => {


  const numberToWord = (number) => {
    const words = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
    const digits = number.toString().split('').map(Number);
    const wordArray = digits.map(digit => words[digit]);
    return wordArray.join(' ');
};

  const company = {
    img:`/assets/img/5.jpg`,
    cname:'ssssssssssssssss',
    address:'sssssssssssssss',
    contact:'sssssssssssssssssss',
    email:'ssssssssssssssss',
};
const [invoicedata, setinvoicedata] = useState([]);
console.log(invoicedata);

const [due, setdue] = useState();

  useEffect(() => {
   (async()=>{

    
    const response = await axiosInstance.get(`/transactions/getReceipt.php?id=${data}`);
   const response2 = await axiosInstance.get(`/commondata/fetchSelectedAc.php?id=${response.data[0].clientid}`);
           
            
            setdue(numberWithCommas(Number(response2?.data[0]?.balance).toFixed(2)))
  setinvoicedata(response.data)


   })()
  }, []);

  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

 
  
    // Function to convert English digits to Bengali digits
    const toBn = (number) => {
      let bengaliNumber = '';
      for (let i = 0; i < number.length; i++) {
        if (bengaliDigits.hasOwnProperty(number[i])) {
          bengaliNumber += bengaliDigits[number[i]];
        } else {
          bengaliNumber += number[i];
        }
      }
      return bengaliNumber;
    };
  
 


  const subtotal = invoicedata.reduce((accumulator, currentValue) => accumulator + Number(currentValue.total_tk), 0);
  const totalbag = invoicedata.reduce((accumulator, currentValue) => accumulator + currentValue.unit_1, 0);
  const totalkg = invoicedata.reduce((accumulator, currentValue) => accumulator + currentValue.unit_2, 0);

  const handleButtonClick = () => {
   
    const currentDateTime = new Date();

    const amount = Number(invoicedata[0].payment==="0"?invoicedata[0].receive:invoicedata[0].payment);
    const amountword = bn.engToWord(amount, true)
    
    const formattedDateTime = `${currentDateTime.toLocaleDateString()} ${currentDateTime.toLocaleTimeString()}`;
    const newTab = window.open();
    newTab.document.write(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Money Receipt</title>
        <style>
          @import url('https://fonts.maateen.me/solaiman-lipi/font.css');
            
          body {
            font-family: 'SolaimanLipi', sans-serif;
            font-size: 16px;
            margin: 0;
            display: flex;
            justify-content: center;
            min-height: 100vh;
          }
          .wrapper {
            width: 8.3in;
          }
          .bill-size {
            width: 780px;
            height: 4.1in;
            border-bottom: 1px dashed black;
            padding: 5px 50px;
            margin-bottom: 70px;
          }
          .admit-title {
            border: 1px dashed black;
            background: white;
            padding: 7px 20px;
            font-size: 16px;
            color: #000;
            font-weight: bold;
          }
          #content img {
            position: absolute;
            top: 0;
            right: 0;
          }
          .header {
            border-bottom: 1px dashed #000;
            margin-bottom: 4px;
            padding: 0;
          }
          h1 {
            font-size: 26px;
            margin: 0;
            color: black;
          }
          h2 {
            font-size: 14px;
            margin: 0;
            font-weight: 500;
          }
          .title {
            font-weight: bold;
            font-size: 13px;
            text-align: center;
            padding-bottom: 5px;
            margin-bottom: 6px;
            border-bottom: 1px dashed;
          }
          .table-item {
            counter-reset: rowNumber;
          }
          table tr:not(:first-child) {
            counter-increment: rowNumber;
          }
          .table-item tr td:first-child::before {
            content: counter(rowNumber);
          }
          .RFtable tr:nth-child(odd) {
            border-bottom: 1px dashed #000000;
            background: #FAFAFA;
          }
          .RFtable tr:nth-child(even) {
            border-bottom: 1px dashed #000000;
            background: #FFF;
          }
          .signature {
            margin-top: 18px;
          }
          .footer {
            margin-top: 7px;
            border-top: 1px dashed;
            padding: 5px;
            text-align: center;
            font-size: 12px;
          }
          .photo {
            z-index: 10;
            position: absolute;
          }
        </style>
      </head>
      <body>
        <div class="bill-size">
          <div>
            <table width="100%" cellspacing="0">
              <tbody>
                <tr valign="top">
                  <td width="15%" rowspan="3" align="left"></td>
                  <td width="70%" align="center">
                    <h1>${user.company}</h1>
                    <h2>${user.address}</h2>
                  </td>
                  <td width="15%" rowspan="3" align="right"></td>
                </tr>
                <tr>
                  <td height="30" align="center">
                    <span class="admit-title">জমা রশিদ</span>
                  </td>
                </tr>
                <tr></tr>
              </tbody>
            </table>
          </div>
          <hr style="border: none; border-top: 1px dashed grey;">
          <table width="100%" cellspacing="0" style="margin:0px 10px;">
            <tr align="left">
              <td width="7%" nowrap="">রিসিপ্ট নং</td>
              <td width="2%" nowrap=""><strong>:</strong></td>
              <td width="5%" style="border-bottom:1px dashed black;" nowrap=""><strong>${invoicedata[0].inv_id}</strong></td>
              <td width="60%"></td>
              <td width="7%">তারিখ</td>
              <td width="2%"><strong>:</strong></td>
              <td width="17%" style="border-bottom:1px dashed black;"><strong>${engToDate(invoicedata[0].e_date)}</strong></td>
            </tr>
          </table>
          <table width="100%" cellspacing="0" style="margin:10px;">
            <tr align="left">
              <td width="12%" nowrap="">নাম</td>
              <td width="2%" nowrap=""><strong>:</strong></td>
              <td width="86%" style="border-bottom:1px dashed black;" nowrap=""><strong>${invoicedata[0].name}</strong></td>
            </tr>
          </table>
          <table width="100%" cellspacing="0" style="margin:10px;">
            <tr align="left">
              <td width="12%" nowrap="">টাকা</td>
              <td width="2%" nowrap=""><strong>:</strong></td>
              <td width="86%" style="border-bottom:1px dashed black;" nowrap=""><strong>${amountword}</strong></td>
            </tr>
          </table>
          <table width="100%" cellspacing="0" style="margin:10px;">
            <tr align="left">
              <td width="12%" nowrap="">মন্তব্য</td>
              <td width="2%" nowrap=""><strong>:</strong></td>
              <td width="43%" style="border-bottom:1px dashed black;" nowrap=""><strong>${invoicedata[0].remarks}</strong></td>
              <td width="12%" nowrap="">বর্তমান বকেয়া </td>
              <td width="2%" nowrap=""><strong>:</strong></td>
              <td width="43%" style="border-bottom:1px dashed black;" nowrap=""><strong>${due}</strong></td>
            </tr>
          </table>
          <br>
          <strong style="margin: 0px 10px;">টাকার পরিমাণ : <span style="border: 1px solid black; padding: 5px 65px;">${toBn(numberWithCommas(amount.toFixed(2)))}</span></strong>
          <br><br><br><br>
          <table width="100%" cellspacing="0">
            <tbody>
              <tr>
                <td width="33%" height="34" align="center" valign="top">
                  <hr style="border: none; border-top: 1px dashed grey;">
                  <strong>দাতার  স্বাক্ষর</strong>
                </td>
                <td width="33%" align="center" valign="top"></td>
                <td width="33%" align="center" valign="top">
                  <hr style="border: none; border-top: 1px dashed grey;">
                  <strong>গ্রহীতার স্বাক্ষর</strong>
                </td>
              </tr>
            </tbody>
          </table>
          <center style="font-size: 10px; text-align: center;">
            <hr>
            <samp>Generated by ${invoicedata[0].posted} | Printing Time: ${formattedDateTime}</samp>
          </center>
        </div>
      </body>
      </html>
    `);
    
    newTab.document.close();
  
    // Close the tab after printing or canceling
    newTab.onafterprint = () => {
      newTab.close();
    };
    newTab.print();
  };

  return (
    
      <a className="me-3" onClick={handleButtonClick}>
                <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-printer"><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><path d="M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6" /><rect x={6} y={14} width={12} height={8} rx={1} /></svg>
 </a>
     
    
  );
};

export default ReceiptViewer;
