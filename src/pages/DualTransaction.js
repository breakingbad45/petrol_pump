
import { useEffect ,useState} from 'react';
import DualForm from "../components/DualForm";
import Transactions from "../components/DualTransactions/Transactions";
import "../components/inventory/style.css"
import Marquee from "react-fast-marquee";
import {useNavigate } from 'react-router-dom';
import pb from '../utils/pocketbase';
import { useSWRConfig } from 'swr';
function DualTransaction() {
    
    // useEffect(() => {
    //  mutate('dualtransactions')
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
    useEffect(() => {
      window.scrollTo(0, 0);
    }, []); 
    return (
        <div className="page-wrapper">
    
<section className='content '>
<div className='d-flex '>
    
<div>
<Marquee className='marq' >
   
এই অনলাইন বেইজড একাউন্টিং সফটওয়্যার টি  আইটি টেক পয়েন্ট বিডি র তৈরিকৃত সফটওয়্যার, যেকোনো প্রয়োজনে যোগাযোগ করুন : +8801796194791 
  
</Marquee>
</div>
        
     
     
</div>
  <div className='row'>
 
  <DualForm />


            <Transactions />
</div>
</section>

  
</div>
        
    );
}

export default DualTransaction;
