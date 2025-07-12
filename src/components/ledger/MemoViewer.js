import React ,{useEffect,useState}from 'react';
import { numberToWords } from 'amount-to-words';
import pb from '../../utils/pocketbase';
import numberWithCommas from '../../utils/numberWithCommas';
const MemoViewer = ({props}) => {
    const [curdue, setcurdue] = useState([]);

    const fetchAcDue = async () => {
      try {
          const record = await pb.collection('ac_due').getFirstListItem(`ac_id="${props.ac_id}"`);
          setcurdue(record.asdue);
      } catch (error) {
          console.error('Error fetching ac_due:', error);
      }
  };
    const company = {
        img:`/assets/img/${pb.authStore.model.username}.jpg`,
        cname:pb.authStore.model.expand.reference.Company_name,
        address:pb.authStore.model.expand.reference.Localoffice,
        contact:pb.authStore.model.expand.reference.Contact_number,
        email:pb.authStore.model.expand.reference.Email_address,
    };
    const amountword = numberToWords(props.payment !=0?props.payment:props.receive).toUpperCase()
    const amount = props.payment !=0?props.payment:props.receive
    const remarks = props.remarks.toUpperCase()
    const edate = props.date
    const invid=props.c_id
    const amountTitle = props.payment !==0?"Pay":"Receive"

    
  const openNewTab = () => {
    fetchAcDue()
    const currentDateTime = new Date();
    const formattedDateTime = `${currentDateTime.toLocaleDateString()} ${currentDateTime.toLocaleTimeString()}`;
    const newTab = window.open('', '_blank');

    newTab.document.write(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="styles.css">
        <title>Memo</title>
    <style>
    
    body {
                font-family: 'Courier New', Courier, monospace;
                font-size: 16px;
                margin: 0; /* Remove default body margin */
                display: flex;
                justify-content: center;
             background-color: aliceblue;
                min-height: 100vh; /* Ensure full height of the viewport */
            }
    
    
    
      .wraper {
        width: 8.3in;
    }
    .bill-size{
      background-color: #FAFAFA;
         width: 800px;
        height: 4.3in;
         border: 1px dashed black;
        padding: 5px 50px;
        margin-bottom: 70px;
        }
        .admit-title {
            background: black;
            padding: 7px 20px 7px 20px;
            font-size: 16px;
            color: #fff;
            font-weight: bold;
        }
         #content img {
            position: absolute;
            top: 0px;
            right: 0px;
        }
        .header {border-bottom:1px dashed #000;margin-bottom: 4px;padding: 0px;}
        h1 {font-size: 18px; margin:0;color: black;}
        h2 {font-size: 14px;margin:0; font-weight: 500;}
        .title{
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
        border: none;
        border-bottom: 1px dashed #000000;
        background: #FAFAFA;
    }
    .RFtable tr:nth-child(even) {
        border: none;
        border-bottom: 1px dashed #000000;
        background: #FFF;
    }
    .signature {margin-top: 18px;}
    .footer {
        margin-top: 7px;
        border-top: 1px dashed;
        padding: 5px;
        text-align: center;
        font-size: 12px;
    }
    
    .photo{z-index: 10;  
    position: absolute;  
     }
        </style>
    </head>
    <body>
    <div class="bill-size" > 
      <div> 
        <table width="100%" cellspacing="0">
          <tbody>
            <tr valign="top"> 
              <td width="15%" rowspan="3" align="left"><img src="${company.img}" height="80" alt="" "=""> 
              </td>
              <td width="70%" align="center"> <h1 style="font-size: 26px;">${company.cname}
                </h1>
                <h2> ${company.address}</h2></td>
                <td width="15%" align="center" valign="center" nowrap="">
                  <svg id="barcode" :value="sku" width="140px" height="20px" x="0px" y="0px" viewBox="0 0 119 20" xmlns="http://www.w3.org/2000/svg" version="1.1" style="transform: translate(0,0)"><rect x="0" y="0" width="119" height="20" style="fill:#ffffff;"></rect><g transform="translate(0, 0)" style="fill:#333;"><rect x="0" y="0" width="3" height="20"></rect><rect x="4.5" y="0" width="1.5" height="20"></rect><rect x="9" y="0" width="4.5" height="20"></rect><rect x="16.5" y="0" width="3" height="20"></rect><rect x="24" y="0" width="1.5" height="20"></rect><rect x="28.5" y="0" width="1.5" height="20"></rect><rect x="33" y="0" width="1.5" height="20"></rect><rect x="37.5" y="0" width="3" height="20"></rect><rect x="43.5" y="0" width="1.5" height="20"></rect><rect x="49.5" y="0" width="4.5" height="20"></rect><rect x="55.5" y="0" width="1.5" height="20"></rect><rect x="58.5" y="0" width="6" height="20"></rect><rect x="66" y="0" width="1.5" height="20"></rect><rect x="70.5" y="0" width="4.5" height="20"></rect><rect x="76.5" y="0" width="3" height="20"></rect><rect x="82.5" y="0" width="1.5" height="20"></rect><rect x="85.5" y="0" width="6" height="20"></rect><rect x="94.5" y="0" width="1.5" height="20"></rect><rect x="99" y="0" width="3" height="20"></rect><rect x="106.5" y="0" width="4.5" height="20"></rect><rect x="112.5" y="0" width="1.5" height="20"></rect><rect x="115.5" y="0" width="3" height="20"></rect></g></svg><br>	
                  <strong style="margin-bottom:3px;">
               
                  DATE: ${edate}</strong> </td>
            </tr>
            
            <tr> 
              <td height="30" align="center"><span class="admit-title ">Money Receipt          </span></td>
            </tr>
            <tr> 
              
            </tr>
          </tbody>
          <tfoot>
        </tfoot></table>
      </div>
      <hr style="border: none; border-top: 1px dashed grey; ">
    
        <table class="" width="100%" cellspacing="0" style="margin:0px 10px;">
          <tr align="left"> 
            <td width="7%" nowrap="">Memo No</td>
            <td width="2%" nowrap=""><strong>:</strong></td>
            <td width="5%" style="border-bottom:1px dashed black ;" nowrap=""><strong>${invid}</strong></td>
            <td width="60%"></td>
            <td width="7%">Date</td>
            <td width="2%"><strong>:</strong></td>
            <td width="17%" style="border-bottom:1px dashed black ;"><strong>${edate}</strong></td>
         
          </tr>
        </tbody>
      </table>
    
      <table class="" width="100%" cellspacing="0" style="margin: 10px;"> 
        <tr align="left"> 
          <td width="12%" nowrap="">Name</td>
          <td width="2%" nowrap=""><strong>:</strong></td>
          <td width="86%" style="border-bottom:1px dashed black ;" nowrap=""><strong>${props.ac_name}</strong></td>
         
        </tr>
        
      </table>
     
      <table class="" width="100%" cellspacing="0" style="margin: 10px;">
        <tr align="left"> 
          <td width="12%" nowrap="">Amount</td>
          <td width="2%" nowrap=""><strong>:</strong></td>
          <td width="86%" style="border-bottom:1px dashed black ;" nowrap=""><strong>${amountword} Tk Only</strong></td>
         
        </tr>
        
      </table>
      <table class="" width="100%" cellspacing="0" style="margin: 10px;">
        <tr align="left"> 
          <td width="12%" nowrap="">Remarks</td>
          <td width="2%" nowrap=""><strong>:</strong></td>
          <td width="43%" style="border-bottom:1px dashed black ;" nowrap=""><strong>${remarks}</strong></td>
          <td width="12%" nowrap="">Current due</td>
          <td width="2%" nowrap=""><strong>:</strong></td>
          <td width="43%" style="border-bottom:1px dashed black ;" nowrap=""><strong>${numberWithCommas(curdue)}/-</strong></td>
       
        </tr>
        
    
    </table>
     
      <br>
      <strong style="margin: 0px 10px;">${amountTitle} Amount: <span style="border: 1px solid black;padding: 5px 65px;">${numberWithCommas(amount.toFixed(2))} /-</span> </strong> 
                        
      <br>
      <br>
      <br>
      <br>
      <table class="" width="100%" cellspacing="0">
        <tbody>
        
          <tr> 
            <td width="33%" height="34" align="center" valign="top">
              <hr style="border: none; border-top: 1px dashed grey;">
              <strong> Payer/Receiver Signature</strong></td>
            <td width="33%" align="center" valign="top">&nbsp;</td>
            <td width="33%" align="center" valign="top">
               <hr style="border: none; border-top: 1px dashed grey;">
              <strong> Authorized Signature</strong></td>
          </tr>
        </tbody>
        <tfoot>
      </tfoot></table>
      <center style="font-size: 10px; text-align: center">
        <br>
        <hr>
        <samp> Generated by ittechpointbd | </samp> Printing Time:
        ${formattedDateTime}
        <center>
          <input id="number" type="hidden" value="192680">
        </center>
      </center>
    </div>
    </body>
    </html>
    
    `);

    newTab.document.close();
  };

  return (
    <div className="btn-group">
    <button type="button"  onClick={openNewTab} className="btn btn-primary btn-xs"><i className="fa fa-print" /></button>
  </div>


  );
};

export default MemoViewer;
