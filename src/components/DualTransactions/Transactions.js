import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTransactions } from "../../features/dualtransaction/transactionSlice";
import { getTransactions } from "../../features/dualtransaction/transactionAPI";
import Transaction from "./Transaction";
import DataTable from "../reuseable/DataTable";
import Swal from "sweetalert2";
import numberWithCommas from "../../utils/numberWithCommas";
import MemoViewer from "../ledger/MemoViewer";
import {
    editActive,
    removeTransaction,
} from "../../features/dualtransaction/transactionSlice";
import useSWR, { useSWRConfig } from 'swr'
import Loader from "../../reuseable/Loader";

export default function Transactions() {
  
  const { mutate } = useSWRConfig()
  const serverDate = localStorage.getItem('date');
  const { data: dualtransactionData, isLoading: stranLoading } = useSWR(
    "dualtransactions",
    () => getTransactions(serverDate), // Pass a function that SWR can call
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
  
//  console.log(dualtransactionData);
    const dispatch = useDispatch();


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
          id:id,
          serverDate: serverDate
      }));
    
        // Call mutate
        mutate('dualtransactions');
    
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
console.log(dualtransactionData);
const tbl_data = dualtransactionData?.map((item,i)=> ({
    sl:i+1,
    invoice_id: item.inv_id,
    date: item.e_date,
    rec_id: item.rec_id,
    rec_name: item.rec_name,
    pay_id: item.pay_id,
    pay_name: item.pay_name,
    amount : item.amount,
    remarks : item.remarks,
    p_id : item.p_id,
    r_id : item.r_id,
    posted : item.posted,
    
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
        Header: 'RECEIVE A/C',
        accessor: 'rec_name',
      },
      {
        Header: 'PAYMENT A/C',
        accessor: 'pay_name',
      },
      {
        Header: 'AMOUNT',
        accessor: 'amount',
      },
      {
        Header: 'REMARKS',
        Cell: ({ row }) => (
  

          <>
  <span style={{textAlign:'center',color:'blue'}} >{row.original.remarks}</span>
             </>
          ),
      
      },
     
      {
        Header: 'POSTED',
        accessor: 'posted',
      },
     
     
     
   
      {
        Header: 'ACTION',
        Cell: ({ row }) => (
  

         <>

<div>
  {/* Single button */}
  <div className="btn-group">
  {/* <MemoViewer props={row.original}/>  */}
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
                    
                handleDelete(row.original.invoice_id)
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

    if ( stranLoading) {
      content =<>
        <div style={{minHeight:'450px'}}>
      <Loader/>
      </div>
      </>;
  }
    if ( dualtransactionData?.length > 0) {
        content =  <DataTable columns={columns} data={tbl_data} />
  }
    

    if ( dualtransactionData?.length === 0) {
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
