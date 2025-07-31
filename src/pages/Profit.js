import React, { useState } from 'react';
import numberWithCommas from '../utils/numberWithCommas';

const InventorySummary = () => {
  const products = [
    { id: '4873', name: 'Octan' },
    { id: '4871', name: 'Petrol' },
    { id: '4872', name: 'Diesel' },
    { id: '4874', name: 'LPG' },
  ];

  const accounts = [
    { id: '11065', name: 'Octan Expense' },
    { id: '11064', name: 'Petrol Expense' },
    { id: '11063', name: 'Diesel Expense' },
  ];

  const [productId, setProductId] = useState('');
  const [acId, setAcId] = useState('');
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  const toBn = (number) => String(number).replace(/\d/g, (digit) => bengaliDigits[digit]);

  const fetchSummary = async () => {
    if (!productId || !acId) {
      alert('Please select both Product and Account');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://petrolpump.fahimtraders.com/backend/products/profitReport.php?product_id=${productId}&ac_id=${acId}&month=${month}&year=${year}`
      );
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Failed to load data');
    }
    setLoading(false);
  };

  const formatNum = (n) =>
    typeof n === 'number' && !isNaN(n) ? n.toFixed(3) : '0.000';

  const runningStock = data ? data.previous_stock + data.purchase_qty - data.sell_qty : 0;
  const somaponistokavg = data
    ? (data.previous_stock * data.prev_avg + data.purchase_amount + parseFloat(data.total_expense_this_month)) /
      (data.previous_stock + data.purchase_qty)
    : 0;
  const runningStockAmount = runningStock * somaponistokavg;

  const inputStyle = {
    padding: '8px',
    width: '100%',
    marginBottom: '10px',
    fontSize: '14px',
  };

  const labelStyle = {
    fontWeight: 'bold',
    marginBottom: '4px',
    display: 'block',
  };

  const sectionStyle = { marginBottom: '20px' };
  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '20px',
    fontSize: '14px',
  };

  const thStyle = {
    backgroundColor: '#e9ecef',
    padding: '8px',
    border: '1px solid #ddd',
    textAlign: 'left',
  };

  const tdStyle = {
    padding: '2px',
    border: '1px solid #ddd',
  };

  const tdStyleRight = {
    ...tdStyle,
    textAlign: 'right',
  };

  const headerStyle = {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '20px',
  };

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '20px', background: 'white' }}>
      <h2 style={headerStyle}>Inventory Summary</h2>

      {/* Input Section */}
      <div style={sectionStyle}>
        <label style={labelStyle}>Product</label>
        <select
          style={inputStyle}
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
        >
          <option value="">-- Select Product --</option>
          {products.map((prod) => (
            <option key={prod.id} value={prod.id}>
              {prod.name}
            </option>
          ))}
        </select>

        <label style={labelStyle}>Account</label>
        <select
          style={inputStyle}
          value={acId}
          onChange={(e) => setAcId(e.target.value)}
        >
          <option value="">-- Select Account --</option>
          {accounts.map((acc) => (
            <option key={acc.id} value={acc.id}>
              {acc.name}
            </option>
          ))}
        </select>

        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Month</label>
            <input
              type="number"
              style={inputStyle}
              value={month}
              min="1"
              max="12"
              onChange={(e) => setMonth(e.target.value)}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Year</label>
            <input
              type="number"
              style={inputStyle}
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />
          </div>
        </div>
      </div>

      <button
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          fontWeight: 'bold',
          cursor: 'pointer',
          marginBottom: '20px',
        }}
        onClick={fetchSummary}
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Get Summary'}
      </button>

      {data && (
        <div>
          {/* Expense Table */}
          <h5 style={{ fontWeight: 'bold', marginBottom: '10px' }}>Expense List</h5>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>তারিখ</th>
                <th style={thStyle}>মন্তব্য</th>
                <th style={thStyle}>টাকা</th>
              </tr>
            </thead>
            <tbody>
              {data.expense_list?.map((item, idx) => (
                <tr key={idx}>
                  <td style={tdStyle}>{toBn(item.e_date)}</td>
                  <td style={tdStyle}>{item.remarks}</td>
                  <td style={tdStyleRight}>{toBn(numberWithCommas(formatNum(parseFloat(item.payment))))}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="2" style={{ ...tdStyle, fontWeight: 'bold', textAlign: 'right' }}>মোট</td>
                <td style={{ ...tdStyleRight, fontWeight: 'bold' }}>
                  {toBn(numberWithCommas(formatNum(data.total_expense_this_month)))}
                </td>
              </tr>
            </tfoot>
          </table>

          {/* Summary Table */}
          <h5 style={{ fontWeight: 'bold', marginBottom: '10px' }}>Summary</h5>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>#</th>
                <th style={thStyle}>পরিমাণ</th>
                <th style={thStyle}>মোট টাকা</th>
                <th style={thStyle}>গড় মুল্য</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={tdStyle}>আগের জের</td>
                <td style={tdStyleRight}>{toBn(numberWithCommas(formatNum(data.previous_stock)))}</td>
                <td style={tdStyleRight}>{toBn(numberWithCommas(formatNum(data.previous_stock * data.prev_avg)))}</td>
                <td style={tdStyleRight}>{toBn(numberWithCommas(formatNum(data.prev_avg)))}</td>
              </tr>
              <tr>
                <td style={tdStyle}>ক্রয়</td>
                <td style={tdStyleRight}>{toBn(numberWithCommas(formatNum(data.purchase_qty)))}</td>
                <td style={tdStyleRight}>{toBn(numberWithCommas(formatNum(data.purchase_amount)))}</td>
                <td style={tdStyleRight}>
                  {data.purchase_qty > 0
                    ? toBn(numberWithCommas(formatNum(data.purchase_amount / data.purchase_qty)))
                    : '০.০০০'}
                </td>
              </tr>
              <tr style={{ fontWeight: 'bold', color: 'red' }}>
                <td style={tdStyle}>পরিবহন খরচ</td>
                <td style={tdStyle}></td>
                <td style={tdStyleRight}>{toBn(numberWithCommas(formatNum(data.total_expense_this_month)))}</td>
                <td style={tdStyle}></td>
              </tr>
              <tr style={{ fontWeight: 'bold', backgroundColor: '#f1f1f1' }}>
                <td style={tdStyle}>মোট খরচ</td>
                <td style={tdStyleRight}>
                  {toBn(numberWithCommas(formatNum(data.previous_stock + data.purchase_qty)))}
                </td>
                <td style={tdStyleRight}>
                  {toBn(numberWithCommas(formatNum(
                    data.previous_stock * data.prev_avg +
                    data.purchase_amount +
                    parseFloat(data.total_expense_this_month)
                  )))}
                </td>
                <td style={tdStyle}></td>
              </tr>
              <tr>
                <td style={tdStyle}>সমাপনী মজুদ</td>
                <td style={tdStyleRight}>{toBn(numberWithCommas(formatNum(runningStock)))}</td>
                <td style={{ ...tdStyleRight, color: runningStockAmount < 0 ? 'red' : 'inherit' }}>
                  {toBn(numberWithCommas(formatNum(runningStockAmount)))}
                </td>
                <td style={tdStyleRight}>{toBn(numberWithCommas(formatNum(somaponistokavg)))}</td>
              </tr>
              <tr style={{ fontWeight: 'bold', backgroundColor: '#f1f1f1' }}>
                <td style={tdStyle}>নীট ক্রয় মুল্য</td>
                <td style={tdStyle}></td>
                <td style={tdStyleRight}>
                  {toBn(numberWithCommas(formatNum(
                    data.previous_stock * data.prev_avg +
                    data.purchase_amount +
                    parseFloat(data.total_expense_this_month) -
                    runningStockAmount
                  )))}
                </td>
                <td style={tdStyle}></td>
              </tr>
              <tr>
                <td style={tdStyle}>মোট বিক্রয়</td>
                <td style={tdStyleRight}>{toBn(numberWithCommas(formatNum(data.sell_qty)))}</td>
                <td style={tdStyleRight}>{toBn(numberWithCommas(formatNum(data.sell_amount)))}</td>
                <td style={tdStyleRight}>
                  {data.sell_qty > 0
                    ? toBn(numberWithCommas(formatNum(data.sell_amount / data.sell_qty)))
                    : '০.০০০'}
                </td>
              </tr>
              <tr style={{ fontWeight: 'bold', color: 'green' }}>
                <td style={tdStyle}>মুনাফা</td>
                <td style={tdStyle}></td>
                <td style={tdStyleRight}>
                  {toBn(numberWithCommas(formatNum(
                    data.sell_amount -
                    (data.previous_stock * data.prev_avg +
                      data.purchase_amount +
                      parseFloat(data.total_expense_this_month) -
                      runningStockAmount)
                  )))}
                </td>
                <td style={tdStyle}></td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default InventorySummary;
