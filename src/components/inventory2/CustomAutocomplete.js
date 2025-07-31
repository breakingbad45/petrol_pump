import React, { useState, useEffect, useRef } from 'react';

const CustomAutocomplete = ({ data, onSelect, nextRef }) => {
  const [input, setInput] = useState('');
  const [inputid, setInputid] = useState('');
  const [filtered, setFiltered] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(0);
  const [justSelected, setJustSelected] = useState(false);
  const inputRef = useRef();
  const containerRef = useRef();
const itemRefs = useRef([]);
  useEffect(() => {
    if (justSelected) {
      setJustSelected(false);
      return;
    }

    if (input.trim() === '') {
      setFiltered([]);
      setShowDropdown(false);
      return;
    }

    const matches = data.filter(item =>
      item.name.toLowerCase().includes(input.toLowerCase())
    );

    const exactMatch = matches.find(item => item.name.toLowerCase() === input.toLowerCase());
    if (exactMatch) {
      setShowDropdown(false);
      return;
    }

    setFiltered(matches);
    setShowDropdown(matches.length > 0);
    setHighlightIndex(0);
  }, [input, data, justSelected]);

  const handleSelect = (item) => {
    setInput(item.name);
    setInputid(item.id);
    setShowDropdown(false);
    setJustSelected(true); // prevent dropdown reopening
    if (onSelect) onSelect(item);
    if (nextRef?.current) nextRef.current.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIndex(prev => Math.min(prev + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered.length > 0) {
        handleSelect(filtered[highlightIndex]);
      }
    }
  };

  const handleClickOutside = (e) => {
    if (!containerRef.current?.contains(e.target)) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
useEffect(() => {
  if (itemRefs.current[highlightIndex]) {
    itemRefs.current[highlightIndex].scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    });
  }
}, [highlightIndex]);
  return (
    <div className="form-group row" ref={containerRef} style={{ position: 'relative' }}>
      <label className="col-sm-4 control-label">Account</label>
      <div className="col-sm-8">
        <input
          ref={inputRef}
          className="form-control"
          name="account_name"
          value={input}
          autoComplete='off'
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (input.trim()) {
              const matches = data.filter(item =>
                item.name.toLowerCase().includes(input.toLowerCase())
              );
              setFiltered(matches);
              setShowDropdown(matches.length > 0);
            }
          }}
        />
         <span
          style={{
            position: 'absolute',
            right: '25px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#aaa',
            pointerEvents: 'none',
          }}
        >
          <i className="fa fa-search"></i> {/* Or use Bootstrap: bi bi-search */}
        </span>
      </div>

      {showDropdown && (
        <ul className="dropdown-menu" style={{
          display: 'block',
          position: 'absolute',
          top: '100%',
          left: '35%',
          width: '100%',
        //   maxWidth: '400px',
        //   maxHeight: '200px',
          overflowY: 'auto',
          zIndex: 1050
        }}>
          {filtered.length === 0 ? (
            <li className="list-group-item text-center text-muted">No data found</li>
          ) : (
            filtered.map((item, index) => (
              <li
              ref={el => itemRefs.current[index] = el}
                key={item.id}
                className={index === highlightIndex ? 'active list-group-item' : 'list-group-item'}
                onMouseEnter={() => setHighlightIndex(index)}
                onMouseDown={(e) => {
                  e.preventDefault(); // prevent blur before click
                  handleSelect(item);
                }}
              >
                <div className="media">
                  <div className="media-left">
                    <img
                      className="media-object img-circle"
                      src="https://via.placeholder.com/50"
                      alt="User"
                    />
                  </div>
                  <div className="media-body">
                    <h4 className="media-heading">{item.name}</h4>
                    <span>Email: jane.smith@example.com</span><br />
                    <span>Phone: 098-765-4321</span>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default CustomAutocomplete;
