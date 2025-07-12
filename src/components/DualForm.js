import { useEffect, useState ,useRef} from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    changeTransaction,
    createTransaction,
    editInActive
} from "../features/dualtransaction/transactionSlice";
import { ToastContainer } from "react-toastify";
import FormField from "./reuseable/FormField";
import pb from "../utils/pocketbase";
import numberWithCommas from "../utils/numberWithCommas";
import useSWR, { useSWRConfig } from 'swr';
import Swal from "sweetalert2";
import axiosInstance from "../utils/axios";
export default function DualForm() {
  
  const { mutate } = useSWRConfig()
 
  

  const serverDate = localStorage.getItem('date');

  const currentTimestamp = new Date();
  const newTimestamp = new Date(currentTimestamp.getTime() + 6 * 60 * 60 * 1000);
  
  // Format the new timestamp as a string in the desired format
  const formattedTimestamp = newTimestamp.toISOString();
  
  
  // Given strings
  const string1 = formattedTimestamp ;
  const string2 = serverDate;
  
  // Extracting date and time components
  const datePart = string2;
  const timePart = string1.slice(11, 23);
  
  // Creating string3 by combining date and time
  const formatedate = `${datePart}T${timePart}Z`;
 
    const [editMode, setEditMode] = useState(false);
    const [conPayment, setConpayment] = useState("");



    const dispatch = useDispatch();
    const { isLoading, isError } = useSelector((state) => state.transaction);
    const { editing } = useSelector((state) => state.dualtransaction) || {};

    const [transactionForm, setTransactionForm] = useState({
        e_date: serverDate,
        rec_id: "Select..",
        amount:"0",
        pay_id: "Select..",
        remarks:"CASH",
        sell_type:"DUALTRANSACTION"
      });


      const getUserData = (event) => {
        event.preventDefault();
        const name = event.target.name;
        const value = event.target.value;
        setTransactionForm((prevState) => ({
          ...prevState,
          [name]: value,
        }));
      };
      const getSelectdata = (value,sl) => {
        setTransactionForm((prevState) => ({
          ...prevState,
          rec_id: value,
        }));
        inputRefs[1]?.current.focus();
        inputRefs[1]?.current.select();
      };
      const getSelectdata2 = (value,sl) => {
        setTransactionForm((prevState) => ({
          ...prevState,
          pay_id: value,
        }));
        inputRefs[3]?.current.focus();
        inputRefs[3]?.current.select();
      };



      const [types, settypes] = useState([]);
      const fetchAc = async () => {
        try {
          const response = await axiosInstance.get("/commondata/getAccounts.php");
      
          const updatedAcarray = response?.data?.map((item) => ({
            value: item.id,
            label: item.name,
            address: item.address,
            contact: item.contact,
            actype: item.type,
          }));
      
          return updatedAcarray;
        } catch (error) {
          console.error("Error:", error);
          return [];
        }
      };
  useEffect(()=>{
    mutate("dualtransactions");
(async()=>{
//   const records = await pb.collection('Eligibility').getFullList({
//     sort: '-created',
// });
// localStorage.setItem('sale', JSON.stringify(records));
const acData = await fetchAc();
settypes(acData)
})()
return () => {
  dispatch(editInActive())
}

  },[])

  

  useEffect(()=>{

    if(Number(transactionForm.amount )!==0){
        setConpayment(numberWithCommas(Number(transactionForm.amount).toFixed(2)))

    } else if(Number(transactionForm.amount )!==0){
        setConpayment(numberWithCommas(Number(transactionForm.amount).toFixed(2)))
    } 
  },[transactionForm.amount])
    // listen for edit mode active

 
    useEffect(() => {
        const {invoice_id,pay_id, rec_id, amount, remarks,sell_type } = editing || {};
        if (invoice_id) {
            setEditMode(true);
            setTransactionForm((prevState) => ({
        ...prevState,
        invoice_id,
       pay_id,
       rec_id,amount,
        remarks,
        sell_type
      }));

     
        } else {
            setEditMode(false);
            reset();
        }
    }, [editing]);

    const reset = () => {
        setTransactionForm({
            e_date: serverDate,
            rec_id: "Select..",
            amount:"0",
            pay_id: "Select..",
            remarks:"CASH",
            sell_type:"DUALTRANSACTION"
          });
          setConpayment("")
          setacinfo([""])
          inputRefs[0]?.current.focus(); 
    };


     


  const handleUpdate = async () => {
    try {
      await dispatch(
        changeTransaction({
            id: editing?.id,
            p_id: editing?.p_id,
            r_id: editing?.r_id,
            data: transactionForm,
            serverDate: serverDate
        })
    );
     // Call mutate
     await mutate('dualtransactions');
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Task completed..!",
        showConfirmButton: false,
        timer: 1500
      });
    
    
      // Log after mutate to check if it's being called
 
      setEditMode(false);
      reset();
      
    } catch (error) {
      console.error('Error in handleUpdate:', error);
    }
  };


    const handleCreate = async(e) => {
e.preventDefault()

      try {
        if (
       
          transactionForm.rec_id === "Select..." ||
          transactionForm.pay_id === "Select..." ||
          transactionForm.amount === "0" 

        ) {
          // Show an alert for incomplete fields
          Swal.fire({
            position: "center",
            icon: "warning",
            title: "Please fill up all the data",
            showConfirmButton: false,
            timer: 1500
          });
          inputRefs[0]?.current.focus(); 
        } else {
       
          // All fields are filled, dispatch the action
          await dispatch(
              createTransaction({
                  data: transactionForm,
                  serverDate: serverDate
              })
          );
          reset();
        
          // Call mutate
          
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Task completed..!",
            showConfirmButton: false,
            timer: 1500
          });
          // Log after mutate to check if it's being called
          await mutate('dualtransactions');
          console.log('After mutate');
    
          reset();
          inputRefs[0]?.current.focus(); 
        }
      } catch (error) {
        console.error('Error in handleCreate:', error);
      }
       
    };
    // const handleUpdate = (e) => {
    //     e.preventDefault();
    //     dispatch(
    //         changeTransaction({
    //             id: editing?.id,
    //             data: transactionForm,
    //             serverDate: serverDate
    //         })
    //     );
    //     setEditMode(false);
    //     reset();
    // };

    const cancelEditMode = () => {
        reset();
        setEditMode(false);
        
    };
    const cartRef = useRef(null);
    const inputRefs = [
      useRef(null),
      useRef(null),
      useRef(null),
      useRef(null),
      useRef(null)
    ];
  
    const handleKeyPress = (event, index,value) => {
      const currentElement = document.activeElement;
      if (event.target.value !=="" && event.key === 'Enter' &&
      currentElement.getAttribute('aria-haspopup') !== 'listbox' ) {
  
        if(index===3){
           cartRef.current.focus();
        }else{
          
          event.preventDefault(); // Prevent the default Enter key behavior
          inputRefs[index + 1]?.current.focus(); // Move focus to the next input
          // inputRefs[index + 1]?.current.select();
        }
      }
    };
  

      const [acinfo, setacinfo] = useState([]);
      const [acinfo1, setacinfo1] = useState([]);
      const [acinfo2, setacinfo2] = useState([]);

      useEffect(() => {
        (async()=>{
         try {
           const response = await axiosInstance.get(`/commondata/fetchSelectedAc.php?id=${transactionForm.rec_id}`);
           setacinfo1(response.data[0]);
           const response2 = await axiosInstance.get(`/commondata/fetchSelectedAc.php?id=${transactionForm.pay_id}`);
           setacinfo2(response2.data[0]);
         } catch (error) {
           
         }
        })()
       }, [transactionForm.pay_id,transactionForm.rec_id,])

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
      <div className="form-horizontal" >
        <div className="box-body">
          <div className="box-body">
          <FormField
        refs={inputRefs[0]}
        sl={0}
         handleKeyPress={handleKeyPress}
          label="Receive A/C (+)"
          name="rec_id"
          value={transactionForm.rec_id}
          type="select"
          options={types.map((type) => ({
            value: type.value,
            label: type.label,
            address: type.label,
            contact: type.contact,
            type: type.actype,
          }))}
          onChange={(value) => getSelectdata(value, "rec_id",0)}
        />
       
        <FormField
         refs={inputRefs[1]}
         sl={1}
         handleKeyPress={handleKeyPress}
          label="Amount"
          name="amount"
          value={transactionForm.amount}
          type="number"
          onChange={getUserData}
        />       
       <FormField
        refs={inputRefs[2]}
        sl={2}
         handleKeyPress={handleKeyPress}
          label="Payment A/C (-)"
          name="pay_id"
          value={transactionForm.pay_id}
          type="select"
          options={types.map((type) => ({
            value: type.value,
            label: type.label,
            address: type.label,
            contact: type.contact,
            type: type.actype,
          }))}
          onChange={(value) => getSelectdata2(value, "pay_id",2)}
        />
        <FormField
          refs={inputRefs[3]}
          sl={3}
         handleKeyPress={handleKeyPress}
          label="Remarks"
          name="remarks"
          value={transactionForm.remarks}
          type="text"
          onChange={getUserData}
        />
        <span>Amount : {conPayment}</span>
          </div>
          {/* /.box-body */}
          <div className="box-footer">

          <button className=" btn bg-maroon"  onClick={cancelEditMode}>
          Cancel
        </button>
        <button
  disabled={isLoading}
  ref={cartRef}
  onClick={editMode ? handleUpdate : handleCreate}
  type="submit"
  className="btn bg-navy pull-right"
