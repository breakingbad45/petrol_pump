import React, { useState, useRef ,useEffect} from 'react';
import { Select } from 'antd';

const sideOptions = [
  { value: 'convayer', label: 'Convayer' },
  { value: 'banglabandha', label: 'Banglabandha' }
];

const sizeOptions = [
  { value: '3/4', label: '3/4' },
  { value: '5/8', label: '5/8' },
  { value: 'torsha', label: 'Torsha' }
];

const acOptions = [
  { value: 'aziziul', label: 'Aziziul' },
  { value: 'mozibul', label: 'Mozibul' },
  { value: 'ghotikul', label: 'Ghotikul' }
];

const Universalform = () => {
  const [rows, setRows] = useState(
    Array(5).fill({ side: '', size: '', vehicle: '', unit1: '', unit2: '', rate: '', total: '' })
  );

  const [formData, setFormData] = useState({
    billType: 'Cash',
    sellType: 'Sale',
    account: '',
    remarks: ''
  });

  const [footerData, setFooterData] = useState({
    paid: 0,
    discount: 0,
    loadUnload: 0,
    transport: 0,
  });

  const refs = useRef({});

  const focusNextField = (current) => {
    const nextFieldOrder = [
      'billType', 'sellType', 'account', 'remarks',
      ...rows.flatMap((_, i) => [
        `side_${i}`, `size_${i}`, `vehicle_${i}`, `unit1_${i}`, `unit2_${i}`, `rate_${i}`
      ])
    ];
    const currentIndex = nextFieldOrder.indexOf(current);
    const next = nextFieldOrder[currentIndex + 1];
    if (refs.current[next]) refs.current[next].focus();
  };

  const handleKeyDown = (e, index, field) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const current = `${field}_${index}`;
      if (field === 'rate' && index === rows.length - 1) addRow();
      focusNextField(current);
    }
  };

  const handleInputChange = (e, rowIndex, field) => {
    const { value } = e.target;
    setRows(prevRows => {
      const updatedRows = [...prevRows];
      updatedRows[rowIndex] = {
        ...updatedRows[rowIndex],
        [field]: value,
      };

      const { unit1, unit2, rate } = updatedRows[rowIndex];
      const u1 = parseFloat(field === 'unit1' ? value : unit1) || 0;
      const u2 = parseFloat(field === 'unit2' ? value : unit2) || 0;
      const r = parseFloat(field === 'rate' ? value : rate) || 0;
      updatedRows[rowIndex].total = (u1 * u2 * r).toFixed(2);

      return updatedRows;
    });
  };

  const handleSelectChange = (selected, rowIndex, field) => {
    setRows(prev => {
      const updatedRows = prev.map((row, i) => (
        i === rowIndex ? { ...row, [field]: selected } : row
      ));
      return updatedRows;
    });

    const fieldKey = `${field}_${rowIndex}`;
    focusNextField(fieldKey);
  };

  const handleFormInput = (e, name) => {
    if (e.key === 'Enter') {
      const order = ['billType', 'sellType', 'account', 'remarks'];
      const idx = order.indexOf(name);
      const next = order[idx + 1];
      if (refs.current[next]) refs.current[next].focus();
    }
    setFormData({ ...formData, [name]: e.target.value });
  };

  const addRow = () => {
    setRows([...rows, { side: '', size: '', vehicle: '', unit1: '', unit2: '', rate: '', total: '' }]);
  };

  const removeRow = (index) => {
    setRows(rows.filter((_, i) => i !== index));
  };

  const handleFooterChange = (e, field) => {
    setFooterData(prev => ({
      ...prev,
      [field]: parseFloat(e.target.value) || 0
    }));
  };

  const totalAmount = rows.reduce((sum, row) => sum + parseFloat(row.total || 0), 0);
  const { paid, discount, loadUnload, transport } = footerData;
  const finalTotal = totalAmount - paid- discount + loadUnload + transport;

  const handleSubmit = () => {
    const entryFormData = { ...formData };
    const detailsFormData = rows;
    const footerFormData = { ...footerData, grandTotal: finalTotal.toFixed(2) };

    console.log('ENTRY FORM:', entryFormData);
    console.log('DETAILS FORM:', detailsFormData);
    console.log('FOOTER FORM:', footerFormData);

    // Submit logic here (API call, local storage, etc.)
  };

  const [show, setshow] = useState(false)
  useEffect(() => {
    setshow(!show)
  }, [formData.billType])
  
  return (
    <div className="container-fluid p-3">

      <div style={{marginTop:'5px'}} className="row  mx-n2">
        {/* Entry Form */}
        <div className="col-md-3">
          <div style={{background:'white',padding:'15px'}} className="section-box p-3">
            <div style={{ background: formData.sellType === 'sale' ? 'rgb(89, 225, 89)' : 'rgb(253, 63, 63)',padding:'10px',color:'white'}} className="entry-header">Entry Form</div>
            <div className="form-group mt-3">
              <label>Bill Type</label><br />
              <label className="mr-2">
                <input type="radio" name="billType" value="Cash" checked={formData.billType === 'Cash'}
                  onChange={e => setFormData({ ...formData, billType: e.target.value })}
                  onKeyDown={e => handleFormInput(e, 'billType')}
                  ref={el => refs.current['billType'] = el}
                /> Cash
              </label>
              <label>
                <input type="radio" name="billType" value="Credit" checked={formData.billType === 'Credit'}
                  onChange={e => setFormData({ ...formData, billType: e.target.value })} /> Credit
              </label>
            </div>
            <div className="form-group">
              <label>Sell Type</label>
              <select className="form-control" value={formData.sellType}
                onChange={e => setFormData({ ...formData, sellType: e.target.value })}
                onKeyDown={e => handleFormInput(e, 'sellType')}
                ref={el => refs.current['sellType'] = el}>
                <option value="">Select</option>
                <option value="Sale">Sale</option>
                <option value="Purchase">Purchase</option>
              </select>
            </div>
            {show ===false && (
        <div className="form-group">
          <label>A/C</label>
          <Select
            style={{ width: '100%' }}
            value={formData.account || undefined}
            onChange={val => {
              setFormData({ ...formData, account: val });
              focusNextField('account');
            }}
            ref={el => refs.current['account'] = el}
            options={acOptions}
          />
        </div>
      )}
            <div className="form-group">
              <label>Remarks</label>
              <input className="form-control" value={formData.remarks}
                onChange={e => setFormData({ ...formData, remarks: e.target.value })}
                onKeyDown={e => handleFormInput(e, 'remarks')}
                ref={el => refs.current['remarks'] = el}
              />
            </div>
          </div>
        </div>

        {/* Details Table */}
        <div className="col-md-9">
          <div style={{background:'white',padding:'15px'}} className="section-box">
            <div style={{background:'blue',padding:'10px',color:'white'}}  className="details-header">Details Form</div>
            <div className="table-responsive">
              <table id="unitbl" className="table table-bordered mb-0">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>SIDE</th>
                    <th>SIZE</th>
                    <th>VEHICLE</th>
                    <th>UNIT 1</th>
                    <th>UNIT 2</th>
                    <th>RATE</th>
                    <th>TOTAL</th>
                    <th>⟳</th>
                    <th>🗑</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>
                        <Select
                          style={{ width: 100 }}
                          value={row.side}
                          onChange={val => handleSelectChange(val, i, 'side')}
                          ref={el => refs.current[`side_${i}`] = el}
                          options={sideOptions}
                        />
                      </td>
                      <td>
                        <Select
                          style={{ width: 100 }}
                          value={row.size}
                          onChange={val => handleSelectChange(val, i, 'size')}
                          ref={el => refs.current[`size_${i}`] = el}
                          options={sizeOptions}
                        />
                      </td>
                      <td><input type="text" className="form-control" value={row.vehicle}
                        onChange={e => handleInputChange(e, i, 'vehicle')}
                        onKeyDown={e => handleKeyDown(e, i, 'vehicle')}
                        ref={el => refs.current[`vehicle_${i}`] = el}
                      /></td>
                      <td><input type="number" className="form-control" value={row.unit1}
                        onChange={e => handleInputChange(e, i, 'unit1')}
                        onKeyDown={e => handleKeyDown(e, i, 'unit1')}
                        ref={el => refs.current[`unit1_${i}`] = el}
                      /></td>
                      <td><input type="number" className="form-control" value={row.unit2}
                        onChange={e => handleInputChange(e, i, 'unit2')}
                        onKeyDown={e => handleKeyDown(e, i, 'unit2')}
                        ref={el => refs.current[`unit2_${i}`] = el}
                      /></td>
                      <td><input type="number" className="form-control" value={row.rate}
                        onChange={e => handleInputChange(e, i, 'rate')}
                        onKeyDown={e => handleKeyDown(e, i, 'rate')}
                        ref={el => refs.current[`rate_${i}`] = el}
                      /></td>
                      <td><input type="number" className="form-control" value={row.total} readOnly /></td>
                      <td><button className="icon-btn text-primary" onClick={() => handleInputChange({ target: { value: '' } }, i, 'rate')}>⟳</button></td>
                      <td><button className="icon-btn text-danger" onClick={() => removeRow(i)}>🗑</button></td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr><th colSpan="7" className="text-right">TOTAL</th><th>{totalAmount.toFixed(2)}</th><th colSpan="2"></th></tr>
                  <tr><th colSpan="7" className="text-right">PAID</th>
                    <th colSpan="3"><input type="number" className="form-control" value={footerData.paid}
                      onChange={e => handleFooterChange(e, 'paid')} /></th>
                  </tr>
                  <tr><th colSpan="7" className="text-right">DISCOUNT</th>
                    <th colSpan="3"><input type="number" className="form-control" value={footerData.discount}
                      onChange={e => handleFooterChange(e, 'discount')} /></th>
                  </tr>
                  <tr><th colSpan="7" className="text-right">LOAD/UNLOAD</th>
                    <th colSpan="3"><input type="number" className="form-control" value={footerData.loadUnload}
                      onChange={e => handleFooterChange(e, 'loadUnload')} /></th>
                  </tr>
                  <tr><th colSpan="7" className="text-right">TRANSPORT</th>
                    <th colSpan="3"><input type="number" className="form-control" value={footerData.transport}
                      onChange={e => handleFooterChange(e, 'transport')} /></th>
                  </tr>
                  <tr><th colSpan="7" className="text-right">GRAND TOTAL</th><th>{finalTotal.toFixed(2)}</th><th colSpan="2"></th></tr>
                </tfoot>
              </table>
              <div className="text-right mt-3">
                <button className="btn btn-primary" onClick={handleSubmit}>Submit</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Universalform;
