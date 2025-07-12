import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  changeAccount,
  createAccount,
  editInActive,
} from "../../features/accounts/accountsSlice";
import FormField from "../reuseable/FormField";
import pb from "../../utils/pocketbase";
import Swal from 'sweetalert2'
import axiosInstance from "../../utils/axios";
import { useSWRConfig } from 'swr'

const AddForm = () => {
  const { mutate } = useSWRConfig()
  const fuser = localStorage.getItem('user');
  const user =JSON.parse(fuser)
  
  const [accountsForm, setAccountsForm] = useState({
    name: "",
    proprietor: "",
    address: "",
    contact: "",
    type: "Select...",
    posted:user.username
  });
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
    setAccountsForm((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const getSelectdata = (value) => {
    setAccountsForm((prevState) => ({
      ...prevState,
      type: value,
    }));
  };

  // listen for edit mode active
  useEffect(() => {
    const { id, name, proprietor, address, contact, type } = editing || {};
    
    if (id) {
      setEditMode(true);
      setAccountsForm((prevState) => ({
        ...prevState,
        name,
        proprietor,
        address,
        contact,
        type,
      }));

      setOptionSelected({
        ...optionSelected,
        value: type,
        label: type,
      });
    } else {
      setEditMode(false);
      reset();
      // dispatch(editInActive)
    }
  }, [editing]);
  // console.log(accountsForm);
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
    setAccountsForm({
      name: "",
      proprietor: "",
      address: "",
      contact: "",
      type: "Select...",
      posted:user.username
    });
  };

//  console.log(accountsForm);
  const handleCreate = async () => {
    try {
      if (
        accountsForm.name === "" ||
        accountsForm.proprietor === "" ||
        accountsForm.address === "" ||
        accountsForm.contact === "" ||
        accountsForm.type === "Select..."
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
        await dispatch(createAccount(accountsForm));
      
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
          data: accountsForm,
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
    
 

    <section className="col-lg-4 connectedSortable">
  <div className="box box-danger">
    {/* Tabs within a box */}
    <div className="tab-content no-padding">
      {/* Morris chart - Sales */}
      <div className="box-header header-custom">
        <h3 className="box-title">Account Info</h3>
      </div>
      <form className="form-horizontal" id="fupForm" name="form1" method="post">
        <div className="box-body">
          <div className="box-body">
          <FormField
          handleKeyPress={handleKeyPress}
          label="Name"
          name="name"
          value={accountsForm.name}
          type="text"
          onChange={getUserData}
        />
        <FormField
         handleKeyPress={handleKeyPress}
          label="Proprietor"
          name="proprietor"
          value={accountsForm.proprietor}
          type="text"
          onChange={getUserData}
        />
        <FormField
         handleKeyPress={handleKeyPress}
          label="Address"
          name="address"
          value={accountsForm.address}
          type="text"
          onChange={getUserData}
        />
        <FormField
         handleKeyPress={handleKeyPress}
          label="Contact"
          name="contact"
          value={accountsForm.contact}
          type="text"
          onChange={getUserData}
        />
        <FormField
         handleKeyPress={handleKeyPress}
          label="Type"
          name="type"
          value={accountsForm.type}
          type="select"
          options={types.map((type) => ({
            value: type.value,
            label: type.label,
          }))}
          onChange={getSelectdata}
        />
          </div>
          {/* /.box-body */}
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
          {/* /.box-footer */}
        </div></form>
    </div>
  </div></section>

    </>
  );
};

export default AddForm;
