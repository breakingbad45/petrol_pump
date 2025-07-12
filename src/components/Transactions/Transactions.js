import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTransactions } from "../../features/transaction/transactionSlice";
import { getTransactions } from "../../features/transaction/transactionAPI";
import Transaction from "./Transaction";
import DataTable from "../reuseable/DataTable";
import Swal from "sweetalert2";
import numberWithCommas from "../../utils/numberWithCommas";
import ReceiptViewer from "../ledger/RecceiptViewer";
// import MemoViewer from "../ledger/MemoViewer";
import {
    editActive,
    removeTransaction,
} from "../../features/transaction/transactionSlice";
import useSWR, { useSWRConfig } from 'swr'
import Loader from "../../reuseable/Loader";
export default function Transactions() {
  
  const { mutate } = useSWRConfig()
  const serverDate = ""
  const { data: transactionData, isLoading: tranLoading } = useSWR(
    "transactions",
    () => getTransactions(), // Pass a function that SWR can call
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
  
// console.log(transactionData);
    const dispatch = useDispatch();

    // const { transactions, isLoading, isError } = useSelector(
    //     (state) => state.transaction
    // );

    // useEffect(() => {
    //     dispatch(fetchTransactions(serverDate));
    // }, [dispatch]);
    const handleEdit = (transaction) => {
        dispatch(editActive(transaction));
    };

    const handleDelete = async (id) => {
      // showModal()
    
      try {
        // Dispatch the action to remove the account
        await  dispatch(removeTransaction({
          id:id
      }));
    
        // Call mutate
        mutate('transactions');
    
        // Log after mutate to check if it's being called
        console.log('After mutate in handleDelete');
      } catch (error) {
        console.error('Error in handleDelete:', error);
      }
    };


    // decide what to render




    function convertDateFormat(inputDate) {
      // Split the input date into year, month, and day
      var dateComponents = inputDate.split('-');
      
      // Rearrange the components to the "mm/dd/yyyy" format
      var outputDate = dateComponents[1] + '/' + dateComponents[2] + '/' + dateComponents[0];
      
      return outputDate;
    }

const tbl_data = transactionData?.map((item,i)=> ({
    sl:i+1,
    id: item.id,
    invoice_id: item.inv_id,
    date: item.e_date,
    ac_id: item.ac_id,
    ac_name: item.ac_name,
    type: item.subtype,
    payment:item.payment,
    receive:item.receive,
    payment_v: numberWithCommas(parseInt(item.payment)),
    receive_v: numberWithCommas(parseInt(item.receive)),
    remarks: item.remarks,
    posted: item.posted,
  }));
  
  
    const columns = [
      {
        Header: 'SL',
        accessor: 'sl',
      },
      {
        Header: 'TId',
        accessor: 'invoice_id',
      },
      {
        Header: 'Date',
        accessor: 'date',
      },
      {
        Header: 'A/C',
        Cell: ({ row }) => (
  

          <>
  
  <div style={{display:'flex',flexDirection:'row',justifyContent:'start'}}>
<icon style={{border:'1px solid black', borderRadius:'50%',padding:'5px', width:'25px'}} className={row.original.type !='BANK'?'fa fa-user' :'fa fa-bank'} alt=""/>
<span>{row.original.ac_name}</span> 
</div>
             </>
          ),
      },
      {
        Header: 'Type',
        Cell: ({ row }) => (
  

          <>
  <span style={{textAlign:'center'}} >{row.original.type}</span>
             </>
          ),
      },
     
      {
        Header: 'Payment',
        Cell: ({ row }) => (
  

          <>
  
  <div style={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
{row.original.payment!=0?<span style={{color:'red',fontWeight:'bold'}}>(-) </span>:<span></span>}
<span>{row.original.payment!=0?row.original.payment:''}</span> 
</div>
             </>
          ),
      },
       {
        Header: 'Receive',
        Cell: ({ row }) => (
  

          <>
  
  <div style={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
  {row.original.receive!=0?<span style={{color:'green',fontWeight:'bold'}}>(+) </span>:<span></span>}
<span>{row.original.receive!=0?row.original.receive:''}</span> 
</div>
             </>
          ),
      },
      {
        Header: 'Remarks',
        Cell: ({ row }) => (
  

          <>
  <span style={{textAlign:'center',color:'blue'}} >{row.original.remarks}</span>
             </>
          ),
      
      },
     
      {
        Header: 'Posted',
        Cell: ({ row }) => (
  

          <>
  <span style={{textAlign:'center'}} class="label label-danger">{row.original.posted}</span>
             </>
          ),
      },
   
      {
        Header: 'ACTION',
        Cell: ({ row }) => (
  

        <>

<div>
  {/* Single button */}
  <div className="btn-group">
  <ReceiptViewer data={row.original.id}/>
   </div>
  <div className="btn-group">
    <button type="button" data-toggle="modal" data-target="#editBrandModel" onClick={()=>handleEdit(row.original)} className="btn btn-success  btn-xs"><i className="fa fa-eye " /></button>
  </div>
  <div className="btn-group">
    <button type="button" data-toggle="modal" data-target="#removeMemberModal"  onClick={() => 
                
                Swal.fire({
                  title: "Are you sure?",
                  showCancelButton: true,
                  confirmButtonText: "Yes",
                }).then((result) => {
                  /* Read more about isConfirmed, isDenied below */
                  if (result.isConfirmed) {
                    
                handleDelete(row.original.id)
                    Swal.fire("Deleted Successfully!", "", "success");
                  } 
                })
                } className="btn btn-danger btn-xs"><i className="fa fa-close" /></button>
  </div>
</div>
           </>
        ),
      },
      // Add more columns as needed
    ];
    let content = null;

    if ( tranLoading) {
      content =<>
      <div style={{minHeight:'450px'}}>
    <Loader/>
    </div>
    </>;;
  }

    if ( transactionData?.length > 0) {
        content =  <DataTable columns={columns} data={tbl_data} />
  }
    

    if ( transactionData?.length === 0) {
        content = <>
        <div style={{minHeight:'450px'}}>
  <p>No transaction Found !!</p>
      </div>
      </>;
    }


    return (
        <>
     
     <section className="col-lg-12 connectedSortable">
      
      <div className="box box-danger">
        {/* Tabs within a box */}
        <div className="tab-content no-padding">
          {/* Morris chart - Sales */}
          <div className="box-header header-custom">
            <h3 className="box-title">Details Info</h3>
          </div>
         
          {content}
        </div>
      </div></section>
        </>
    );
}
