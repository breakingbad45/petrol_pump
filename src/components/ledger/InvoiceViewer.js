import React,{useState,useEffect} from 'react';
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
const date = user.mode === "0" ? user.date : currentDate;

const InvoiceViewer = ({ data}) => {


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



  useEffect(() => {
   (async()=>{

    
    const response = await axiosInstance.get(`/inventory/selectData.php?id=${data}`);
  
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
    const due = subtotal - Number(invoicedata[0]?.additional_data?.split('-')[0]) + Number(invoicedata[0]?.additional_data?.split('-')[1]) - Number(invoicedata[0]?.additional_data?.split('-')[2]);

    const currentDateTime = new Date();
    const formattedDateTime = `${currentDateTime.toLocaleDateString()} ${currentDateTime.toLocaleTimeString()}`;







const products = [
  { id: 1, product_name: 'অকটেন', en:'OCTANE', rate: 100 },
  { id: 2, product_name: 'পেট্রোল',en:'PETROL', rate: 200 },
  { id: 3, product_name: 'ডিজেল',en:'DIESEL', rate: 300 },
  { id: 4, product_name: 'এলপিজি',en:'LPG', rate: 400 },
  { id: 5, product_name: 'ইঞ্জিন অয়েল',en:'ENGINE OIL', rate: 500 },
  { id: 6, product_name: 'গিয়ার অয়েল',en:'GEAR OIL', rate: 600 },
  { id: 7, product_name: 'ব্রেক অয়েল', en:'BRAKE OIL',rate: 700 },
  { id: 8, product_name: 'গ্রীজ', en:'GRDIGE',rate: 800 },
  { id: 9, product_name: 'পরিশোধিত পানি',en:'FILTER WATER', rate: 100 },
  { id: 10, product_name: 'বিবিধ',en:'OTHERS', rate: 200},
];


  const generateTableRows = () => {
    return products.map(p => {
      const item = invoicedata.find(c => c.product_name === p.en);
      return `
        <tr>
          <td style="text-align: left; padding-left: 5px; font-weight: bold;">${p.product_name}</td>
         <td style="font-weight: bold;">${item ? toBn(numberWithCommas( parseFloat(item.unit_2))) + '  লি:' : ''}</td>

          <td style="text-align: right; font-weight: bold;">${item ? toBn(numberWithCommas( parseFloat(item.s_rate)))+ '  /-' : ''}</td>
          <td style="text-align: right; font-weight: bold;">${item ? toBn(numberWithCommas( parseFloat(item.total_tk))) + '  /-': ''}</td>
          <td></td>
        </tr>
      `;
    }).join('');
  };

  const rows = generateTableRows();

  const totalAmount1 = invoicedata.reduce((sum, item) => sum + Number(item.total_tk), 0);
  const totalAmount = Math.round(totalAmount1);
     const amountword = bn.engToWord(totalAmount, true)

  const formatDate = (d) => {
    if (!d) return "";
    const date = new Date(d);
    return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth()+1).padStart(2, '0')}/${date.getFullYear()}`;
  };

  const date = formatDate(invoicedata[0]?.e_date);
  // const vehicle = form.vehicle_no || '';

  const vehicle =invoicedata[0]?.remarks;
  const cus_name =invoicedata[0]?.account_name;
const origin = window.location.origin;

    const newTab = window.open();
    newTab.document.write(`
     <!DOCTYPE html>
    <html lang="bn">
    <head>
      <meta charset="UTF-8">
      <title>Invoice Copy</title>
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
      padding: 20px;
    }
        .invoice-container { display: flex; gap: 20px; justify-content: center; }
        .invoice { width: 400px; padding: 10px; background: white; position: relative; }
        .header { text-align: center; margin-bottom: 5px; position: relative; }
        .left-logo { position: absolute; left: 15px; top: 35px; }
        .right-logo { position: absolute; right: 10px; top: 35px; }
        .header h2 { font-size: 19px; color: red; margin: 5px 0; }
        .header p { margin: 2px 0; font-size: 12px; }
        .info { font-size: 12px; margin-bottom: 5px;margin-top: 0px; }
        .info2 { font-size: 12px; margin-top: 10px; }
        .info span { display: inline-block; width: 49%; }
        table { width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 10px; }
        table, th, td { border: 1px solid #000; }
        th, td { padding: 3px; text-align: center; }
        .footer { font-size: 12px; display: flex; justify-content: space-between; margin-top: 10px; }
         .signature-row {
    display: flex;
    justify-content: space-between;
    margin-top: 35px;
  }

  .signature, .signature2 {
    font-size: 12px;
  }
      .cash-memo-oval {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: red;
    color: white;
    font-size: 9px;
    font-weight: bold;
    border-radius: 50% / 50%;
    width: 75px;
    height: 20px;
    margin: 5px auto; /* centers the oval horizontally */
    text-align: center;
  }

        .copy-label { position: absolute; top: -1px; left: 10px; background: white; padding: 0 5px; font-size: 12px; color: red; font-weight: bold; }
         .inv-label { position: absolute; top: -1px; right: 10px; background: white; padding: 0 5px; font-size: 12px; color: red; font-weight: bold; }
        
        .vertical-dashed-line { border-left: 1px dashed black; height: 480px; }
      </style>
    </head>
    <body>
      <div class="invoice-container">
        ${[ 'অফিস কপি','কাস্টমার কপি'].map(copyLabel => `
          <div class="invoice">
            <div class="copy-label">${copyLabel}</div>
               <div class="inv-label">${data}</div>
            <div class="cash-memo-oval">
  ক্যাশ মেমো
</div>
            <div class="header">
              <img src="/assets/padma.svg" height="50" class="left-logo" />
              <h2>মেসার্স তেতুলিয়া ফিলিং স্টেশন এন্ড এল.পি.জি</h2>
              <p>ডিলারঃ পদ্মা অয়েল কোম্পানী লিমিটেড</p>
              <p>প্রোঃ মোঃ আবুল কালাম আজাদ</p>
              <p>ভজনপুর, তেতুলিয়া, পঞ্চগড়।</p>
              <p>মোবাঃ ০১৭১৩-৭৪৯২৭৬</p>
              <img src="/assets/bashundhara.png" height="45" class="right-logo" />
            </div>
              <div class="info2">
              <span>গ্রাহকের নাম : ${cus_name}</span>
            </div>
            <div class="info">
              <span>গাড়ী নং: ${vehicle}</span>
              <span style="text-align:right;">তারিখ: ${date}</span>
            </div>
            <table>
              <thead>
                <tr>
                  <th>পণ্যের নাম</th>
                  <th>পরিমাণ</th>
                  <th>দর</th>
                  <th>টাকা</th>
                  <th>প্রাপ্তি</th>
                </tr>
              </thead>
              <tbody>${rows}</tbody>
            </table>
            <div class="footer">
              <div>মোট টাকা: <span style="font-weight:bold">${toBn(numberWithCommas(totalAmount.toFixed(2)))}</span></div>
              <div>কথায়: <span style="font-weight:bold">${amountword}</span></div>
            </div>
           <div class="signature-row">
  <div class="signature">
  
    ক্রেতার স্বাক্ষর
  </div>
  <div class="signature2">
   
    কাশিয়ার/ম্যানেজার  স্বাক্ষর
  </div>
</div>
          </div>
        `).join('<span class="vertical-dashed-line"></span>')}
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
    newTab.document.close();
  
   
  };

  return (
    
      <a className="me-3" onClick={handleButtonClick}>
              <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-printer"><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><path d="M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6" /><rect x={6} y={14} width={12} height={8} rx={1} /></svg>

                  </a>
     
    
  );
};

export default InvoiceViewer;
