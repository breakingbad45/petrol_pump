import { useEffect, useState } from 'react';
import TempForm from "../components/TempForm";
import Transaction from '../components/Temporary/Transactions';
import "../components/inventory/style.css";
import Marquee from "react-fast-marquee";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loader from '../reuseable/Loader';
function Temporary() {
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(false);
    const [isValid, setIsValid] = useState(false);
    const [loading, setLoading] = useState(true); // Loading state

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768); // Adjust this threshold as needed
        };

        handleResize(); // Initial check
        window.addEventListener('resize', handleResize);

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
        const checkSession = async () => {
            const token = localStorage.getItem('sessionToken');
            try {
                const response = await axios.get(`https://petrolpump.fahimtraders.com/backend/login/login.php?token=${token}`);
                if (response.data.success) {
                    setIsValid(true);
                } else {
                    navigate('/'); // Redirect to login if session is invalid
                }
            } catch (error) {
                console.error('Error:', error);
                navigate('/'); // Redirect to login on error
            } finally {
                setLoading(false); // Stop loading once session check is complete
            }
        };

        checkSession();
    }, [navigate]);
    useEffect(() => {
        window.scrollTo(0, 0);
      }, []); 
    if (loading) {
        return <div><Loader/></div>; // Show a loading indicator while checking the session
    }

    if (!isValid) {
        return null; // Do not render anything if the session is invalid
    }

    return (
        <div className="page-wrapper">
            <section className='content'>
                <div className='d-flex'>
                    <div>
                        <Marquee className='marq'>
                            এই অনলাইন বেইজড একাউন্টিং সফটওয়্যার টি আইটি টেক পয়েন্ট বিডি র তৈরিকৃত সফটওয়্যার, যেকোনো প্রয়োজনে যোগাযোগ করুন : +8801796194791
                        </Marquee>
                    </div>
                </div>
                <div className='row'>
                    <TempForm />
                    <Transaction />
                </div>
            </section>
        </div>
    );
}

export default Temporary;
