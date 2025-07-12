import React,{useEffect,useState} from 'react'
import { Link } from 'react-router-dom'
const ReportsMenu = () => {

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []); 
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
  return (
    <div className="page-wrapper" style={{marginTop:'10px'}}>
            <section className='content'>
                <div className="row">
    <Link to="/ledger">
    <div className="col-xs-6 col-sm-3">
      <div className="panel panel-success text-center" style={{ padding: '20px' ,backgroundColor: '#def4f4',border:'1px solid #77ecbc'}}>
      <img src="./assets/accountsledger.svg" alt="" height={60} width={60} />
        <h4 style={{color:'#67a7df',fontWeight:'bold',fontSize:'20px'}}>Accounts Ledger</h4>
      </div>
    </div>
    </Link>
    <Link to="/productledger">
    <div className="col-xs-6 col-sm-3">
      <div className="panel panel-success text-center" style={{ padding: '20px', backgroundColor: '#e7fef2',border:'1px solid #77ecbc' }}>
      <img src="./assets/product.svg" alt="" height={60} width={60} />
        <h4 style={{color:'#50b754',fontWeight:'bold',fontSize:'20px'}}>Product Ledger</h4>
      </div>
    </div>
    </Link>
    <Link to="/salesreport">
    <div className="col-xs-6 col-sm-3">
      <div className="panel panel-danger text-center" style={{ padding: '20px' , backgroundColor: '#ffd6d4',border:'1px solid #ecbabb' }}>
      <img src="./assets/salesreport.svg" alt="" height={60} width={60} />

        <h4 style={{color:'#e77474',fontWeight:'bold',fontSize:'20px'}}>Sales Report</h4>
      </div>
    </div>
    </Link>
    <Link to="/transactionreport">
    <div className="col-xs-6 col-sm-3">
      <div className="panel panel-default text-center" style={{ padding: '20px', backgroundColor: '#d3e6fd',border:'1px solid #b4cfea' }}>
      <img src="./assets/transaction.svg" alt="" height={60} width={60} />

        <h4 style={{color:'#64B5F6',fontWeight:'bold',fontSize:'20px'}}>Transaction Report</h4>
      </div>
    </div>
    </Link>
  </div>

  <div className="row">
    <Link to="/stockreport">
    <div className="col-xs-6 col-sm-3">
      <div className="panel panel-success text-center" style={{ padding: '20px' ,backgroundColor: '#def4f4',border:'1px solid #77ecbc'}}>
      <img src="./assets/stock.svg" alt="" height={60} width={60} />
        <h4 style={{color:'#67a7df',fontWeight:'bold',fontSize:'20px'}}>Stock Report</h4>
      </div>
    </div>
    </Link>
    <Link to="/creditreport">
    <div className="col-xs-6 col-sm-3">
      <div className="panel panel-success text-center" style={{ padding: '20px', backgroundColor: '#e7fef2',border:'1px solid #77ecbc' }}>
      <img src="./assets/due.svg" alt="" height={60} width={60} />
        <h4 style={{color:'#50b754',fontWeight:'bold',fontSize:'20px'}}>Credit Report</h4>
      </div>
    </div>
    </Link>
    <Link to="/bankledger">
    <div className="col-xs-6 col-sm-3">
      <div className="panel panel-success text-center" style={{ padding: '20px', backgroundColor: '#e7fef2',border:'1px solid #77ecbc' }}>
      <img src="./assets/transaction.svg" alt="" height={60} width={60} />
        <h4 style={{color:'#50b754',fontWeight:'bold',fontSize:'20px'}}>Bank Ledger</h4>
      </div>
    </div>
    </Link>
  </div>
  </section>
  </div>
  )
}

export default ReportsMenu