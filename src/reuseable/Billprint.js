// OrderDetailsHTML.js

const generateOrderHTML = (order) => {
    console.log(order);
    return `




    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Invoice</title>
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
      <style>
     
        .RFtable th {
            background: #000;
            color: white;
            border-top: 1px solid #999;
         
            border: 1px solid #CFD8DC;
            color: #fff;
        } 
        tr.noBorder td {
          border: 0;
        }
         
        .wraper-pos {width: 300px; margin:auto; background:#fff; padding:10px;}
        body { background:#eee;
        font-size: 10px;
        }
        
        @media print {
          
        .wraper-pos {width: 300px; margin:auto; background:#fff; padding:0px;}
        body { background:#fff;}
        } 
        
        
        
          </style>
    </head>
    <body>
      <!-- Print Button -->
      <div class="bt-div">
        <a class="button blue" title="Print" onclick="window.print()">   Print </a> 
        <button class="button blue" onclick="goBack()">Back </button>
      </div>
      <!-- Print Button End -->
      <div class="wraper-pos">
      <!-- Header -->
      <table width="100%" border="0" cellpadding="0" cellspacing="0">
        <tbody><tr>
          <td height="74" align="center" valign="top"><div style="padding-left:15px;">
              <img src="../uploads/logo2024-02-25-03-21-36_65da5de053fa8.png" width="44" alt=""> <br> 
      
              <h2 style="margin:0;font-size:20px;"> Cafe Zero Point</h2>
                 <h3 style="margin:0; font-size:12px;">www.cafezeropoint.com</h3>
              <h3 style="margin:0; font-size:12px;">MR College Road, Panchagarh<br>
             09638120120</h3>
          </div></td>
        </tr>
      </tbody></table>
      <hr>
      <h2 style="margin:0; text-align:center; color: black; font-size:14px;"> BILL-INVOICE</h2>
       
      <hr>
      <table width="101%" border="0" cellpadding="0" cellspacing="0">
        <tbody><tr valign="top"> 
          <td width="1%" nowrap="nowrap">Order#</td>
          <td width="0%" align="center">: </td>
          <td width="87%" class="bn-font"><strong>10199</strong></td>
          <td width="1%" nowrap="nowrap">Date</td>
          <td width="0%" align="center">: </td>
          <td width="11%" align="right" class="bn-font"><strong> 
            04.05.2024      </strong></td>
        </tr>
        <tr valign="top"> 
          <td nowrap="nowrap"></td>
          <td align="center"></td>
          <td class="bn-font"></td>
          <td nowrap="nowrap">Time</td>
          <td align="center">: </td>
          <td align="right" class="bn-font"><strong> 
            01:17 AM      </strong></td>
        </tr>
        <tr valign="top"> 
          <td height="26" nowrap="nowrap"></td>
          <td align="center"></td>
          <td class="bn-font"><strong></strong></td>
          <td nowrap="nowrap">Table</td>
          <td align="center">:</td>
          <td align="right" class="bn-font"><strong> 
          ${order.table}      </strong></td>
        </tr>
      </tbody></table>
       
      <table width="100%" border="1" cellpadding="0" cellspacing="0" class="RFtable">
        <thead>
          <tr> 
            <th width="5%" align="center">SN.</th>
            <th width="35%" align="left"> Item </th>
            <th width="10%" align="center"> Qty. </th>
            <th width="15%" align="right"> Price </th>
            <th nowrap="" align="right">Sub Total </th>
          </tr>
        </thead>
        <tbody>
              ${order.cart.map(item => `
              
              <tr> 
              <td class="bn-font">4</td>
              <td>${item.name} </td>
              <td align="center" nowrap="" class="bn-font">${item.qty} </td>
              <td align="right" class="bn-font">${item.rate} </td>
              <td align="right" class="bn-font">${item.rate * item.qty} </td>
            </tr>
              `).join('')}
              <tr> 
            <td colspan="3" rowspan="7" align="center" style="border: none"><img src="../assets/img/paid.png" alt="" width="90"> 
            </td>
            <td align="right">Total: </td>
            <td align="right" style="font-weight: bold;"><strong> ${order.cart.reduce((total, item) => total + item.rate * item.qty, 0)}</strong></td>
          </tr>
                   <tr style="display:"> 
            <td align="right">Discount%:</td>
            <td align="right" class="bn-font sum" style="font-weight: bold;">${order.discount}</td>
          </tr>
                    
          <tr id="start"> 
            <td align="right"><strong>PAYABLE:</strong></td>
            <td align="right" class="bn-font sum" style="font-weight: bold;"><span class="bn-font sum" style="font-weight: bold;">${order.total}</span></td>
          </tr>
          <tr id="start"> 
            <td align="right">Paid:</td>
            <td align="right" class="bn-font sum" style="font-weight: bold;"><span class="bn-font sum" style="font-weight: bold;">${order.paid}</span></td>
          </tr>
          <tr style="display: none"> 
            <td align="right">Change:</td>
            <td align="right" class="bn-font sum" style="font-weight: bold;"><span class="bn-font sum" style="font-weight: bold;">${order.change}</span></td>
          </tr>
          <tr style="display: "> 
            <td align="right">Due:</td>
            <td align="right" class="bn-font sum" style="font-weight: bold;"><span class="bn-font sum" style="font-weight: bold;">${order.due}</span></td>
          </tr>
        </tbody>
        <tfoot>
      </tfoot></table>
      
        <svg style="transform: translate(0,0)" id="barcode" :value="sku" width="100%" height="45px" x="0px" y="0px" viewBox="0 0 178 45" xmlns="http://www.w3.org/2000/svg" version="1.1"><rect x="0" y="0" width="178" height="45" style="fill:#ffffff;"></rect><g transform="translate(10, 10)" style="fill:#000;"><rect x="0" y="0" width="4" height="25"></rect><rect x="6" y="0" width="2" height="25"></rect><rect x="12" y="0" width="6" height="25"></rect><rect x="22" y="0" width="4" height="25"></rect><rect x="30" y="0" width="2" height="25"></rect><rect x="38" y="0" width="2" height="25"></rect><rect x="44" y="0" width="4" height="25"></rect><rect x="52" y="0" width="2" height="25"></rect><rect x="56" y="0" width="6" height="25"></rect><rect x="66" y="0" width="6" height="25"></rect><rect x="74" y="0" width="2" height="25"></rect><rect x="78" y="0" width="8" height="25"></rect><rect x="88" y="0" width="6" height="25"></rect><rect x="98" y="0" width="2" height="25"></rect><rect x="102" y="0" width="4" height="25"></rect><rect x="110" y="0" width="4" height="25"></rect><rect x="120" y="0" width="2" height="25"></rect><rect x="128" y="0" width="2" height="25"></rect><rect x="132" y="0" width="4" height="25"></rect><rect x="142" y="0" width="6" height="25"></rect><rect x="150" y="0" width="2" height="25"></rect><rect x="154" y="0" width="4" height="25"></rect></g></svg>
        
        <center style="margin-top: 0px;font-size: 11px;font-weight: bold;">Cashier: solveig 
        <p style="margin: 0px;padding: 0px;"><strong></strong></p>
        <samp style="Font-size: 8px;; "> SOFTWARE: ittechpointbd  </samp> 
        <center>
       
       
      <p></p>
      
       
       </html>
    




     
    `;
  };
  
  export default generateOrderHTML;
  