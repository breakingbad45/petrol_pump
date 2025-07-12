import React from 'react';
import numberWithCommas from '../../utils/numberWithCommas';
const AccountbalanceViewer = ({ data ,propsdata,ledgerForm,disableButton}) => {

  const handleButtonClick = () => {




    

    const currentDateTime = new Date();
    const formattedDateTime = `${currentDateTime.toLocaleDateString()} ${currentDateTime.toLocaleTimeString()}`;
    const newTab = window.open();
    newTab.document.write(`
    <html>
    <head>
      
      <title>E-D/O</title>
      <link rel="stylesheet" type="text/css" href="style.css" media="all" />
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Hedvig+Letters+Sans&family=Hind+Siliguri:wght@500&family=Play&display=swap');
        html {
          height: 100%;
        }
        body {
          background:#686b6bb5;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  }
  
        h3 {
          margin: 0;
          text-transform: uppercase;
          font-size: 17px;
          font-weight: bold;
          color: #000000;
        }
  
        a:link {
          text-decoration: none;
        }
  
        a:visited {
          text-decoration: none;
        }
  
        a:hover {
          text-decoration: none;
        }
  
        a:active {
          text-decoration: none;
        }
  
        .container {
          margin: 0 auto;
          width: 50%;
          padding: 20px;
          background-color: #ffffff;
          box-shadow: 0 2px 2px 0px #e0e0e0;
        }
  
        .font-bn {
          font-family: SutonnyMJ;
          font-size: 18px;
          font-weight: bold;
        }
  
        .bold {
          font-weight: bold;
        }
        .wraper {
          margin: 0 auto;
          width: 1080px;
          padding: 20px;
          background-color: #ffffff;
          box-shadow: 0 0px 4px #9da1ba8a;
          padding-bottom: 64px;
          padding-top: 34px;
          /* min-height: 600px; */
        }
  
        .header {
          padding: 5px;
          color: #683091;
          margin-bottom: 20px;
        }
  
        .report-title {
          padding: 15px;
          font-weight: 500;
          text-align: center;
          font-size: 14px;
          font-family: inherit;
          text-transform: uppercase;
        }
  
        h1 {
          font-size: 16px;
          color: #3f51b5;
          font-weight: bold;
          text-transform: uppercase;
        }
  
        h2 {
          font-size: 22px;
          color: #000000;
          font-weight: bold;
        
          text-transform: uppercase;
          margin-top: 5px;
          margin-bottom: 20px;
          /* border-bottom: 1px dashed #ccc; */
        }
  
        .title-3 {
          font-size: 16px;
          text-transform: uppercase;
          color: #607d8b;
        }
  
        h4 {
          font-size: 12px;
          color: #00141e;
          font-weight: 600;
        }
  
        .groups-1 {
          font-size: 16px;
          color: #f44336;
          font-weight: bold;
          padding: 8px;
          text-align: center;
          text-transform: uppercase;
        }
  
        .logo {
          padding-right: 10px;
          float: left;
          position: absolute;
          background: #fff;
        }
  
        .qrcode img {
          width: 90px;
          padding: 10px;
          margin-top: 8px;
          margin-bottom: 8px;
          border: 1px solid #ccc;
        }
        .box {
          clear: both;
          overflow: hidden;
          line-height: 25px;
          font-size: 14px;
          font-weight: 500;
        }
  
        .box-div-inside {
          width: 325px;
          height: 270px;
          float: left;
          margin: 20px 20px;
          overflow: hidden;
          padding: 8px;
          border: 3px double #333;
          background: #fff;
        }
  
        .box-div-inside-img {
          width: 520px;
          height: 270px;
          float: left;
          margin: 20px 20px;
          overflow: hidden;
          padding: 8px;
          border: 3px double #333;
          background: #fff;
        }
  
        .text-vertical {
          transform: rotate(90deg);
        }
  
        .links {
          border: 1px dotted #eee;
          line-height: 25px;
          column-count: 4;
          column-gap: 12px;
          column-rule: 1px dotted #eee;
          padding: 0px;
          text-align: center;
          margin-right: 12px;
        }
  
        .RFtable {
          width: 100%;
          border-collapse: collapse;
          border: none;
          border-bottom: 1px solid #000000;
        }
        table {
          font-size: 14px;
          border-collapse: collapse;
        }
  
        table td {
          padding: 1px;
        }
  
        .RFtable td {
          padding: 7px;
          border: none;
          border-bottom: 1px solid #cacaca;
        }
  
        .RFtable tr {
          background: #000;
          border: none;
          border-bottom: 1px solid #000000;
        }
  
        .RFtable th {
          background: #E8EAF6;
    color: #3F51B5;
    border: 1px solid #C5CAE9;
    font-weight: 600;
    padding: 3px;
    text-transform: uppercase;
        }
  
        .RFtable tr:nth-child(odd) {
          border: none;
          border-bottom: 1px solid #000000;
  
          background: #fafafa;
        }
  
        .RFtable tr:nth-child(even) {
          border: none;
          border-bottom: 1px solid #000000;
          background: #fff;
        }
  
        .RFtable tfoot {
          color: #000000;
          font-weight: bold;
          border-bottom: 2px solid white;
        }
  
        .RFtable span {
        }
  
        .bt-div {
          text-align: center;
          background: #212121;
          padding: 8px;
          top: 0;
          /* position: fixed; */
          left: 0;
          overflow: inherit;
          /* width: 100%; */
          margin-bottom: 15px;
          box-shadow: 0 0 5px #9e9e9e9c;
        }
        /** Button**/
  
        .button {
          display: inline-block;
          color: #fff !important;
          border-radius: 6px;
          cursor: pointer;
          font-size: 12px;
          text-align: center;
          height: 27px;
          line-height: 27px;
          min-width: 54px;
          padding: 0 8px;
          text-decoration: none;
          margin-bottom: 2px;
        }
  
        .button:hover {
          background-color: #f8f8f8;
          background-image: -webkit-linear-gradient(top, #f8f8f8, #f1f1f1);
          background-image: -moz-linear-gradient(top, #f8f8f8, #f1f1f1);
          background-image: -ms-linear-gradient(top, #f8f8f8, #f1f1f1);
          background-image: -o-linear-gradient(top, #f8f8f8, #f1f1f1);
          background-image: linear-gradient(top, #f8f8f8, #f1f1f1);
          border: 1px solid #c6c6c6;
          color: #333;
          -webkit-box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.1);
          -moz-box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.1);
          box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.1);
        }
        /* blue */
  
        .button.blue {
          background-color: rgb(0 116 205);
          /* background-image: -webkit-linear-gradient(top, #3f51b5, #3f51b5); */
          background-image: -moz-linear-gradient(top, #4d90fe, #4787ed);
          background-image: -ms-linear-gradient(top, #4d90fe, #4787ed);
          background-image: -o-linear-gradient(top, #4d90fe, #4787ed);
          background-image: linear-gradient(top, #4d90fe, #4787ed);
          border: 1px solid #6f8da740;
          color: white;
        }
  
        .button.blue:hover {
          border: 1px solid #2f5bb7;
          background-color: #357ae8;
          background-image: -webkit-linear-gradient(top, #4d90fe, #357ae8);
          background-image: -moz-linear-gradient(top, #4d90fe, #357ae8);
          background-image: -ms-linear-gradient(top, #4d90fe, #357ae8);
          background-image: -o-linear-gradient(top, #4d90fe, #357ae8);
          background-image: linear-gradient(top, #4d90fe, #357ae8);
          -webkit-box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
          -moz-box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
          box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
        }
  
        .footer-text {
          font-size: 12px;
        }
  
        @media print {
       
          body {
            background: #fff;
            font-size: 11px;
            color: #000;
          }
          .container {
            width: 100%;
            padding: 0px;
            background-color: #ffffff;
            box-shadow: none;
            font-size: 12px;
          }
          .header {
            padding: 5px;
            margin-bottom: 20px;
            border: 1px solid #fff;
          }
          .wraper {
            margin: 0 auto;
            width: 100%;
            padding: 0px;
            background-color: #ffffff;
            box-shadow: none;
            font-size: 12px;
            padding-bottom: 0px;
            border-top: 0px solid #c6caea;
          }
          h2 {
            font-size: 18px;
            color: #000000;
            font-weight: bold;
            /* font-family: sans-serif; */
            text-transform: uppercase;
            margin-top: 5px;
            margin-bottom: 20px;
            /* border-bottom: 1px dashed #ccc; */
          }
          .title-2 {
            color: #000;
          }
          .title-3 {
            color: #000;
          }
          .groups-1 {
            color: #000;
          }
          .RFtable {
            width: 100%;
            border-collapse: collapse;
            font-size: 12px;
          }
          .RFtable td {
            padding: 6px;
          }
          .RFtable tr {
            background: #000;
          }
          .RFtable th {
  /*         
            border: 1px solid #000000; */
            font-weight: 600;
            padding: 3px;
            text-transform: uppercase;
          }
          .RFtable tr:nth-child(odd) {
            background: #fff;
          }
          .RFtable tr:nth-child(even) {
            background: #fff;
          }
          .bt-div {
            display: none;
          }
        }
  
        /* body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji",
            "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
        } */
        .header-info {
          margin-top: 15px;
        }
        table.report-container {
          width: 1000px;
          margin: auto;
          page-break-after: always;
        }
        thead.report-header {
          display: table-header-group;
        }
        tfoot.report-footer {
          display: table-footer-group;
        }
  
        .wraper{
          background-color: rgb(255, 255, 255);
          padding: 5px;
        }
      </style>
    </head>
    <body>
      <div class="wraper">
        
     
      <table class="report-container">
        <thead class="report-header">
          <tr>
            <th class="report-header-cell">
              <div class="header-info">
                <table width="100%" border="0">
                  <tbody><tr>
                    <td width="20%" align="left" valign="center"><img src="${propsdata.img}" height="74" alt="" style="float:left; margin-right:15px; margin-bottom:10px;"></td>
                    <td width="60%" align="center" valign="center">   
                    <h1 style="margin:0;font-size: 25px; color: #009688;letter-spacing: 1px;">${propsdata.cname}</h1>
                    <h4 style="margin: 0">Address: ${propsdata.address}</h4>
                    <h4 style="margin: 0">Mobile: ${propsdata.contact}</h4>
                    <h4 style="margin: 0">Email: ${propsdata.email}</h4>
                </td>
                    <td width="20%" align="center" valign="center" nowrap=""> </td>
                  </tr>
                </tbody></table>
                <hr style="border-top: 1px solid black;" />
  
  
              </div>
            </th>
          </tr>
        </thead>
        <tfoot class="report-footer">
          <tr>
            <td class="report-footer-cell">
              <div class="footer-info">
                <center style="font-size: 10px; text-align: center">
                  <br />
                  <hr />
                  <samp> Generated by ittechpointbd | </samp> Printing Time:
                  ${formattedDateTime}
                  <center>
                    <input id="number" type="hidden" value="192680" />
                  </center>
                </center>
              </div>
              <br />
            </td>
          </tr>
        </tfoot>
        <tbody class="report-content">
          <tr>
            <td class="report-content-cell">
              <div class="main">
                <div class="">
                  <h2>
                    <center>
                   <span style="    padding: 4px 47px;
                   border: 1px solid;">Accounts Balance</span> 
                      <center></center>
                    </center>
                  </h2>
                
                  <br />
  
                  <table
                    border="1"
                    cellpadding="0"
                    cellspacing="0"
                    class="RFtable"
                    id="items"
                  >
                    <thead>
                      <tr class="titlerow">
                        <th width="5%" align="center" nowrap="">
                          SL.
                        </th>
                        <th width="25%" align="center" nowrap="">
                        A/C NAME
                      </th>
                      <th width="20%" align="center" nowrap="">
                      TYPE
                    </th>
                        <th width="15%" align="center">
                         CONTACT
                        </th>
                     
                        <th width="25%" align="center">ADDRESS</th>
                        <th width="10%" align="center">BALANCE</th>
                       
                      </tr>
                    </thead>
                    <tbody>
                    
                    ${data.map((item, index) => `
                    <tr key=${index}>
                      <td width="5%" align="center" nowrap="">${index + 1}</td>
                      <td>${item.expand?.ac_id?.name}</td>
                      <td align="center">${item.expand?.ac_id?.expand?.type?.subtype}</td>
                      <td align="center">${item.expand?.ac_id?.address}</td>
                      <td align="center">${item.expand?.ac_id?.contact}</td>
                      <td align="right">${numberWithCommas(item.asdue.toFixed(2))}</td>
                       </tr>
                  `).join('')}
                    </tbody>
                   <tbody>
              <tr>
                      <td align="right" colspan="5">TOTAL:</td>
                     
              
                      <td align="right" id="due"></td>	
                  </tr>
  </tbody>
                  </table>
                  
  <!-- 
                  <br /> -->
                  <table width="100%" border="0" cellpadding="0" cellspacing="1">
                    <tbody>
                    
                  
                      <tr>
                  
                        <td style="padding-top: 20px;" colspan="3" align="left">
                         
                        </td>
                      </tr>
                    </tbody>
                  </table>
  
                  <br />
                 
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    </body>
  </html>
  
     
    `);
    
  };

  return (
    <button
    type="button"
    disabled={disableButton}
    className="btn btn-primary mt-3"
    onClick={handleButtonClick}
  >
    Generate Report
  </button>
   
  );
};

export default AccountbalanceViewer;
