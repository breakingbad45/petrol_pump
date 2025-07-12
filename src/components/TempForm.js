import { useEffect, useState ,useRef} from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    changeTransaction,
    createTransaction,
    editInActive
} from "../features/temporary/transactionSlice";
import { ToastContainer } from "react-toastify";
import FormField from "./reuseable/FormField";
import pb from "../utils/pocketbase";
import numberWithCommas from "../utils/numberWithCommas";
import useSWR, { useSWRConfig } from 'swr';
import Swal from "sweetalert2";
import axiosInstance from "../utils/axios";

export default function TempForm() {


  
  const { mutate } = useSWRConfig()
 
  
    const [editMode, setEditMode] = useState(false);
    const [conPayment, setConpayment] = useState("");
    const [balance, setbalance] = useState("");



    const dispatch = useDispatch();
    const { isLoading, isError } = useSelector((state) => state.transaction);
    const { editing } = useSelector((state) => state.transaction) || {};

    const [transactionForm, setTransactionForm] = useState({
        e_date: "",
        ac_id: "Select..",
        payment:"0",
        receive:"0",
        remarks:"CASH",
        sell_type:"TRANSACTION"
      });
      useEffect(() => {
       (async()=>{
        try {
          const response = await axiosInstance.get(`/commondata/fetchSelectedAc.php?id=${transactionForm.ac_id}`);
         
          
          setbalance(numberWithCommas(Number(response.data[0].balance).toFixed(2)))
        } catch (error) {
          
        }
       })()
      }, [transactionForm.ac_id])
      

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
          ac_id: value,
        }));
        inputRefs[1]?.current.focus();
        inputRefs[1]?.current.select();
      };


      const [types, settypes] = useState([]);

      const fetchAc = async () => {
        try {
          const response = await axiosInstance.get("/commondata/getAccounts.php");

          const tempac = response?.data?.filter(actype => actype.type ==="TEMPORARY")
      
       
          const updatedAcarray = tempac?.map((item) => ({
            value: item.id,
            label: item.name,
            address: item.address,
            contact: item.contact,
            actype: item.type,
            balance: item.balance,
          }));
      
          return updatedAcarray;
        } catch (error) {
          console.error("Error:", error);
          return [];
        }
      };

  useEffect(()=>{

    
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

  const [accountsDetails, setAccountsDetails] = useState(null);

  useEffect(() => {

    // Filter the `types` array to find the account that matches `transactionForm.ac_id`
    const newdata = types?.filter((type) => type.value === transactionForm.ac_id);

    // Set the filtered data to the `accountsDetails` state, assuming only one match
    if (newdata?.length > 0) {
      setAccountsDetails(newdata[0]);
    } else {
      setAccountsDetails(null); // Reset if no match
    }
  }, [transactionForm.ac_id, types]); // Ensure `types` is a dependency if it changes


  useEffect(()=>{

    if(Number(transactionForm.payment )!==0){
        setConpayment(numberWithCommas(Number(transactionForm.payment).toFixed(2)))

    } else if(Number(transactionForm.receive )!==0){
        setConpayment(numberWithCommas(Number(transactionForm.receive).toFixed(2)))
    } 
  },[transactionForm.payment,transactionForm.receive])
    // listen for edit mode active
    useEffect(() => {
        const { id,invoice_id,ac_id, payment, receive, remarks,sell_type } = editing || {};
        if (id) {
            setEditMode(true);
            setTransactionForm((prevState) => ({
        ...prevState,
        invoice_id,
        ac_id,
        payment,
        receive,
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
            e_date: "",
            ac_id: "Select..",
            payment: "0",
            receive: "0",
            remarks:"CASH",
            sell_type:"TRANSACTION"
          });
          setConpayment("")
          setacinfo([""])
          inputRefs[0]?.current.focus();
    };


     


  const handleUpdate = async () => {
    try {
      dispatch(
        changeTransaction({
            id: editing?.id,
            data: transactionForm,
            serverDate: ""
        })
    );
   await mutate('transactions');
   
      // Call mutate
     
  
      // Log after mutate to check if it's being called
      // console.log('After mutate in handleUpdate');
  
      setEditMode(false);
      reset();
    } catch (error) {
      console.error('Error in handleUpdate:', error);
    }
  };


    const handleCreate = async(e) => {


      try {
        if (
       
          transactionForm.ac_id === "Select.."
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
          await dispatch(
              createTransaction({
                  data: transactionForm,
                  serverDate: ""
              })
          );
          reset();
        
          // Call mutate
          
         
          // Log after mutate to check if it's being called
          mutate('transactions');
        
    
          reset();
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
            inputRefs[index + 1]?.current.select();
          }
        }
      };

      const [acinfo, setacinfo] = useState([]);



    return (
        <>

<section className="col-lg-7 connectedSortable">
  <div className="box box-danger">
    {/* Tabs within a box */}
    <div className="tab-content no-padding">
      {/* Morris chart - Sales */}
      <div className="box-header header-custom">
        <h3 className="box-title">Account Info</h3>
      </div>
      <div className="form-horizontal" id="fupForm" name="form1" method="post">
        <div className="row box-body">
          <div className="col-md-8 ">
          <FormField
        refs={inputRefs[0]}
        sl={0}
         handleKeyPress={handleKeyPress}
          label="A/C"
          name="ac_name"
          value={transactionForm.ac_id}
          type="select"
          options={types?.map((type) => ({
            value: type.value,
            label: type.label,
            address:type.address,
            contact:type.contact,
            type:type.actype
          }))}
          onChange={(value) => getSelectdata(value, "ac_name",0)}
        />
       
        <FormField
         refs={inputRefs[1]}
         sl={1}
         handleKeyPress={handleKeyPress}
          label="Payment (-)"
          name="payment"
          value={transactionForm.payment}
          type="number"
          onChange={getUserData}
        />
       
        <FormField
          refs={inputRefs[2]}
          sl={2}
         handleKeyPress={handleKeyPress}
          label="Receive (+)"
          name="receive"
          value={transactionForm.receive}
          type="number"
          onChange={getUserData}
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
        <div className="box-footer">

<button className=" btn bg-maroon" onClick={cancelEditMode}>
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
          </div>
   
<div className="col-md-4">
<div className="box-body">

<ul className="list-group list-group-unbordered">
<li className="list-group-item">
    <b>একাউন্টের নাম</b> <a className="pull-right">{accountsDetails?.label}</a>
  </li>
  <li className="list-group-item">
    <b>ঠিকানা </b> <a className="pull-right">{accountsDetails?.address}</a>
  </li>
  <li className="list-group-item">
    <b>মোবাইল নম্বর </b> <a className="pull-right">{accountsDetails?.contact}</a>
  </li>
  <li className="list-group-item">
    <b>একাউন্টের ধরণ</b> <a className="pull-right">{accountsDetails?.actype}</a>
  </li>
  <li className="list-group-item">
    <b>ব্যালান্স  </b> <a className="pull-right">{balance}</a>
  </li>
</ul>





</div>
</div>

        </div></div>
    </div>
  </div></section>
     

    

      <section className="col-lg-5 connectedSortable">
      
      <div className="box box-danger">
        {/* Tabs within a box */}
        <div className="tab-content no-padding">
          {/* Morris chart - Sales */}
          <div className="box-header header-custom">
            <h3 className="box-title">Details Info</h3>
          </div>
          <div className="box-body">

      
          <div className="box-footer no-padding">
    <ul className="nav nav-pills nav-stacked">
      <li><a href="#">মোট প্রদান 
          <span className="pull-right text-red"><i className="fa fa-angle-down" /> 12%</span></a></li>
      <li><a href="#">মোট গ্রহন <span className="pull-right text-green"><i className="fa fa-angle-up" /> 4%</span></a>
      </li>
     
    </ul>
  </div>


   

</div>
        
        </div>
      </div></section>
    
    </>
    );
}
