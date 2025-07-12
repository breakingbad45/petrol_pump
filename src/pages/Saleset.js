import React, { useState,useEffect } from "react";
import pb from "../utils/pocketbase";
import {useNavigate } from 'react-router-dom';

import { Switch } from 'antd';
const Saleset = () => {
  // State variables for input values
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState(true);
  
  const isLogged = pb.authStore.isValid;
  const isDue = pb.authStore.model.ps;
  const navigate = useNavigate();
  useEffect(() => {
   if(!isLogged){
    navigate('/')
   } else if(isDue){
    navigate('/payment')
   }
  }, []);
  useEffect(() => {
  
    (async()=>{
      const response = await pb.collection('dateset').getFullList({
        filter:`posted="${pb.authStore.model.expand.reference.id}" `,
        sort: '-created',
    });
    
        setDate(response[0].date)
        setMode(response[0].automode)
      console.log(response[0].automode);
    })()
  }, []);

  console.log(date)
  // Function to handle the update button click
  const handleUpdateClick = async() => {
    // if (!season || !sale || !promptDate) {
    //     alert("Please fill in all the fields before updating.");
    //     return;
    //   }
console.log(date,mode);
      const data = {
        "date": date,
        "automode": mode
    };
     try {
    await pb.collection('dateset').update('ocs73fign0pv1dh', data);
    alert('Updated successfully')


    if(pb.authStore.model !=null){
      const response = await pb.collection('dateset').getFirstListItem(`posted="${pb.authStore.model.expand.reference.id}"`, {
      });
      
         if(response.automode ===true){
          function getCurrentDate() {
            var currentDate = new Date();
          
            var month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
            var day = currentDate.getDate().toString().padStart(2, '0');
            var year = currentDate.getFullYear();
          
            return year+ '-'+month + '-' + day ;
          }
          
          var formattedDate = getCurrentDate();

      localStorage.setItem('date', (formattedDate))
         } else{
          localStorage.setItem('date', (response.date));
         }
    }

  } catch (error) {
    alert('Something wrong')
  }

    // Perform update logic here (you can send the values to an API, etc.)
  };

  const onChange = (checked) => {
    setMode(checked)
  };
  // const [selectedDate, setSelectedDate] = useState(new Date('12/15/2023'));

  // Function to handle date changes
  const handleDateChange = (event) => {
    // const newDate = new Date(event.target.value);
    setDate(event.target.value);
  };

  console.log(mode);
  return (
    
    <div className="page-wrapper">
      <div className="content">
        <div className="card col-md-6">
          <div className="card-header">
            <h5 className="card-title">Update Sale</h5>
          </div>
          <div className="card-body">
            {<span>{mode}</span>}
            <form className action="#">
              <div className="form-group row">
                <label className="col-form-label col-md-2">Date</label>
                <div className="col-md-10">

                <input
                className="form-control form-control-lg"
        type="date"
        id="datePicker"
        value={date} 
        onChange={handleDateChange}
      />
                
                </div>
              </div>
              <div className="form-group row">
                <label className="col-form-label col-md-2">Auto mode</label>
                <div className="col-md-10">
                <Switch checked={mode} onChange={onChange} />
                </div>
              </div>
           
              <button
                type="button"
                className="btn btn-primary mt-3"
                onClick={handleUpdateClick}
              >
                Update
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Saleset;
