import React, { useEffect, useState } from "react";

const Transaction = () => {
  const [data, setData] = useState(null);
  const [remainingTime, setRemainingTime] = useState(0);
  const [currentLapTime, setCurrentLapTime] = useState();
  const [currentLap, setCurrentLap] = useState();
  const [currentCatalog, setCurrentCatalog] = useState("");
  const [endTime, setEndTime] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://eauction.auctionserver.xyz/api/collections/auctions/records");
        const result = await response.json();
        const auctionData = result.items[0];
        
        setData(auctionData);

        // Set up timing based on auction data
        const catalogLength = auctionData.catalougs.length;
        const totalDuration = 30 * catalogLength; // Total duration in seconds
        const startTime = new Date(auctionData.updated || auctionData.Start);
        const calculatedEndTime = new Date(startTime.getTime() + totalDuration * 1000);
        
        setEndTime(calculatedEndTime);
        setCurrentCatalog(auctionData.catalougs[0]);
        
        // Calculate initial remaining time
        const initialRemainingTime = Math.round((calculatedEndTime - new Date()) / 1000);
        setRemainingTime(initialRemainingTime);
        
        // Set up timer to update remaining time every second
        const timer = setInterval(() => {
          const newRemainingTime = Math.round((calculatedEndTime - new Date()) / 1000);

          if (newRemainingTime <= 0) {
            clearInterval(timer);
            setRemainingTime(0);
            setCurrentLapTime(0);
            setCurrentLap(catalogLength);
          } else {
            setRemainingTime(newRemainingTime);
            const newLap = Math.ceil(newRemainingTime / 30);
            const lapTime = newRemainingTime % 30 || 30;

            setCurrentLap(newLap);
            setCurrentLapTime(lapTime);
            setCurrentCatalog(auctionData.catalougs[newLap - 1]);
          }
        }, 1000);

        return () => clearInterval(timer);
      } catch (error) {
        console.error("Error fetching auction data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>Auction Timer</h2>
      {data ? (
        <div>
          <p>Message: {data.Message}</p>
          <p>Broker: {data.broker}</p>
          <p>Start Time: {new Date(data.updated).toLocaleString()}</p>
          <p>End Time: {endTime ? endTime.toLocaleString() : "Calculating..."}</p>
          <p>Catalogs: {data.catalougs.length} items</p>
          <p>Total Duration: {30 * data.catalougs.length} seconds</p>
          <p>Remaining Time: {remainingTime > 0 ? remainingTime + " seconds" : "Auction ended"}</p>
          
          <h3>Current Lap</h3>
          <p>Lap {currentLap} of {data.catalougs.length}</p>
          <p>Countdown for Lap {currentLap}: {currentLapTime} seconds</p>
          <p>Current Catalog Item: {currentCatalog}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Transaction;
