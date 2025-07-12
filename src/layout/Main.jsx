import React from 'react'
import Marquee from 'react-fast-marquee';
const Main = (  {children}) => {
  return (
    <div>

<div className="content-wrapper">
{/* <div className='d-flex '>
      <div className="marq1">
  <h5 className="latestUpdateTitle">বিঃদ্রঃ</h5>
</div>
<div>
<Marquee className='marq' >
   
এই অনলাইন বেইজড একাউন্টিং সফটওয়্যার টি  আইটি টেক পয়েন্ট বিডি র তৈরিকৃত সফটওয়্যার, যেকোনো প্রয়োজনে যোগাযোগ করুন : +8801796194791 
  
</Marquee>
</div>
        
     
     
</div> */}
       {children}
        </div>
    </div>
  )
}

export default Main