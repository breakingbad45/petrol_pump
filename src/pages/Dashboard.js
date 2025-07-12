import React,{useEffect,useState} from 'react'
import pb from '../utils/pocketbase'
import CountUp from "react-countup";
import {useNavigate } from 'react-router-dom';
import useApiData from "../utils/useApiData";
import numberWithCommas from '../utils/numberWithCommas';
import Marquee from "react-fast-marquee";
import { Link } from 'react-router-dom';
import BackupModal from '../components/reuseable/BackupModal';
import axiosInstance from '../utils/axios';
const Dashboard = () => {

  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [fileName, setFileName] = useState('');

  const [summary, setSummary] = useState([]);

  useEffect(() => {
      // Fetch data from the PHP API
      axiosInstance.get('/commondata/fetchSummary.php')
          .then(response => {
            setSummary(response.data);
          })
          .catch(error => {
              setError('Error fetching data');
              console.error('There was an error!', error);
          });
  }, []);
  const formattedDate = new Date();

  // Convert the UTC time to UTC+6
  const utcPlus6Date = new Date(formattedDate.getTime() + (6 * 60 * 60 * 1000));
  
  // Format the date and time as desired
  const currentDate = utcPlus6Date.toISOString().slice(0, 10); // YYYY-MM-DD

  const fuser = localStorage.getItem('user');
  const user =JSON.parse(fuser)
  const date = user.mode === "1" ? user.date : currentDate;



  const handleBackup = async () => {
    setLoading(true);
    setShowModal(true);
    setError(null);

    try {
      const response = await fetch('https://petrolpump.fahimtraders.com/backup/backup.php');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Backup failed');
      }

      setFileName(data.filename);
      setLoading(false);
      setShowModal(false);

      // Trigger file download
      const downloadUrl = `https://petrolpump.fahimtraders.com/backup/download.php?file=${data.filename}`;
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      a.remove();

    } catch (error) {
      setError(error.message);
      setLoading(false);
      setShowModal(false);
    }
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []); 

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
 
    // // Function to find references based on the "id" property
    // function findReferences(idsArray, usersArray) {
    //   const references = {};
    //   idsArray.forEach(id => {
    //     const user = usersArray.find(user => user.id === id);
    //     if (user) {
    //       references[id] = user?.reference;
    //     } else {
    //       references[id] = "Not found";
    //     }
    //   });
    //   return references;
    // }

    //    // Function to find references based on the "id" property
    //    function findReferences2(idsArray, usersArray) {
    //     const references = {};
    //     idsArray.forEach(id => {
    //       const user = usersArray.find(user => user.id === id);
    //       if (user) {
    //         references[id] = user.Company_name;
    //       } else {
    //         references[id] = "Not found";
    //       }
    //     });
    //     return references;
    //   }
    

  return (
    <div>



<section className="content">





<div className="page-wrapper" >
<div className="col-lg-12 col-xs-12">
  {/* small box */}
  <div className="small-box" style={{background:'#18444e',color:'white',marginTop:'20px'}}>
    <div className="inner maina">
      <h3 style={{color: 'Chartreuse', fontSize: '3vw',fontFamily:'SolaimanLipi'}} align="center">{user.company}</h3>
      <p align="center">{user.address}</p>
      <p align="center">{user.contact}</p>
    </div>
  </div>
</div>


   <div style={{ padding: '10px'}}>
   

  <div className="row">
  <div className="col-xs-6 col-sm-3">
    <div
      className="panel panel-default"
      style={{
        padding: '20px',
        height: '100px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <i
          className="glyphicon glyphicon-shopping-cart"
          style={{
            fontSize: '20px',
            marginRight: '8px',
            backgroundColor: '#4CAF50',
            color: 'white',
            padding: '8px',
            borderRadius: '8px',
          }}
        ></i>
        <h4 style={{ margin: 0, fontWeight: 'bold' ,fontFamily:'SolaimanLipi'}}>মোট বিক্রয় </h4>
      </div>
      <div style={{ textAlign: 'right' }}>
        <p style={{ margin: 0, fontWeight: 'bold' }}>
          {numberWithCommas(
            parseInt(summary[0]?.cash_sell || 0) +
            parseInt(summary[0]?.credit_sell || 0)
          )} Tk
        </p>
      </div>
    </div>
  </div>
  <div className="col-xs-6 col-sm-3">
    <div
      className="panel panel-default"
      style={{
        padding: '20px',
        height: '100px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center',fontFamily:'SolaimanLipi' }}>
        <i
          className="glyphicon glyphicon-stats"
          style={{
            fontSize: '20px',
            marginRight: '8px',
            backgroundColor: '#EF6C00',
            color: 'white',
            padding: '8px',
            borderRadius: '8px',
          }}
        ></i>
        <h4 style={{ margin: 0, fontWeight: 'bold' ,fontFamily:'SolaimanLipi'}}>মোট ক্রয় </h4>
      </div>
      <div style={{ textAlign: 'right' }}>
        <p style={{ margin: 0, fontWeight: 'bold' }}>
          {numberWithCommas(
            parseInt(summary[0]?.cash_pur || 0) +
            parseInt(summary[0]?.credit_pur || 0)
          )} Tk
        </p>
      </div>
    </div>
  </div>

  <div className="col-xs-6 col-sm-3">
    <div
      className="panel panel-default"
      style={{
        padding: '20px',
        height: '100px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <i
          className="glyphicon glyphicon-credit-card"
          style={{
            fontSize: '20px',
            marginRight: '8px',
            backgroundColor: '#2571ab',
            color: 'white',
            padding: '8px',
            borderRadius: '8px',
          }}
        ></i>
        <h4 style={{ margin: 0, fontWeight: 'bold',fontFamily:'SolaimanLipi' }}> মোট জমা </h4>
      </div>
      <div style={{ textAlign: 'right' }}>
        <p style={{ margin: 0, fontWeight: 'bold' }}>
          {numberWithCommas(parseInt(summary[0]?.totalrec || 0))} Tk
        </p>
      </div>
    </div>
  </div>
  <div className="col-xs-6 col-sm-3">
    <div
      className="panel panel-default"
      style={{
        padding: '20px',
        height: '100px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <i
          className="glyphicon glyphicon-minus-sign"
          style={{
            fontSize: '20px',
            marginRight: '8px',
            backgroundColor: '#e51866',
            color: 'white',
            padding: '8px',
            borderRadius: '8px',
          }}
        ></i>
        <h4 style={{ margin: 0, fontWeight: 'bold',fontFamily:'SolaimanLipi' }}>মোট খরচ </h4>
      </div>
      <div style={{ textAlign: 'right' }}>
        <p style={{ margin: 0, fontWeight: 'bold' }}>
          {numberWithCommas(parseInt(summary[0]?.totalpay || 0))} Tk
        </p>
      </div>
    </div>
  </div>
</div>

  
  <div className="row">
    <Link to="/inventory">
    <div className="col-xs-6 col-sm-3">
      <div className="panel panel-success text-center" style={{ padding: '20px' ,backgroundColor: '#def4f4',border:'1px solid #77ecbc'}}>
      <img src="./assets/salesreport.svg" alt="" height={60} width={60} />
        <h4 style={{color:'#67a7df',fontWeight:'bold',fontSize:'20px'}}>Sale</h4>
      </div>
    </div>
    </Link>
    <Link to="/inventory">
    <div className="col-xs-6 col-sm-3">
      <div className="panel panel-success text-center" style={{ padding: '20px', backgroundColor: '#e7fef2',border:'1px solid #77ecbc' }}>
      <img src="./assets/sales.svg" alt="" height={60} width={60} />
        <h4 style={{color:'#50b754',fontWeight:'bold',fontSize:'20px'}}>Purchases</h4>
      </div>
    </div>
    </Link>
    <Link to="/transaction">
    <div className="col-xs-6 col-sm-3">
      <div className="panel panel-danger text-center" style={{ padding: '20px' , backgroundColor: '#ffd6d4',border:'1px solid #ecbabb' }}>
      <img src="./assets/transaction.svg" alt="" height={60} width={60} />

        <h4 style={{color:'#e77474',fontWeight:'bold',fontSize:'20px'}}>Transaction</h4>
      </div>
    </div>
    </Link>
    {/* <button onClick={handleBackup} disabled={loading}>
        {loading ? 'Backing up...' : 'Backup Database'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {fileName && <p>Backup complete: {fileName}</p>} */}

      <BackupModal show={showModal} />
 

    <div className="col-xs-6 col-sm-3" onClick={handleBackup} disabled={loading}>
      <div className="panel panel-default text-center" style={{ padding: '20px', backgroundColor: '#d3e6fd',border:'1px solid #b4cfea' }}>
      <img src="./assets/cloud.png" alt="" height={60} width={60} />

        <h4 style={{color:'#64B5F6',fontWeight:'bold',fontSize:'20px'}}>     {loading ? 'Backing up...' : 'Backup Database'}</h4>
      </div>
    </div>



    <Link to="/profit">
    <div className="col-xs-6 col-sm-3">
      <div className="panel panel-danger text-center" style={{ padding: '20px' , backgroundColor: '#ffd6d4',border:'1px solid #ecbabb' }}>
      <img src="./assets/profit.svg" alt="" height={60} width={60} />

        <h4 style={{color:'#e77474',fontWeight:'bold',fontSize:'20px'}}>Profit Report</h4>
      </div>
    </div>
    </Link>

    <Link to="/finalreport">
    <div className="col-xs-6 col-sm-3">
      <div className="panel panel-danger text-center" style={{ padding: '20px' , backgroundColor: '#ffd6d4',border:'1px solid #ecbabb' }}>
      <img src="./assets/cashbook.svg" alt="" height={60} width={60} />

        <h4 style={{color:'#e77474',fontWeight:'bold',fontSize:'20px'}}>Final account</h4>
      </div>
    </div>
    </Link>
    
  </div>
</div>

    </div>
      
                </section>

                {/* <section className='col-md-6'>
<BarChart chartData={data} />


</section>

<section className='col-md-6'>
<PieChart chartData={data} />s

</section> */}


    </div>
  )
}

export default Dashboard