>
  {isLoading ? (
    <div className=""><span className="loader1"></span> <span>Loading...</span></div> // Assuming you have a loader component or CSS
  ) : (
    <>
      {editMode ? "Update" : "Add"}
    </>
  )}
</button>
               </div>
          {/* /.box-footer */}
        </div></div>
    </div>
  </div></section>
     
   
  <section className="col-lg-8 connectedSortable">
      
      <div className="box box-danger">
        {/* Tabs within a box */}
        <div className="tab-content no-padding">
          {/* Morris chart - Sales */}
          <div className="box-header header-custom">
            <h3 className="box-title">Details Info</h3>
          </div>
          <div className="box-body">

      
<div className="d-flex">
  
<div class="row">
  <div class="col-md-6">
    <div class="box-body">
    <p style={{fontSize:18,fontWeight:'bold'}}>Receive from</p>
      <ul class="list-group list-group-unbordered">
        <li class="list-group-item"><b>একাউন্টের নাম</b> <a class="pull-right" style={{color:'green',fontWeight:'bold'}}>{acinfo1?.name}</a></li>
        <li class="list-group-item"><b>ঠিকানা </b> <a class="pull-right " style={{color:'green',fontWeight:'bold'}}>{acinfo1?.address}</a></li>
        <li class="list-group-item"><b>মোবাইল নম্বর </b> <a class="pull-right " style={{color:'green',fontWeight:'bold'}}>{acinfo1?.contact}</a></li>
        <li class="list-group-item"><b>একাউন্টের ধরণ</b> <a class="pull-right " style={{color:'green',fontWeight:'bold'}}>{acinfo1?.type}</a></li>
        <li class="list-group-item"><b>ব্যালান্স  </b> <a class="pull-right " style={{color:'green',fontWeight:'bold'}}>{numberWithCommas(Number(acinfo1?.balance).toFixed(2))}</a></li>
      </ul>
    </div>
  </div>
  <div class="col-md-6">
    <div class="box-body">
    <p style={{fontSize:18,fontWeight:'bold'}}>Payment to</p>

      <ul class="list-group list-group-unbordered">
      <li class="list-group-item"><b>একাউন্টের নাম</b> <a class="pull-right " style={{color:'red',fontWeight:'bold'}}>{acinfo2?.name}</a></li>
        <li class="list-group-item"><b>ঠিকানা </b> <a class="pull-right " style={{color:'red',fontWeight:'bold'}}>{acinfo2?.address}</a></li>
        <li class="list-group-item"><b>মোবাইল নম্বর </b> <a class="pull-right " style={{color:'red',fontWeight:'bold'}}>{acinfo2?.contact}</a></li>
        <li class="list-group-item"><b>একাউন্টের ধরণ</b> <a class="pull-right " style={{color:'red',fontWeight:'bold'}}>{acinfo2?.type}</a></li>
        <li class="list-group-item"><b>ব্যালান্স  </b> <a class="pull-right " style={{color:'red',fontWeight:'bold'}}>{numberWithCommas(Number(acinfo2?.balance).toFixed(2))}</a></li>
      </ul>
    </div>
  </div>
</div>

</div>
</div>
        
        </div>
      </div></section>
    
    </>
    );
}
