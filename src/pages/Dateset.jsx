import React, { useEffect, useState } from 'react';
import axios from 'axios';
import axiosInstance from '../utils/axios';
import { Link, useNavigate } from "react-router-dom";
const Dateset = () => {
  const [date, setDate] = useState(null);
  const [error, setError] = useState(null);
  const [inputDate, setInputDate] = useState('');
  const [autoMode, setAutoMode] = useState(true); // Default auto mode to true
  const [mode, setMode] = useState(null);
  const navigate = useNavigate();
  // Function to get current date adjusted for GMT+6
  const getCurrentDateGMTPlus6 = () => {
    const currentDate = new Date();
    currentDate.setHours(currentDate.getHours() + 6);
    return currentDate.toISOString().split('T')[0];
  };

  useEffect(() => {
    const fetchDate = async () => {
      try {
        const response = await axiosInstance.get('/date_provider.php');
        setMode(response.data.mode); // Set mode from API response

        if (response.data.mode === '0') {
          // If mode is 0, set auto mode true and update date automatically
          setAutoMode(true);
          setDate(getCurrentDateGMTPlus6());
        } else {
          // Otherwise, set auto mode false and update date from API response
          setAutoMode(false);
          setDate(response.data.date);
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchDate(); // Initial fetch

    let intervalId;
    if (autoMode) {
      intervalId = setInterval(fetchDate, 60000); // Fetch date every 60 seconds if in auto mode
    }

    return () => clearInterval(intervalId); // Clear interval on component unmount
  }, []); // Run effect when autoMode changes

  const updateDate = async () => {
    console.log(autoMode);
    try {
      const response = await axiosInstance.post('/date_provider.php', {
        date: inputDate,
        mode: autoMode ? 0 : 1, // Send mode based on autoMode state
      });
      alert(response.data.message);
      navigate('/')
      setDate(inputDate); // Update displayed date immediately
    } catch (err) {
      setError(err.message);
    }
  };

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // You can adjust this threshold as needed
    };

    // Initial check
    handleResize();

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isMobile) {
      document.body.classList.add('sidebar-collapse');
      document.body.classList.remove('sidebar-open'); // Remove sidebar-open
    } else {
      document.body.classList.remove('sidebar-collapse');
    }
  }, [isMobile]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <div className="container" style={{ marginTop: '20px' }}>
        <div className="row">
          <div className="col-md-12" style={{ backgroundColor: 'lightblue', padding: '20px', textAlign: 'center' }}>
            <img
              width={85}
              height={100}
              src="/assets/akhiinternational.png"
              className="center-block"
              alt="Centered Image"
              style={{ marginBottom: '20px' }}
            />
            <form className="form-inline" style={{ display: 'inline-block' }}>
              {!autoMode && ( // Show input field only if autoMode is false
                <div className="form-group">
                  <label htmlFor="dateInput">Update Date: </label>
                  <input
                    type="date"
                    className="form-control"
                    id="dateInput"
                    value={inputDate}
                    onChange={(e) => setInputDate(e.target.value)}
                  />
                </div>
              )}
              <button type="button" className="btn btn-primary" onClick={updateDate}>
                Update
              </button>
            </form>
            <div style={{ marginTop: '20px' }}>
              <span style={{ fontWeight: 'bold', fontSize: '20px' }}>
                {date ? `Current Date: ${date}` : 'Loading...'}
              </span>
            </div>
            <div style={{ marginTop: '20px' }}>
              <label htmlFor="autoModeSwitch">Auto Mode: </label>
              <input
                type="checkbox"
                id="autoModeSwitch"
                checked={autoMode}
                onChange={(e) => setAutoMode(e.target.checked)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dateset;
