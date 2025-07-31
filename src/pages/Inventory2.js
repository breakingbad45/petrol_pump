import { useEffect,useState } from 'react';
import React  from 'react'
import AddForm from '../components/inventory2/AddForm';
import ViewList from '../components/inventory2/ViewList';
import CartItem from '../components/inventory2/CartItem';
import pb from '../utils/pocketbase';
import {useNavigate } from 'react-router-dom';
import "../components/inventory2/style.css"
import Marquee from 'react-fast-marquee';
import { useDispatch, useSelector } from "react-redux";
import Loader from '../reuseable/Loader';
import { useSWRConfig } from 'swr';
import { Content } from 'antd/es/layout/layout';
const Inventory2 = () => {

  // useEffect(() => {
  //   mutate('fetchinvData')
  //  if(!isLogged){
  //   navigate('/')
  //  } else if(isDue){
  //   navigate('/payment')
  //  }
  // }, []);
  const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
      const handleResize = () => {
        setIsMobile(window.innerWidth <= 768); // You can adjust this threshold as needed
      };
  
      // Initial check
      handleResize();
  
      window.addEventListener('resize', handleResize);
  
      // Cleanup
      return () => window.removeEventListener('resize', handleResize);
    }, []);
  
    useEffect(() => {
      if (isMobile) {
        document.body.classList.add('sidebar-collapse');
        document.body.classList.remove('sidebar-open'); // Remove sidebar-open
      } else {
        document.body.classList.remove('sidebar-collapse');
      }
    }, [isMobile]);

// useEffect(() => {
// (async()=>{
//   const inventoryRecords = await pb.collection('catalog').getFullList({
   
//   });


//   for (const element of inventoryRecords) {
//     try {
//       await pb.collection('catalog').delete(element.id); // Replace 'element.id' with the actual ID
    
//     } catch (error) {
    
//     }
//   }
// })()
// }, []);
useEffect(() => {
  window.scrollTo(0, 0);
}, []); 
let content = null;


    content = <>
    <AddForm/>
<CartItem/>
<ViewList/>
    </>;


  return (
    
<div className="page-wrapper">

<section className='content'>
<div className='d-flex '>
    
{/* <div>
<Marquee className='marq' >
   
এই অনলাইন বেইজড একাউন্টিং সফটওয়্যার টি একটি আইটি টেক পয়েন্ট বিডি র তৈরিকৃত সফটওয়্যা। যেকোনো প্রয়োজনে যোগাযোগ করুন : +৮৮০১৭৯৬১৯৪৭৯১ 
  
</Marquee>
</div> */}
        
     
     
</div>
  <div className='row'>
{/* <DataTable/> */}
{content}
   
</div>
</section>
</div>
  )
}

export default Inventory2