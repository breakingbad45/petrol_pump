import React from 'react';
import Loader from '../../reuseable/Loader';

const BackupModal = ({ show }) => {
  if (!show) {
    return null;
  }

  return (
    <div style={modalStyle}>
      <div style={modalContentStyle}>
        <img src="./assets/dwnload.gif" alt="Loading..." style={gifStyle} />
        {/* <Loader /> */}
        <p style={textStyle}> ব্যাকআপ নেওয়া হচ্ছে অনুগ্রহপূর্বক অপেক্ষা করুন,এটি সর্বোচ্চ ৩০/৪০ সেকেন্ড সময় লাগবে ধন্যবাদ।  </p>
      </div>
    </div>
  );
};

const modalStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
};

const modalContentStyle = {
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '8px',
  textAlign: 'center',
  maxWidth: '400px',
  width: '100%',
};

const gifStyle = {
  width: '100%', // Adjust the size as needed
  marginBottom: '20px',
};

const textStyle = {
  marginTop: '10px',
};

export default BackupModal;
