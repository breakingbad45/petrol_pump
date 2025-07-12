import React from 'react';

const transactions = [
  {"id":"1","inv_id":"INV1279","e_date":"2024-09-03","sell_type":"PUR","bill_type":"CASH","product_id":"663","ac_id":"1","unit_2":"120","unit_1":"10","s_rate":"5400","total_tk":"54000","payment":"54000","receive":"0","remarks":"N\/A","additional_data":"0-0-648000","status":"0","posted":"","business":"0","created":"0000-00-00 00:00:00","updated":"0000-00-00 00:00:00"},
  {"id":"2","inv_id":"INV0502","e_date":"2024-09-03","sell_type":"SELL","bill_type":"CREDIT","product_id":"663","ac_id":"4","unit_2":"100","unit_1":"0","s_rate":"450","total_tk":"45000","payment":"45000","receive":"0","remarks":"N\/A","additional_data":"0-0-0","status":"0","posted":"","business":"0","created":"0000-00-00 00:00:00","updated":"0000-00-00 00:00:00"},
  {"id":"6","inv_id":"TR1505","e_date":"2024-09-03","sell_type":"TRANSACTION","bill_type":"","product_id":"0","ac_id":"4","unit_2":"0","unit_1":"0","s_rate":"0","total_tk":"0","payment":"555","receive":"0","remarks":"CASH","additional_data":"","status":"0","posted":"","business":"0","created":"0000-00-00 00:00:00","updated":"0000-00-00 00:00:00"},
  {"id":"7","inv_id":"TR3786","e_date":"2024-09-03","sell_type":"TRANSACTION","bill_type":"","product_id":"0","ac_id":"4","unit_2":"0","unit_1":"0","s_rate":"0","total_tk":"0","payment":"0","receive":"10000","remarks":"CASH","additional_data":"","status":"0","posted":"","business":"0","created":"0000-00-00 00:00:00","updated":"0000-00-00 00:00:00"},
  {"id":"8","inv_id":"TR5361","e_date":"2024-09-01","sell_type":"TRANSACTION","bill_type":"","product_id":"0","ac_id":"4","unit_2":"0","unit_1":"0","s_rate":"0","total_tk":"0","payment":"1500","receive":"0","remarks":"CASH","additional_data":"","status":"0","posted":"","business":"0","created":"0000-00-00 00:00:00","updated":"0000-00-00 00:00:00"},
  {"id":"9","inv_id":"TR8800","e_date":"2024-09-03","sell_type":"TRANSACTION","bill_type":"","product_id":"0","ac_id":"4","unit_2":"0","unit_1":"0","s_rate":"0","total_tk":"0","payment":"450","receive":"0","remarks":"CASH","additional_data":"","status":"0","posted":"","business":"0","created":"0000-00-00 00:00:00","updated":"0000-00-00 00:00:00"},
  {"id":"14","inv_id":"DTR3464","e_date":"2024-09-03","sell_type":"DUALTRANSACTION","bill_type":"","product_id":"0","ac_id":"4","unit_2":"0","unit_1":"0","s_rate":"0","total_tk":"0","payment":"0","receive":"450","remarks":"CASH","additional_data":"","status":"0","posted":"","business":"0","created":"0000-00-00 00:00:00","updated":"0000-00-00 00:00:00"},
  {"id":"15","inv_id":"DTR3464","e_date":"2024-09-03","sell_type":"DUALTRANSACTION","bill_type":"","product_id":"0","ac_id":"39","unit_2":"0","unit_1":"0","s_rate":"0","total_tk":"0","payment":"450","receive":"0","remarks":"CASH","additional_data":"","status":"0","posted":"","business":"0","created":"0000-00-00 00:00:00","updated":"0000-00-00 00:00:00"},
  {"id":"16","inv_id":"INV8388","e_date":"2024-09-03","sell_type":"SELL","bill_type":"CREDIT","product_id":"663","ac_id":"4","unit_2":"1","unit_1":"0","s_rate":"450","total_tk":"450","payment":"450","receive":"0","remarks":"N\/A","additional_data":"0-0-0","status":"0","posted":"","business":"0","created":"0000-00-00 00:00:00","updated":"0000-00-00 00:00:00"},
  {"id":"17","inv_id":"INV7485","e_date":"2024-09-03","sell_type":"PUR","bill_type":"CREDIT","product_id":"663","ac_id":"4","unit_2":"12","unit_1":"1","s_rate":"1455","total_tk":"1455","payment":"0","receive":"1455","remarks":"N\/A","additional_data":"0-0-0","status":"0","posted":"","business":"0","created":"0000-00-00 00:00:00","updated":"0000-00-00 00:00:00"}
   ];

