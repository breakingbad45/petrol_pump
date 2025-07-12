import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  changeAccount,
  createAccount,
  editInActive,
} from "../../features/reading/accountsSlice";
import FormField from "../reuseable/FormField3";
import pb from "../../utils/pocketbase";
import Swal from 'sweetalert2'
import axiosInstance from "../../utils/axios";
import { useSWRConfig } from 'swr'

const AddForm = () => {
  const { mutate } = useSWRConfig()
  const fuser = localStorage.getItem('user');
  const user =JSON.parse(fuser)
  
   const [formData, setFormData] = useState({
    machine_name: "Select...",
    start_reading: 0,
    end_reading: 0,
    rate: 0,
    operator: "",
    posted: user.username
  });
  console.log(formData);

//   const [formData, setformData] = useState({
//     name: "",
//     proprietor: "",
//     address: "",
//     contact: "",
//     type: "Select...",
//     posted:user.username
//   });
  const [optionSelected, setOptionSelected] = useState({
    value: "",
    label: "Select...",
  });

  const [editMode, setEditMode] = useState(false);

  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.account);
  const { editing } = useSelector((state) => state.account) || {};

  const getUserData = (event) => {
    event.preventDefault();
    const name = event.target.name;
    const value = event.target.value;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const getSelectdata = (value) => {
    setFormData((prevState) => ({
      ...prevState,
      machine_name: value,
    }));
  };

  // listen for edit mode active
  useEffect(() => {
    const { id, machine_name, start_reading, end_reading, rate, operator } = editing || {};
    console.log(editing);
    
    if (id) {
      setEditMode(true);
      setFormData((prevState) => ({
        ...prevState,
        machine_name,
        start_reading,
        end_reading,
        rate,
        operator,
      }));

      setOptionSelected({
        ...optionSelected,
        value: machine_name,
        label: machine_name,
      });
    } else {
      setEditMode(false);
      reset();
      // dispatch(editInActive)
    }
  }, [editing]);
  // console.log(formData);
  const [types, settypes] = useState([]);

  const fetchTypes = async () => {
    try {
      const response = await axiosInstance.get("/commondata/getTypes.php");
      const updatedFactoryarray = response?.data?.map((item) => ({
        value: item.id,
        label: item.subtype,
      }));
      console.log(updatedFactoryarray);
      settypes(updatedFactoryarray)
    } catch (error) {
      console.error("Error:", error);
      return [];
    }
  };
  const [address, setaddress] = useState([]);

  const fetchAddress = async () => {
    try {
      const response = await axiosInstance.get("/commondata/getAddress.php");
      const updatedFactoryarray = response?.data?.map((item) => ({
        value: item.id,
        label: item.subtype,
      }));
      console.log(updatedFactoryarray);
      setaddress(updatedFactoryarray)
    } catch (error) {
      console.error("Error:", error);
      return [];
    }
  };
  useEffect(()=>{
    fetchTypes()
    fetchAddress()
  },[])
 
  const reset = () => {
    setFormData({
     machine_name: "Select...",
    start_reading: 0,
    end_reading: 0,
    rate: 0,
    operator: "",
    posted: user.username
    });
  };

//  console.log(formData);
  const handleCreate = async () => {
    try {
      if (
        formData.machine_name === "Select..." ||
        formData.start_reading === "" ||
        formData.end_reading === "" 
      ) {
        // Show an alert for incomplete fields
        Swal.fire({
          position: "center",
          icon: "warning",
          title: "Please fill up all the data",
          showConfirmButton: false,
          timer: 1500
        });
      } else {
        // All fields are filled, dispatch the action
        await dispatch(createAccount(formData));
      
        // Call mutate
        await mutate('fetchcatalog');
        console.log('After mutate');
       
        // Log after mutate to check if it's being called
      
  
        reset();
      }
    } catch (error) {
      console.error('Error in handleCreate:', error);
    }
  };
  

  const handleUpdate = async () => {
    try {
      await dispatch(
        changeAccount({
          id: editing?.id,
          data: formData,
        })
      );
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Task completed..!",
        showConfirmButton: false,
        timer: 1500
      });
      // Call mutate
      await mutate('fetchcatalog');
  
      // Log after mutate to check if it's being called
      console.log('After mutate in handleUpdate');
  
      setEditMode(false);
      reset();
    } catch (error) {
      console.error('Error in handleUpdate:', error);
    }
  };
  
const machines = [
  { value: "M1-PETROL", label: "M1-PETROL" },
  { value: "M2-DIESEL", label: "M2-DIESEL" },
  { value: "M3-PETROL", label: "M3-PETROL" },
  { value: "M4-OCTANE", label: "M4-OCTANE" },
  { value: "M5-LPG", label: "M5-LPG" }
];
  const handleKeyPress = (event, index,value) => {
    const currentElement = document.activeElement;
    if (event.target.value !=="" && event.key === 'Enter' &&
    currentElement.getAttribute('aria-haspopup') !== 'listbox' ) {

      if(index===8){
        // cartRef.current.focus();
      }else{
        
        event.preventDefault(); // Prevent the default Enter key behavior
        // inputRefs[index + 1]?.current.focus(); // Move focus to the next input
      }
    }
  };
  const cancelEditMode = () => {
    reset();
    setEditMode(false);
  };
  useEffect(() => {
    dispatch(editInActive());
  }, []);
 
  return (
 

    <>
    
 

    <section className="col-lg-3 connectedSortable">
  <div className="box box-danger">
    {/* Tabs within a box */}
    <div className="tab-content no-padding">
      {/* Morris chart - Sales */}
      <div className="box-header header-custom">
        <h3 className="box-title">Reading Info</h3>
      </div>
      <form className="form-horizontal" id="fupForm" name="form1" method="post">
        <div className="box-body">
            <FormField
             handleKeyPress={handleKeyPress}
              label="Machine"
              name="machine_name"
              type="select"
              value={formData.machine_name}
              options={machines}
              onChange={getSelectdata}
            />
            <FormField
             handleKeyPress={handleKeyPress}
              label="Start Reading"
              name="start_reading"
              type="number"
              value={formData.start_reading}
              onChange={getUserData}
            />
            <FormField
             handleKeyPress={handleKeyPress}
              label="End Reading"
              name="end_reading"
              type="number"
              value={formData.end_reading}
              onChange={getUserData}
            />
            <FormField
             handleKeyPress={handleKeyPress}
              label="Rate"
              name="rate"
              type="number"
              value={formData.rate}
              onChange={getUserData}
            />
            <FormField
             handleKeyPress={handleKeyPress}
              label="Operator"
              name="operator"
              type="text"
              value={formData.operator}
              onChange={getUserData}
            />
          </div></form>

              <div className="box-footer">

          <button className=" btn bg-maroon" onClick={cancelEditMode}>
          Cancel
        </button>
        <button
          disabled={isLoading}
          onClick={editMode ? handleUpdate : handleCreate}
          type="submit"
          className=" btn bg-navy   pull-right"
        >
          {editMode ? "Update " : "Add "}
        </button>
               </div>
    </div>
  </div></section>

    </>
  );
};

export default AddForm;
