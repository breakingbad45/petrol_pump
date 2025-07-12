import { useDispatch } from "react-redux";
import { editActive,removeAccount } from "../../features/accounts/accountsSlice";
import React from 'react'
import DataTable from '../reuseable/DataTable'
import {getAccounts} from "../../features/accounts/accountsAPI"
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

const tbl_data = catalogueData?.map((item,i)=> ({
  sl:i+1,
  id: item.id,
  name: item.name,
  proprietor: item.proprietor,
  address: item.address,
  contact: item.contact,
  type: item.type,
  type_n: item.typename,
  c_id: `AC`+item.id.slice(-4),
}));
  const columns = [
    {
      Header: '#',
      accessor: 'sl',
    },
    {
      Header: 'AC/ID',
      accessor: 'c_id',
    },
    {
      Header: 'A/C NAME',
      accessor: 'name',
    },
    {
      Header: 'ADDRESS',
      accessor: 'address',
    },
    {
      Header: 'CONTACT',
      accessor: 'contact',
    },
    {
      Header: 'TYPE',
      accessor: 'type_n',
    },
   

    {
      Header: 'ACTION',
      Cell: ({ row }) => (

       <>
       

     {/* Single button */}
<div className="btn-group">
  <button type="button"  onClick={()=>handleEdit(row.original)} data-toggle="modal" data-target="#editBrandModel"  className=" btn bg-navy   btn-xs"><i className="fa fa-edit" /></button>

  <button
className=" btn bg-maroon  btn-xs"
  onClick={() => {
    Modal.confirm({
      title: 'Confirm',
      content: 'Are you sure to delete?',
      onOk: ()=>handleDelete(row.original.id), // Add the onOk callback
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
    
    <section className="col-lg-8 connectedSortable">
      
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