const Finalreport = () => {
  // Calculate totals and group transactions
  const cashPurchase = transactions.find(t => t.sell_type === 'PUR' && t.bill_type === 'CASH');
  const creditPurchase = transactions.filter(t => t.sell_type === 'PUR' && t.bill_type === 'CREDIT');
  const cashSales = transactions.filter(t => t.sell_type === 'SELL' && t.bill_type === 'CASH');
  const creditSales = transactions.filter(t => t.sell_type === 'SELL' && t.bill_type === 'CREDIT');
  const dualTransactions = transactions.filter(t => t.sell_type === 'DUALTRANSACTION');

  const totalCashPurchase = cashPurchase ? parseFloat(cashPurchase.total_tk) : 0;
  const totalCreditPurchase = creditPurchase.reduce((sum, t) => sum + parseFloat(t.total_tk), 0);
  const totalCashSales = cashSales.reduce((sum, t) => sum + parseFloat(t.total_tk), 0);
  const totalCreditSales = creditSales.reduce((sum, t) => sum + parseFloat(t.total_tk), 0);
  const totalCashPaid = transactions.filter(t => t.payment > 0).reduce((sum, t) => sum + parseFloat(t.payment), 0);
  const totalCashReceived = transactions.filter(t => t.receive > 0).reduce((sum, t) => sum + parseFloat(t.receive), 0);

  const totalDualTransactionPayment = dualTransactions.reduce((sum, t) => sum + parseFloat(t.payment), 0);
  const totalDualTransactionReceive = dualTransactions.reduce((sum, t) => sum + parseFloat(t.receive), 0);

  return (
    <div>
      
      <h3>Transaction Summary</h3>
      <table border="1" cellPadding="10" cellSpacing="0">
        <thead>
          <tr>
            <th>Description</th>
            <th>Payment</th>
            <th>Receive</th>
          </tr>
        </thead>
        <tbody>
          {cashPurchase && (
            <tr>
              <td><strong>Cash Purchase</strong> </td>
              <td>{cashPurchase.payment}</td>
              <td>--</td>
            </tr>
          )}
          {creditPurchase.map((t, index) => (
            <tr key={index}>
              <td>Credit Purchase - {t.acname}</td>
              <td>{t.total_tk}</td>
              <td>--</td>
            </tr>
          ))}
          <tr>
            <td ><strong>Total Credit Purchase</strong> </td>
            <td >{totalCreditPurchase}</td>
            <td>--</td>
          </tr>
          <tr>
            <td style={{color:'red'}}><strong> Total Cash + Credit Purchase</strong> </td>
            <td style={{color:'red',fontWeight:'bold'}}>{totalCashPurchase + totalCreditPurchase}</td>
            <td style={{color:'red',fontWeight:'bold'}}>{totalCreditPurchase}</td>
          </tr>
          {cashSales.map((t, index) => (
            <tr key={index}>
              <td> Cash Sales - {t.acname}</td>
              <td>--</td>
              <td>{t.total_tk}</td>
            </tr>
          ))}
          <tr>
            <td><strong> Total Cash Sales</strong> </td>
            <td>--</td>
            <td>{totalCashSales}</td>
          </tr>
          {creditSales.map((t, index) => (
            <tr key={index}>
              <td> Credit Sales -{t.acname}</td>
              <td>{t.total_tk}</td>
              <td>--</td>
            </tr>
          ))}
          <tr>
            <td><strong> Total Credit Sales </strong> </td>
            <td>{totalCreditSales}</td>
            <td>--</td>
          </tr>
          <tr>
            <td  style={{color:'red',fontWeight:'bold'}}><strong> Total Cash + Credit Sales</strong> </td>
            <td  style={{color:'red',fontWeight:'bold'}}>{totalCreditSales + totalCashSales}</td>
            <td  style={{color:'red',fontWeight:'bold'}}>{totalCreditSales}</td>
          </tr>
          {transactions.filter(t => t.payment > 0).map((t, index) => (
            <tr key={index}>
              <td> Cash Paid - {t.acname}</td>
              <td>{t.payment}</td>
              <td>--</td>
            </tr>
          ))}
          <tr>
            <td><strong> Total Cash Paid</strong> </td>
            <td><strong>{totalCashPaid}</strong></td>
            <td>--</td>
          </tr>
          {transactions.filter(t => t.receive > 0).map((t, index) => (
            <tr key={index}>
              <td> Cash Received -{t.acname}</td>
              <td>--</td>
              <td>{t.receive}</td>
            </tr>
          ))}
          <tr>
            <td><strong> Total Cash Received</strong> </td>
            <td>--</td>
            <td><strong>{totalCashReceived}</strong></td>
          </tr>
          {dualTransactions.map((t, index) => (
            <tr key={index}>
              <td> Dual Transaction - {t.acname}</td>
              <td>{t.payment > 0 ? t.payment : '--'}</td>
              <td>{t.receive > 0 ? t.receive : '--'}</td>
            </tr>
          ))}
          <tr>
            <td><strong> Total Dual Transaction Payment</strong> </td>
            <td>{totalDualTransactionPayment}</td>
            <td>--</td>
          </tr>
          <tr>
            <td><strong> Total Dual Transaction Receive</strong> </td>
            <td>--</td>
            <td>{totalDualTransactionReceive}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Finalreport;
