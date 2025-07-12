import React from 'react';
import axios from 'axios';

const PaymentUi = () => {
  const containerStyle = {
    border: '1px solid #ccc',
    padding: '20px',
    borderRadius: '10px',
    textAlign: 'center',
    width: '600px',
    margin: '20px auto'
  };

  const imageContainerStyle = {
    border: '1px solid #000',
    padding: '10px',
    marginBottom: '10px'
  };

  const statusStyle = {
    textAlign: 'center',
    fontSize: '14px',
    color: 'red'
  };

  const imageGroupStyle = {
    display: 'inline-block',
    width: '100px',
    height: '100px',
    border: '1px solid #000',
    margin: '5px'
  };

  const payButtonStyle = {
    display: 'block',
    width: '80px',
    margin: '10px auto',
    padding: '10px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  };

  const handlePayment = async () => {
    const paymentData = {
      amount: 500, // Example value
      sale: "Sale123", // Example value, replace with actual data
      season: "Summer2024", // Example value, replace with actual data
      api_key: "your_api_key", // Replace with actual API key
      timestamp: Date.now(),
      base_url: "http://localhost:3000",
      organization: "AKHIINTERNATIONAL"
    };

    try {
      const response = await axios.post("https://paymentverify.vercel.app/api/bkash/create", paymentData);

      console.log("Payment Response:", response);

      if (response.data.status===true) {
        // Redirect to success page
        window.location.href = response?.data?.data?.data?.bkashURL;
      } else {
        // Handle failure
      
      }
    } catch (error) {
      console.error("Error during payment:", error);
      // Handle error
    
    }
  };

  return (
    <div style={containerStyle}>
      <h3>Please Confirm Your Payment</h3>
      <div className="row">
        {/* Left Image Section */}
        <div className="col-md-6">
          <div style={imageContainerStyle}>
            <div style={{ width: '100%', height: '150px', backgroundColor: '#f0f0f0' }}>
              <img src="assets/paymenterror.png" alt="Bkash" style={{ maxWidth: '100%', maxHeight: '100%' }} />
            </div>
          </div>
          <div style={statusStyle}>Status: Inactive</div>
        </div>

        {/* Right Image Group Section */}
        <div className="col-md-6">
          <div className="row">
            <div className="col-md-6" style={imageGroupStyle}>
              <img src="assets/bkash.jpg" alt="Nagad" style={{ maxWidth: '100%', maxHeight: '100%' }} />
            </div>
            <div className="col-md-6" style={imageGroupStyle}>
              <img src="assets/nagad.jpg" alt="Upay" style={{ maxWidth: '100%', maxHeight: '100%' }} />
            </div>
          </div>
          <div className="row">
            <div className="col-md-6" style={imageGroupStyle}>
              <img src="assets/rocket.jpg" alt="Rocket" style={{ maxWidth: '100%', maxHeight: '100%' }} />
            </div>
            <div className="col-md-6" style={imageGroupStyle}>
              <img src="assets/upay.jpg" alt="Bkash" style={{ maxWidth: '100%', maxHeight: '100%' }} />
            </div>
          </div>
          <button style={payButtonStyle} onClick={handlePayment}>Pay</button>
        </div>
      </div>
    </div>
  );
};

export default PaymentUi;
