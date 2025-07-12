import { useState, useEffect } from 'react';
import crypto from 'crypto-js';

const useApiData = () => {
  
  const [apiData, setApiData] = useState({
    api_key: '',
    timestamps: '',
    timestamp: '',
  });

  useEffect(() => {
    const getCurrentTimestamp = () => {
      const now = new Date();
      const year = now.getUTCFullYear();
      const month = String(now.getUTCMonth() + 1).padStart(2, '0');
      const day = String(now.getUTCDate()).padStart(2, '0');
      const hours = String(now.getUTCHours()).padStart(2, '0');
      const minutes = String(now.getUTCMinutes()).padStart(2, '0');
      const seconds = String(now.getUTCSeconds()).padStart(2, '0');
      const milliseconds = String(now.getUTCMilliseconds()).padStart(3, '0');

      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}Z`;
    };

    const getCurrentTimestampWith5Seconds = () => {
      const currentTimestamp = new Date();
      currentTimestamp.setSeconds(currentTimestamp.getUTCSeconds() +2);

      const year = currentTimestamp.getUTCFullYear();
      const month = String(currentTimestamp.getUTCMonth() + 1).padStart(2, '0');
      const day = String(currentTimestamp.getUTCDate()).padStart(2, '0');
      const hours = String(currentTimestamp.getUTCHours()).padStart(2, '0');
      const minutes = String(currentTimestamp.getUTCMinutes()).padStart(2, '0');
      const seconds = String(currentTimestamp.getUTCSeconds()).padStart(2, '0');
      const milliseconds = String(currentTimestamp.getUTCMilliseconds()).padStart(3, '0');

      const modifiedTimestamp = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}Z`;

      return {  modifiedTimestamp };
    };

    const generateHMAC = (data, secretKey) => {
      const hmac = crypto.HmacSHA256(data, secretKey);
      return crypto.enc.Hex.stringify(hmac);
    };

    const timestamps = getCurrentTimestampWith5Seconds();
   
    const currentTimestampl = new Date().getTime();
    const futureTimestamp = currentTimestampl + 30000;
    const timestamp =  futureTimestamp.toString();
    const secretKey = 'mySecretKey';

    // Generate HMAC
    const api_key = generateHMAC(timestamp, secretKey);

    setApiData({
      api_key,
      timestamps,
      timestamp,
    });
  }, []); // Empty dependency array to run the effect only once

  return apiData;
};

export default useApiData;
