import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  changeAccount,
  createAccount,
  editInActive,
} from "../../features/products/productsSlice";
import FormField from "../reuseable/FormField";

import Swal from 'sweetalert2'
import axiosInstance from "../../utils/axios";
import { useSWRConfig } from 'swr'

const AddForm = () => {
  const { mutate } = useSWRConfig()

  const [productsForm, setProductsForm] = useState({
    name: "",
    brand: "Select...",
    category: "Select...",
    unit_1: "",
    unit_2: "",
    rate: "",
  });
  const [optionSelected, setOptionSelected] = useState({
    value: "",
    label: "Select...",
  });
  const [optionSelected2, setOptionSelected2] = useState({
    value: "",
    label: "Select...",
  });

  const [editMode, setEditMode] = useState(false);

  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.product);
  const { editing } = useSelector((state) => state.product) || {};

  const getUserData = (event) => {
    event.preventDefault();
    const name = event.target.name;
    const value = event.target.value;
    setProductsForm((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const getSelectdata = (value) => {
    setProductsForm((prevState) => ({
      ...prevState,
      brand: value,
    }));
  };
  const getSelectdata2 = (value) => {
    setProductsForm((prevState) => ({
      ...prevState,
      category: value,
    }));
  };

  // listen for edit mode active
  useEffect(() => {
    const { id, name, brand, brand_name,category,category_name, unit_1, unit_2,  rate } = editing || {};
    
    if (id) {
      setEditMode(true);
      setProductsForm((prevState) => ({
        ...prevState,
        name,
        brand,
        category,
        unit_1,
        unit_2,
        rate
      }));

      setOptionSelected({
        ...optionSelected,
        value: brand,
        label: brand_name,
      });
      setOptionSelected2({
        ...optionSelected,
        value: category,
        label: category_name,
      });
    } else {
      setEditMode(false);
      reset();
      // dispatch(editInActive)
    }
  }, [editing]);
  // console.log(productsForm);
  const [brands, setBrands] = useState([]);
  const [category, setCategory] = useState([]);

  const fetchBrands = async () => {
    try {
      const response = await axiosInstance.get("/commondata/getBrand.php");
      const updatedFactoryarray = response?.data?.map((item) => ({
        value: item.id,
        label: item.name,
      }));
      console.log(updatedFactoryarray);
      setBrands(updatedFactoryarray)
    } catch (error) {
      console.error("Error:", error);
      return [];
    }
  };
  
  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get("/commondata/getCategory.php");
      const updatedFactoryarray = response?.data?.map((item) => ({
        value: item.id,
        label: item.name,
      }));
      console.log(updatedFactoryarray);
      setCategory(updatedFactoryarray)
    } catch (error) {
      console.error("Error:", error);
      return [];
    }
  };
  useEffect(()=>{
    fetchBrands()
    fetchCategories()
  },[])
 
  const reset = () => {
    setProductsForm({
      name: "",
      brand: "",
      category: "",
      unit_1: "",
      unit_2: "",
        rate: "",
    });
  };

//  console.log(productsForm);
  const handleCreate = async () => {
    try {
      if (
        productsForm.name === "" ||
        productsForm.proprietor === "" ||
        productsForm.address === "" ||
        productsForm.contact === "" ||
        productsForm.type === "Select..."
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
        await dispatch(createAccount(productsForm));
      
        // Call mutate
        await mutate('fetchproducts');
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
          data: productsForm,
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
      await mutate('fetchproducts');
  
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
        <h3 className="box-title">Product Info</h3>
      </div>
      <form className="form-horizontal" id="fupForm" name="form1" method="post">
        <div className="box-body">
          <div className="box-body">
          <FormField
          handleKeyPress={handleKeyPress}
          label="Name"
          name="name"
          value={productsForm.name}
          type="text"
          onChange={getUserData}
        />
        <FormField
         handleKeyPress={handleKeyPress}
          label="brand"
          name="brand"
          value={productsForm.brand}
          type="select"
          options={brands.map((type) => ({
            value: type.value,
            label: type.label,
          }))}
          onChange={getSelectdata}
        />
        <FormField
         handleKeyPress={handleKeyPress}
          label="category"
          name="category"
          value={productsForm.category}
          type="select"
          options={category.map((type) => ({
            value: type.value,
            label: type.label,
          }))}
          onChange={getSelectdata2}
        />
        <FormField
         handleKeyPress={handleKeyPress}
          label="unit_1"
          name="unit_1"
          value={productsForm.unit_1}
          type="number"
          onChange={getUserData}
        />
         <FormField
         handleKeyPress={handleKeyPress}
          label="unit_2"
          name="unit_2"
          value={productsForm.unit_2}
          type="number"
          onChange={getUserData}
        />
        <FormField
         handleKeyPress={handleKeyPress}
          label="rate"
          name="rate"
          value={productsForm.rate}
          type="number"
          onChange={getUserData}
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
