import { useDispatch } from "react-redux";
import { selectedData,editActive,removeInvoice } from "../../features/inventory/inventorySlice";
import React from 'react'
import DataTable from '../reuseable/DataTable'
import Swal from "sweetalert2";
import {Modal } from 'antd';
import InvoiceViewer from "../ledger/InvoiceViewer";
import numberWithCommas from "../../utils/numberWithCommas";
import useSWR,{mutate} from 'swr'
import {getCatalogue} from "../../features/inventory/inventoryAPI"

const ViewList = () => {

  const dispatch = useDispatch();


  const { data: fetchinvData, isLoading: fetchloading } = useSWR(
    "fetchinvdata",
    getCatalogue,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  // console.log(fetchinvData);

  // useEffect(() => {
  //   dispatch(fetchCatalogue());
  // }, [dispatch]);

  const handleEdit = (data) => {
    dispatch(editActive(data));
    dispatch(selectedData(data))
};

const handleDelete = async(id) => {
try {
  await dispatch(removeInvoice({id}));
  mutate('fetchinvdata');
} catch (error) {
  
}
};
function convertDateFormat(inputDate) {
  // Split the input date into year, month, and day
  var dateComponents = inputDate.split('-');
  
  // Rearrange the components to the "mm/dd/yyyy" format
  var outputDate = dateComponents[1] + '/' + dateComponents[2] + '/' + dateComponents[0];
  
  return outputDate;
}



const filter_data = fetchinvData?.filter(cat => cat.sell_type === "SELL" || cat.sell_type === "PUR");

const tbl_data = fetchinvData?.map((item,i)=> ({
  sl:i+1,
  invoice_id: item.inv_id,
  date: item.e_date,
  ac_name: item.name,
  totalitems: item.total_pr,
  totaltk_v:numberWithCommas(item.total_tk),
  selltype:item.sell_type,
  posted:item.posted,
}));


  const columns = [
    {
      Header: 'SL',
      accessor: 'sl',
    },
    {
      Header: 'Date',
      accessor: 'date',
    },
    {
      Header: 'Id',
      accessor: 'invoice_id',
    },
    {
      Header: 'A/C',
      accessor: 'ac_name',
    },
    {
      Header: 'Items',
      accessor: 'totalitems',
    },
   
    {
      Header: 'Total',
      accessor: 'totaltk_v',
    },
    {
      Header: 'Type',
      accessor: 'selltype',
    },
    {
      Header: 'Posted',
      accessor: 'posted',
    },
   
 
    {
      Header: 'ACTION',
      Cell: ({ row }) => (

       <>
      <div className="btn-group" style={{display:'flex',placeContent:'center'}}>
      <InvoiceViewer data={row.original.invoice_id}/>
  <button type="button" 
    onClick={() => {
      Modal.confirm({
        title: 'Confirm',
        content: 'Are you sure to edit?',
        onOk: ()=> handleEdit(row.original.invoice_id), // Add the onOk callback
        footer: (_, { OkBtn, CancelBtn }) => (
          <>
            <CancelBtn />
            <OkBtn />
          </>
        ),
      });
    }}
 data-toggle="modal" data-target="#editBrandModel"  className=" btn bg-navy   btn-xs"><i className="fa fa-edit" /></button>
  <button
className=" btn bg-maroon  btn-xs"
  onClick={() => {
    Modal.confirm({
      title: 'Confirm',
      content: 'Are you sure to delete?',
      onOk: ()=> handleDelete(row.original.invoice_id), // Add the onOk callback
      footer: (_, { OkBtn, CancelBtn }) => (
        <>
          <CancelBtn />
          <OkBtn />
        </>
      ),
    });
  }}
>
<i className="fa fa-trash" />
</button>

</div>

       </>
      ),
    },
    // Add more columns as needed
  ];
  // decide what to render
  let content = null;

  if (fetchinvData?.length > 0) {
      content =  <DataTable columns={columns} data={tbl_data} />
  }

  if (fetchinvData?.length === 0) {
      content = <p className="text-center m-5">No data found!</p>;
  }
 
  return (
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
  )
}

export default ViewList