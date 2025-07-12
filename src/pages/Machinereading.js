import React, { useEffect, useState, useRef, useMemo } from 'react';

const MachineTable = () => {
  const [machines, setMachines] = useState([]);
  const [fetchdate, setFetchDate] = useState('');
  const inputRefs = useRef([]);

  useEffect(() => {
    async function fetchPrev() {
      try {
        const res = await fetch('https://petrolpump.fahimtraders.com/backend/machinereadings/getData.php');
        const res2 = await fetch('https://petrolpump.fahimtraders.com/backend/machinereadings/getMachine.php');

        const machinesData = await res2.json();
        const prevData = await res.json();

        const dateServer = new Date(prevData[0].e_date);
        dateServer.setDate(dateServer.getDate() + 1);
        setFetchDate(dateServer.toISOString().slice(0, 10));

        const prevMap = {};
        prevData.forEach(m => {
          prevMap[m.machine_name] = parseFloat(m.end_reading) || 0;
        });

        const filled = machinesData.map(m => ({
          ...m,
          start_reading: prevMap[m.machine_name] || 0,
          end_reading: '',
          usage: '',
          total_tk: '',
          rate: m.rate || '',
        }));

        setMachines(filled);
      } catch (err) {
        console.error('Error fetching previous readings:', err);
        try {
          const res2 = await fetch('https://petrolpump.fahimtraders.com/backend/machinereadings/getMachine.php');
          const machinesData = await res2.json();
          setMachines(machinesData.map(m => ({
            ...m,
            start_reading: 0,
            end_reading: '',
            usage: '',
            total_tk: '',
            rate: m.rate || '',
          })));
        } catch (err2) {
          console.error('Fallback failed:', err2);
        }
      }
    }

    fetchPrev();
  }, []);

  const handleChange = (i, field, value) => {
    const updated = [...machines];
    updated[i][field] = value;

    const start = parseFloat(updated[i].start_reading) || 0;
    const end = parseFloat(updated[i].end_reading) || 0;
    const rate = parseFloat(updated[i].rate) || 0;

    const usage = Math.max(end - start, 0);
    updated[i].usage = usage;
    updated[i].total_tk = (usage * rate).toFixed(2);

    setMachines(updated);
  };

  const handleKeyDown = (e, row, col) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const nextRow = col === 2 ? row + 1 : row;
      const nextCol = col === 2 ? 0 : col + 1;
      const nextInput = inputRefs.current[nextRow]?.[nextCol];
      if (nextInput) {
        nextInput.focus();
        nextInput.select();
      }
    }
  };

  const saveData = async () => {
    const dataArray = machines.filter(m =>
      m.machine_name && m.product_id &&
      m.start_reading !== '' &&
      m.end_reading !== '' &&
      m.usage !== '' &&
      m.rate !== '' &&
      m.total_tk !== ''
    ).map(m => ({
      machine_name: m.machine_name,
      product: m.product,
      product_id: m.product_id,
      start_reading: Number(m.start_reading),
      end_reading: Number(m.end_reading),
      usage: Number(m.usage),
      rate: Number(m.rate),
      total_tk: Number(m.total_tk),
      operator: 'N/A',
      posted: 'N/A',
    }));

    const summaryMap = {};
    dataArray.forEach(item => {
      if (!summaryMap[item.product]) {
        summaryMap[item.product] = {
          product_id: item.product_id,
          product: item.product,
          total_liters: 0,
          total_tk: 0,
        };
      }
      summaryMap[item.product].total_liters += item.usage;
      summaryMap[item.product].total_tk += item.total_tk;
    });

    const summaryArray = Object.values(summaryMap);
    const payload = { data: dataArray, summary: summaryArray };

    try {
      const res = await fetch('https://petrolpump.fahimtraders.com/backend/machinereadings/createReadings.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (res.ok) {
        alert(result.message);
        window.location.reload();
      } else {
        alert('Error: ' + result.error);
      }
    } catch (err) {
      alert('Fetch error: ' + err.message);
    }
  };

  const summary = useMemo(() => {
    const res = {};
    let grandL = 0, grandT = 0;
    machines.forEach(m => {
      if (!m.product || !m.usage || !m.total_tk) return;
      const key = m.product.toUpperCase();
      res[key] = res[key] || { liters: 0, total: 0 };
      res[key].liters += parseFloat(m.usage);
      res[key].total += parseFloat(m.total_tk);
      grandL += parseFloat(m.usage);
      grandT += parseFloat(m.total_tk);
    });
    res._grand = { liters: grandL, total: grandT };
    return res;
  }, [machines]);

  return (
    <div style={{ display: 'flex', gap: '20px', padding: '20px' }}>
      <div style={{ flex: 3, backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
        <div style={{ backgroundColor: '#0F4471', color: '#fff', padding: '12px 20px', borderTopLeftRadius: '12px', borderTopRightRadius: '12px', fontSize: '18px', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between' }}>
          <span>Machine Readings</span>
          <span style={{ backgroundColor: '#1DA1F2', padding: '4px 12px', borderRadius: '8px' }}>{fetchdate}</span>
        </div>
        <div style={{ padding: '20px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#0F4471', color: '#fff' }}>
                <th style={{ padding: '8px' }}>Machine</th>
                <th style={{ padding: '8px' }}>Start</th>
                <th style={{ padding: '8px' }}>End</th>
                <th style={{ padding: '8px' }}>Usage</th>
                <th style={{ padding: '8px' }}>Rate</th>
                <th style={{ padding: '8px' }}>Total TK</th>
              </tr>
            </thead>
            <tbody>
              {machines.map((m, i) => {
                inputRefs.current[i] = inputRefs.current[i] || [];
                return (
                  <tr key={i}>
                    <td><input style={{ width: '100%', padding: '6px' }} readOnly value={m.machine_name} /></td>
                    <td><input style={{ width: '100%', padding: '6px' }} readOnly value={m.start_reading} ref={el => inputRefs.current[i][0] = el} onChange={e => handleChange(i, 'start_reading', e.target.value)} onKeyDown={e => handleKeyDown(e, i, 0)} /></td>
                    <td><input style={{ width: '100%', padding: '6px' }} value={m.end_reading} ref={el => inputRefs.current[i][1] = el} onChange={e => handleChange(i, 'end_reading', e.target.value)} onKeyDown={e => handleKeyDown(e, i, 1)} /></td>
                    <td><input style={{ width: '100%', padding: '6px' }} readOnly value={isNaN(m.usage) ? '' : parseFloat(m.usage).toFixed(2)} /></td>
                    <td><input style={{ width: '100%', padding: '6px' }} readOnly value={m.rate} ref={el => inputRefs.current[i][2] = el} onChange={e => handleChange(i, 'rate', e.target.value)} onKeyDown={e => handleKeyDown(e, i, 2)} /></td>
                    <td><input style={{ width: '100%', padding: '6px' }} readOnly value={isNaN(m.total_tk) ? '' : m.total_tk} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <button style={{ marginTop: '20px', padding: '12px 24px', backgroundColor: '#10B981', color: '#fff', border: 'none', borderRadius: '8px' }} onClick={saveData}>Save</button>
        </div>
      </div>
      <div style={{ flex: 1, backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
        <div style={{ backgroundColor: '#0F4471', color: '#fff', padding: '12px 20px', borderTopLeftRadius: '12px', borderTopRightRadius: '12px', fontSize: '16px', fontWeight: 'bold' }}>Fuel Summary</div>
        <div style={{ padding: '20px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#E7F1F7' }}>
                <th style={{ padding: '8px' }}>Fuel</th>
                <th style={{ padding: '8px' }}>Litre</th>
                <th style={{ padding: '8px' }}>Total TK</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(summary)
                .filter(([k]) => k !== '_grand')
                .map(([fuel, d]) => (
                  <tr key={fuel}>
                    <td>{fuel}</td>
                    <td style={{ textAlign: 'right' }}>{d.liters.toFixed(2)}</td>
                    <td style={{ textAlign: 'right' }}>{d.total.toFixed(2)}</td>
                  </tr>
                ))}
              <tr style={{ backgroundColor: '#D1FAE5', fontWeight: 'bold' }}>
                <td>Total</td>
                <td style={{ textAlign: 'right' }}>{summary._grand.liters.toFixed(2)}</td>
                <td style={{ textAlign: 'right' }}>{summary._grand.total.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MachineTable;