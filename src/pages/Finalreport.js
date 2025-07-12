import React, { useEffect, useState ,useRef} from 'react';
import axiosInstance from '../utils/axios';
import numberWithCommas from '../utils/numberWithCommas';

const Finalreport = () => {








  const [alldata, setAlldata] = useState([]);
  const [openingBalance, setOpeningBalance] = useState(0);

  // Get the current date in GMT+6
// Get the current UTC time
const formattedDate = new Date();

// Convert the UTC time to UTC+6


const utcPlus6Date = new Date(formattedDate.getTime() + (6 * 60 * 60 * 1000));

// Format the date and time as desired
const currentDate = utcPlus6Date.toISOString().slice(0, 10); // YYYY-MM-DD

const fuser = localStorage.getItem('user');
const user =JSON.parse(fuser)
const date = user.mode === "1" ? user.date : currentDate;
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
  
 


  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Final Report Data
        const response = await axiosInstance.get(`commondata/fetchFinal.php?start_date=${currentDate}&end_date=${currentDate}`);
        console.log('API Response:', response.data);

        if (Array.isArray(response.data.data)) {
          setAlldata(response.data.data);
        } else {
          console.error('Unexpected data format:', response.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const fetchOpeningBalance = async () => {
      try {
        // Fetch Opening Balance
        const response = await axiosInstance.get('commondata/fetchOpening.php');
        console.log('Opening Balance Response:', response.data);

        if (response.data && response.data.opening_balance) {
          setOpeningBalance(parseInt(response.data.opening_balance));
        } else {
          console.error('Unexpected opening balance format:', response.data);
        }
      } catch (error) {
        console.error('Error fetching opening balance:', error);
      }
    };

    fetchData();
    fetchOpeningBalance();
  }, [currentDate]);

  if (!Array.isArray(alldata)) {
    return <div>Error: Data format is incorrect</div>;
  }

  // Filter and categorize transactions
  const filteredTransactions = alldata.filter(t => t.sell_type !== 'DUALTRANSACTION');
  const nonZeroPaymentTransactions = filteredTransactions.filter(t => parseFloat(t.payment) > 0);
  const nonZeroReceiveTransactions = filteredTransactions.filter(t => parseFloat(t.receive) > 0);

  const cashPurchase = nonZeroPaymentTransactions.filter(t => t.sell_type === 'PUR' && t.bill_type === 'CASH');
  const cashPurchaseTotal = cashPurchase.reduce((sum, item) => sum + Number(item.total_tk), 0);
  const creditPurchase = nonZeroPaymentTransactions.filter(t => t.sell_type === 'PUR' && t.bill_type === 'CREDIT');
  const cashSales = nonZeroReceiveTransactions.filter(t => t.sell_type === 'SELL' && t.bill_type === 'CASH');
  const cashSalesTotal = cashSales.reduce((sum, item) => sum + Number(item.total_tk), 0);
  const creditSales = nonZeroPaymentTransactions.filter(t => t.sell_type === 'SELL' && t.bill_type === 'CREDIT');
  const cashTransactions = nonZeroReceiveTransactions.filter(t => t.sell_type === 'TRANSACTION' );


  // Group credit sales by acname
const groupedCreditSales = creditSales.reduce((acc, curr) => {
  if (!acc[curr.acname]) {
    acc[curr.acname] = { totalPayment: 0, totalLiter: 0 };
  }
  acc[curr.acname].totalPayment += parseFloat(curr.payment);
  acc[curr.acname].totalLiter += parseFloat(curr.unit_2 || 0);
  return acc;
}, {});

// Convert grouped data into table format
const groupedCreditSalesData = Object.entries(groupedCreditSales).map(
  ([acname, { totalPayment, totalLiter }]) => ({
    description: `${acname} -- ${toBn(numberWithCommas(totalLiter.toFixed(2)))} ltr`,
    amount: totalPayment,
    remarks: ''
  })
);

  // Create arrays for table mapping
  const paymentTableData = [
  ...groupedCreditSalesData,
  ...nonZeroPaymentTransactions.filter(t => t.sell_type === 'TRANSACTION')
      .map((t) => ({ description: `${t.acname}-${t.remarks}`, amount: parseFloat(t.payment) ,remarks:t.remarks})),
  ];

const receiveTableData = [
  { description: 'Opening Balance', amount: openingBalance },
  ...cashSales.map((t) => ({
    description: `${t.remarks} Sales ---- ${toBn(numberWithCommas(parseFloat(t.unit_2).toFixed(2)))} ltr`,
    amount: parseFloat(t.receive),
    remarks: `${t.remarks}`
  })),
  ...cashTransactions.map((t) => ({
    description: ` ${t.acname}-${t.remarks} `,
    amount: parseFloat(t.receive),
    remarks: t.remarks
  })),
];


  // Calculate subtotals and totals
  const paymentSubtotal = paymentTableData.reduce((sum, item) => sum + item.amount, 0);
  const receiveSubtotal1 = receiveTableData.reduce((sum, item) => sum + item.amount, 0);
  const receiveSubtotal = receiveSubtotal1 - openingBalance;


  const paymentTotal = paymentSubtotal;
  const receiveTotal = receiveSubtotal + openingBalance;

  const cashInHand = receiveTotal - paymentTotal;

  const renderEmptyRows = (currentRowsCount) => {
    const emptyRows = [];
    for (let i = currentRowsCount; i < 20; i++) {
      emptyRows.push(
        <tr key={`empty-${i}`}>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
        </tr>
      );
    }
    return emptyRows;
  };

  const capitalizeWords = (str) => {
    return str.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
  };
  const openPrintWindow = () => {
    const newWindow = window.open('', '_blank');
    if (!newWindow) return; // Handle popup blocker
  
    const totalRows = 30; // Total rows you want to display
  
    // Calculate number of empty rows needed
    const paymentEmptyRowsCount = totalRows - paymentTableData.length;
    const receiveEmptyRowsCount = totalRows - receiveTableData.length;
  
    // Function to generate empty rows
    const renderEmptyRows = (count) => {
      return Array.from({ length: count }, () => `
        <tr>
          <td width="10%"></td>
          <td style="text-align:left;"></td>
          <td style="text-align:right;"></td>
        </tr>
      `).join('');
    };
  function getBengaliDateTime(inputDateStr) {
  const date = new Date(inputDateStr || new Date());

  const bnDigits = ['০','১','২','৩','৪','৫','৬','৭','৮','৯'];
  const bnMonths = ['জানুয়ারি','ফেব্রুয়ারি','মার্চ','এপ্রিল','মে','জুন','জুলাই','আগস্ট','সেপ্টেম্বর','অক্টোবর','নভেম্বর','ডিসেম্বর'];

  const toBn = (str) => String(str).split('').map(d => bnDigits[d] ?? d).join('');

  const day = toBn(date.getDate());
  const month = bnMonths[date.getMonth()];
  const year = toBn(date.getFullYear());

  const hours = date.getHours();
  const minutes = date.getMinutes();
  const isPM = hours >= 12;
  const hr12 = hours % 12 || 12;

  const bnTime = `${toBn(hr12)}:${toBn(minutes.toString().padStart(2, '0'))} ${isPM ? 'PM' : 'AM'}`;

  return {
    bnDate: `${day} ${month} ${year}`,
    bnTime
  };
}

// Example:
const { bnDate, bnTime } = getBengaliDateTime(date);


    newWindow.document.open();
    newWindow.document.write(`
      <html>
        <head>
          <title>Final Report</title>
          <style>
          @font-face {
      font-family: 'SolaimanLipi';
      src: url('${origin}/assets/solaimanlipi.woff') format('woff');
      font-weight: normal;
      font-style: normal;
    }
    body {
      font-family: 'SolaimanLipi', sans-serif;
      font-size: 14px;
      padding: 5px;
      
    }
            table {
              width: 350px;
              border-collapse: collapse;
              margin: 5px 0;
            }
            th, td {
              border: 1px solid #000;
              padding: 3px;
              font-size:12px;
              text-align: left;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            tr {
              height: 25px;
            }
            tfoot td {
              font-weight: bold;
            }
            .table-container {
            
              max-width: 975px;
              margin: auto;
              display: flex;
              justify-content: center;
            }
            .header {
              max-width: 910px;
              margin: auto;
              text-align: center;
              margin-bottom: 20px;
              position: relative;
            }
            .header .title {
              font-size: 24px;
              font-weight: bold;
            }
            .header .subtitle {
              font-size: 18px;
              text-decoration: underline;
            }
            .header .print-info {
              text-align: right;
              font-size: 12px;
            }
            .header .date-range {
              font-size: 14px;
              margin-top: 10px;
              border-top: 1px solid #000;
              border-bottom: 1px solid #000;
              display: inline-block;
              width: 100%;
            }
            .table-title {
              font-size: 16px;
              font-weight: bold;
              text-align: center;
              margin-top: 10px;
              margin-bottom: 5px;
            }
            .logo {
              position: absolute;
              top: 0;
              left: 0;
              width: 50px;
              height: 50px;
            }
            .footer {
              margin-top: 40px;
              display: flex;
              justify-content: space-between;
            }
            .signature {
              width: 20%;
              text-align: center;
              border-top: 1px dashed #000;
              padding-top: 5px;
            }
              .invoice { padding: 10px; background: white; position: relative; }
        .header { text-align: center; margin-bottom: 5px; position: relative; font-family: 'SolaimanLipi', sans-serif; }
        .left-logo { position: absolute; left: 15px; top: 35px; }
        .right-logo { position: absolute; right: 10px; top: 35px; }
        .header h2 { font-size: 19px; color: red; margin: 5px 0; }
        .header p { margin: 2px 0; font-size: 12px; }
          </style>
        </head>
        <body>
        <div class="invoice">
         <div class="header">
              <img src="/assets/padma.svg" height="60" class="left-logo" />
              <h1 style="margin:0px !important">মেসার্স তেতুলিয়া ফিলিং স্টেশন এন্ড এল.পি.জি</h1>
              <p style="font-size:16px !important">ডিলারঃ পদ্মা অয়েল কোম্পানী লিমিটেড</p>
              <p style="font-size:16px !important">প্রোঃ মোঃ আবুল কালাম আজাদ</p>
              <p style="font-size:16px !important">ভজনপুর, তেতুলিয়া, পঞ্চগড়।</p>
              <p style="font-size:14px !important">তারিখঃ ${bnDate }</p>
              <img src="/assets/bashundhara.png" height="55" class="right-logo" />
            </div>
         </div>
        <hr style="border:1px solid black">
            <div  class="table-container">
  <div>
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th style="text-align:center">বিস্তারিত</th>
          <th style="text-align:center">জমা</th>
        </tr>
      </thead>
      <tbody>
        ${receiveTableData.map((item, index) => `
          <tr>
            <td width="10%" style="text-align:center;font-weight:bold">${toBn((index + 1).toString())}</td>
            <td style="text-align:left;font-weight:bold";">${capitalizeWords(item.description)}</td>
            <td style="text-align:right;font-weight:bold">${toBn(numberWithCommas(item.amount))} /-</td>
          </tr>`).join('')}
        ${renderEmptyRows(receiveEmptyRowsCount > 0 ? receiveEmptyRowsCount : 0)}
      </tbody>
      <tfoot>
        <tr>
          <td colspan="2">মোট</td>
          <td style="text-align:right;">${toBn(numberWithCommas(receiveSubtotal.toFixed(2)))} /-</td>
        </tr>
        <tr>
          <td colspan="2">সর্বমোট</td>
          <td style="text-align:right;">${toBn(numberWithCommas(receiveTotal.toFixed(2)))} /-</td>
        </tr>
        <tr>
          <td colspan="2">হাতে আছে</td>
          <td style="text-align:right;">${toBn(numberWithCommas(cashInHand.toFixed(2)))} /-</td>
        </tr>
      </tfoot>
    </table>
  </div>

  <div style="margin-left: 20px;">
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th style="text-align:center">বিস্তারিত</th>
          <th  style="text-align:center">খরচ</th>
        </tr>
      </thead>
      <tbody>
        ${paymentTableData.map((item, index) => `
          <tr>
            <td width="10%"  style="text-align:center;font-weight:bold">${toBn((index + 1).toString())}</td>
            <td  style="text-align:left;font-weight:bold">${capitalizeWords(item.description)}</td>
            <td  style="text-align:right;font-weight:bold">${toBn(numberWithCommas(item.amount.toFixed(2)))} /-</td>
          </tr>`).join('')}
        ${renderEmptyRows(paymentEmptyRowsCount > 0 ? paymentEmptyRowsCount : 0)}
      </tbody>
      <tfoot>
        <tr>
          <td colspan="2">মোট</td>
          <td style="text-align:right;">${toBn(numberWithCommas(paymentSubtotal.toFixed(2)))} /-</td>
        </tr>
      </tfoot>
    </table>
  </div>
</div>

        
           <script>
      window.onload = function () {
        setTimeout(() => {
          window.print();
        }, 500);
        window.onafterprint = function () {
          window.close();
        };
      };
    </script>
        </body>
      </html>
    `);
  
    newWindow.document.close();
  
 
  // newWindow.print();
  };
  
  
  

  return (
    <>
      <button type="button" onClick={openPrintWindow}>Print</button>
      {/* Your existing JSX here */}
      <div className="container">
      <div className="row">
         <div className="col-md-6">
          <div style={styles.tableContainer}>
            <div style={styles.tableHeader}>RECEIVE</div>
            <div style={styles.scrollableTable}>
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                {receiveTableData.map((item,i)=>(
                     <tr key={i}>
                     <td>{i+1}</td>
                     <td>{capitalizeWords(item.description)}</td>
                     <td  style={{textAlign:'right'}}>{toBn(numberWithCommas(Number(item.amount).toFixed(2)))}</td>
                   </tr>
                  ))}
                 
                </tbody>
                <tfoot>
                  <tr style={{background:'aquamarine'}}>
                    <td colspan="2">মোট</td>
                    <td style={{textAlign:'right',fontWeight:'bold'}}>{toBn(numberWithCommas(receiveSubtotal.toFixed(2)))} /-</td>
                  </tr>
                  <tr style={{background:'aqua'}}>
                    <td colspan="2">সর্বমোট</td>
                    <td style={{textAlign:'right',fontWeight:'bold'}}>{toBn(numberWithCommas(receiveTotal.toFixed(2)))} /-</td>
                  </tr>
                  <tr style={{background:'antiquewhite'}}>
                    <td colspan="2">হাতে আছে</td>
                    <td style={{textAlign:'right',fontWeight:'bold'}}>{toBn(numberWithCommas(cashInHand.toFixed(2)))} /-</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
        {/* Payment Table */}
        <div className="col-md-6">
          <div style={styles.tableContainer}>
            <div style={styles.tableHeader}>PAYMENT</div>
            <div style={styles.scrollableTable}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Sl</th>
                    <th>Description</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Dummy data rows */}
                  {paymentTableData.map((item,i)=>(
                     <tr key={i}>
                     <td>{i+1}</td>
                     <td>{capitalizeWords(item.description)}</td>
                     <td style={{textAlign:'right'}}>{toBn(numberWithCommas(Number(item.amount).toFixed(2)))}</td>
                   </tr>
                  ))}
                
                </tbody>
                <tfoot>
                  <tr >
                    <td colspan="2">সর্বমোট</td>
                    <td style={{textAlign:'right',fontWeight:'bold'}}>{toBn(numberWithCommas(paymentSubtotal.toFixed(2)))} /-</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        {/* Receive Table */}
       
      </div>
      <div className="row">
        <div className="col-md-12" style={styles.cashInHand}>
          CASH IN HAND: {toBn(cashInHand.toFixed(2))} TAKA
        </div>
      </div>
    
      
    </div>

    </>
  );
};

export default Finalreport;
const styles = {
  cashInHand: {
    backgroundColor:'#b0f15f',
    textAlign: 'center',
    marginTop: '20px',
    fontSize: '24px',
    fontWeight: 'bold',
    border: '2px solid black',
    borderRadius: '10px',
    padding: '15px',
  },
  tableContainer: {
    border: '2px solid black',
    borderRadius: '10px',
    padding: '10px',
  },
  tableHeader: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: '18px',
    marginBottom: '10px',
    padding: '5px',
    borderBottom: '2px solid black',
  },
  scrollableTable: {
    maxHeight: '400px', // Adjust based on your design
    overflowY: 'scroll',
  },
};