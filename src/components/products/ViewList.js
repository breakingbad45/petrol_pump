import { useDispatch } from "react-redux";
import { editActive,removeAccount } from "../../features/products/productsSlice";
import React from 'react'
import DataTable from '../reuseable/DataTable'
import {getProducts} from "../../features/products/productsAPI"
import useSWR, { useSWRConfig } from 'swr'
import {Modal } from 'antd';
import Loader from "../../reuseable/Loader";
const ViewList = () => {


  const { mutate } = useSWRConfig()
 
  const { data: catalogueData, isLoading: catloading } = useSWR(
    "fetchproducts",
    getProducts,
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
    mutate('fetchproducts');

    // Log after mutate to check if it's being called
  
  } catch (error) {
    console.error('Error in handleDelete:', error);
  }
};

const tbl_data = catalogueData?.map((item,i)=> ({
  sl:i+1,
  id: item.id,
  name: item.name,
  brand: item.brand,
  brand_name: item.brand_name,
  category: item.category,
  category_name: item.category_name,
  unit_1: item.unit_1,
  unit_2: item.unit_2,
  rate: item.rate,
  // type_n: item.expand?.type.subtype,
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
      Header: 'BRAND',
      accessor: 'brand_name',
    },
    {
      Header: 'CATEGORY',
      accessor: 'category_name',
    },
    {
      Header: 'unit_1',
      accessor: 'unit_1',
    },
   
    {
      Header: 'unit_2',
      accessor: 'unit_2',
    },
    {
      Header: 'rate',
      accessor: 'rate',
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
      content = <p>No products found!</p>;
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