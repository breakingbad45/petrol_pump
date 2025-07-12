import { useDispatch } from "react-redux";
import { editActive,removeAccount } from "../../features/reading/accountsSlice";
import React from 'react'
import DataTable from '../reuseable/DataTable'
import {getAccounts} from "../../features/reading/accountsAPI"
import useSWR, { useSWRConfig } from 'swr'
import {Modal } from 'antd';
import Loader from "../../reuseable/Loader";
const ViewList = () => {


  const { mutate } = useSWRConfig()
 
  const { data: catalogueData, isLoading: catloading } = useSWR(
    "fetchcatalog",
    getAccounts,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const dispatch = useDispatch();

  // const { isLoading, isError } = useSelector((state) => state.account);
  // useEffect(() => {
  //     dispatch(fetchAccounts());
  // }, [dispatch]);

  const handleEdit = (data) => {
    dispatch(editActive(data));
};

const handleDelete = async (id) => {
  // showModal()

  try {
    // Dispatch the action to remove the account
    await dispatch(removeAccount(id));

    // Call mutate
    mutate('fetchcatalog');

    // Log after mutate to check if it's being called
    console.log('After mutate in handleDelete');
  } catch (error) {
    console.error('Error in handleDelete:', error);
  }
};

function formatDateTime12Hour(timeStr) {
  const date = new Date(timeStr);
  const datePart = date.toISOString().slice(0, 10);
  const timePart = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  }).toLowerCase();

  return `${datePart}  ${timePart}`;
}

const tbl_data = catalogueData?.map((item, i) => ({
    sl: i + 1,
    id: item.id,
    machine_name: item.machine_name,
    start_reading: item.start_reading,
    end_reading: item.end_reading,
    total_ltr: parseFloat(item.start_reading)-parseFloat(item.end_reading),
    rate: item.rate,
    total_tk: parseFloat(item.rate)*(parseFloat(item.start_reading)-parseFloat(item.end_reading)),
    operator: item.operator,
    posted: item.posted,
    created_at: formatDateTime12Hour(item.created_at),
    updated_at: formatDateTime12Hour(item.updated_at),
  }));
  const columns = [
    { Header: "#", accessor: "sl" },
    { Header: "Machine", accessor: "machine_name" },
    { Header: "Start", accessor: "start_reading" },
    { Header: "End", accessor: "end_reading" },
    { Header: "Total", accessor: "total_ltr" },
    { Header: "Rate", accessor: "rate" },
    { Header: "Total", accessor: "total_tk" },
    { Header: "Operator", accessor: "operator" },
    { Header: "Created At", accessor: "created_at" },
    { Header: "Updated At", accessor: "updated_at" },
    {
      Header: "ACTION",
      Cell: ({ row }) => (
        <div className="btn-group">
          <button
            type="button"
            className="btn bg-navy btn-xs"
            onClick={() => handleEdit(row.original)}
          >
            <i className="fa fa-edit" />
          </button>

          <button
            className="btn bg-maroon btn-xs"
            onClick={() => {
              Modal.confirm({
                title: "Confirm",
                content: "Are you sure you want to delete?",
                onOk: () => handleDelete(row.original.id),
              });
            }}
          >
            <i className="fa fa-trash" />
          </button>
        </div>
      ),
    },
  ];

  // decide what to render
  let content = null;
  // if (isLoading) content = <p>Loading...</p>;

  if (catloading)
      content = <>
      <div style={{minHeight:'450px'}}>
      <Loader/>
      </div>
      </>;

  if ( catalogueData?.length > 0) {
      content =  <DataTable columns={columns} data={tbl_data} />
  }

  if ( catalogueData?.length === 0) {
      content = <p>No accounts found!</p>;
  }

 
  return (
    
    <section className="col-lg-9 connectedSortable">
      
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