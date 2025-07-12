import React, { useEffect, useState ,useRef} from 'react';
import axiosInstance from '../utils/axios';
import numberWithCommas from '../utils/numberWithCommas';


const initialValues = [
    { denomination: 1000, qty: 5, total: 5000 },
    { denomination: 500, qty: 0, total: 0 },
    { denomination: 200, qty: 0, total: 0 },
    { denomination: 100, qty: 0, total: 0 },
    { denomination: 'Other 1', qty: 0, total: 7000 },
    { denomination: 'Other 2', qty: 0, total: 0 },
    { denomination: 'Other 83', qty: 0, total: 0 },
    { denomination: 'Other 4', qty: 0, total: 0 },
    { denomination: 'Other 5', qty: 0, total: 0 }
  ];

  // State to store input values and software balance
  const [cashValues, setCashValues] = useState(initialValues);
  const [softwareClosingBalance, setSoftwareClosingBalance] = useState(1000);

  const inputRefs = useRef([]);
  const labelRefs = useRef([]);

  // Focus and select the 1000 input on page load
  useEffect(() => {
    inputRefs.current[0].focus();
    inputRefs.current[0].select();
  }, []);

  const handleChange = (e, index) => {
    const updatedValues = [...cashValues];
    const qty = e.target.value === '' ? 0 : parseInt(e.target.value, 10);
    updatedValues[index].qty = qty;
    
    // Only update the total if denomination is a number
    if (typeof updatedValues[index].denomination === 'number') {
      updatedValues[index].total = qty * updatedValues[index].denomination;
    }
    setCashValues(updatedValues);
  };

  const handleOtherChange = (e, index) => {
    const updatedValues = [...cashValues];
    const qty = e.target.value === '' ? 0 : parseInt(e.target.value, 10);
    updatedValues[index].qty = qty;
    updatedValues[index].total = qty; // Update total directly based on input
    setCashValues(updatedValues);
  };

  const handleLabelChange = (e, index) => {
    const updatedValues = [...cashValues];
    updatedValues[index].denomination = e.target.value;
    setCashValues(updatedValues);
  };

  const handleKeyPress = (e, nextIndex, nextType) => {
    if (e.key === 'Enter') {
      if (nextType === 'label' && labelRefs.current[nextIndex]) {
        labelRefs.current[nextIndex].focus();
        labelRefs.current[nextIndex].select();
      } else if (inputRefs.current[nextIndex]) {
        inputRefs.current[nextIndex].focus();
        inputRefs.current[nextIndex].select();
      }
    }
  };

  const calculateGrandTotal = () => {
    return cashValues.reduce((acc, curr) => acc + curr.total, 0);
  };

  const calculateCashInHand = () => calculateGrandTotal() - softwareClosingBalance;

  const handleSave = () => {
    const savedData = cashValues.map(item => ({
      denomination: item.denomination,
      qty: item.qty.toString(),
      total: item.total.toString(),
    }));
    
    console.log('Saved Data:', savedData);
    console.log('Software Closing Balance:', softwareClosingBalance);
  };

const CashCount = () => {
  return (
    <div>

      
      <div className="col-md-6">
  <h2 className="text-center mb-4">Cash Figure</h2>
  <table className="table table-bordered">
    <thead>
      <tr style={{ backgroundColor: 'yellow', textAlign: 'center', fontWeight: 'bold' }}>
        <th className="text-danger">Denomination</th>
        <th>Count</th>
        <th>Total</th>
      </tr>
    </thead>
    <tbody>
      {cashValues.map((item, index) => (
        <tr key={index}>
          <td style={{ textAlign: 'center', border: '1px solid black' }}>
            {typeof item.denomination === 'number' ? (
              item.denomination + ' *'
            ) : (
              <input
                type="text"
                ref={(el) => (labelRefs.current[index] = el)}
                value={item.denomination}
                onChange={(e) => handleLabelChange(e, index)}
                className="form-control"
                onKeyDown={(e) => handleKeyPress(e, index, 'input')}
                style={{
                  border: 'none',
                  textAlign: 'center',
                  backgroundColor: 'transparent',
                  fontSize: '16px',
                }}
              />
            )}
          </td>
          <td style={{ textAlign: 'center', border: '1px solid black' }}>
            <input
              type="number"
              ref={(el) => (inputRefs.current[index] = el)}
              value={item.qty}
              onChange={(e) => {
                if (typeof item.denomination === 'number') {
                  handleChange(e, index);
                } else {
                  handleOtherChange(e, index);
                }
              }}
              onKeyDown={(e) => handleKeyPress(e, index + 1, typeof cashValues[index + 1]?.denomination === 'number' ? 'input' : 'label')}
              className="form-control"
              style={{
                border: 'none',
                textAlign: 'center',
                backgroundColor: 'transparent',
                fontSize: '16px',
              }}
            />
          </td>
          <td style={{ textAlign: 'center', border: '1px solid black' }}>{item.total} TK</td>
        </tr>
      ))}
    </tbody>
  </table>

  <div className="row">
    <div className="col-md-6">
      <p>Total Cash: {calculateGrandTotal()} TK</p>
      <div className="form-group">
        <label>Software Cash:</label>
        <input
          type="number"
          value={softwareClosingBalance}
          onChange={(e) => setSoftwareClosingBalance(parseInt(e.target.value, 10))}
          className="form-control"
        />
      </div>
      <p>Cash in Hand: {calculateCashInHand()} TK</p>
    </div>
  </div>

  <button onClick={handleSave} className="btn btn-primary mt-4">
    Save
  </button>
</div>  
    </div>
  )
}

export default CashCount