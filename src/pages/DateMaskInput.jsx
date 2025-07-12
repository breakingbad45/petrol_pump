import React, { useState } from 'react';

const DateMaskInput = () => {
  const MASK = '____-__-__';
  const [value, setValue] = useState(MASK);
  const [preview, setPreview] = useState('—');

  const isDigit = (char) => /\d/.test(char);

  const handleChange = (e) => {
    const input = e.nativeEvent.data;
    const isDelete = e.nativeEvent.inputType === 'deleteContentBackward';

    let chars = value.split('');

    if (isDelete) {
      // Replace last digit with _
      for (let i = chars.length - 1; i >= 0; i--) {
        if (isDigit(chars[i])) {
          chars[i] = '_';
          break;
        }
      }
    } else if (isDigit(input)) {
      // Replace next _ with digit
      for (let i = 0; i < chars.length; i++) {
        if (chars[i] === '_') {
          chars[i] = input;
          break;
        }
      }
    }

    const newValue = chars.join('');
    const [y, m, d] = [
      newValue.slice(0, 4),
      newValue.slice(5, 7),
      newValue.slice(8, 10),
    ];

    // Validate month
    if (m.length === 2 && (+m < 1 || +m > 12)) {
      chars[5] = '_';
      chars[6] = '_';
    }

    // Validate day based on month and year
    if (y.length === 4 && m.length === 2 && d.length === 2) {
      const maxDay = new Date(+y, +m, 0).getDate();
      if (+d > maxDay) {
        chars[8] = '_';
        chars[9] = '_';
      }
    }

    const finalValue = chars.join('');
    setValue(finalValue);

    if (!finalValue.includes('_')) {
      const dateObj = new Date(finalValue);
      setPreview(!isNaN(dateObj) ? dateObj.toDateString() : 'Invalid date');
    } else {
      setPreview('—');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      handleChange({ nativeEvent: { inputType: 'deleteContentBackward' } });
    }
  };

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '1rem' }}>
      <label htmlFor="dateInput">Enter Date (YYYY-MM-DD):</label><br />
      <input
        type="text"
        id="dateInput"
        value={value}
        onBeforeInput={handleChange}
        onKeyDown={handleKeyDown}
        inputMode="numeric"
        style={{
          padding: '0.5rem',
          fontSize: '1rem',
          width: '200px',
          letterSpacing: '2px',
          marginTop: '0.5rem',
        }}
      />
      <div style={{ marginTop: '1rem', fontWeight: 'bold' }}>
        Live Preview: {preview}
      </div>
    </div>
  );
};

export default DateMaskInput;
