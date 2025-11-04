import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axios';
import numberWithCommas from '../utils/numberWithCommas';
import Swal from 'sweetalert2';
import { useSWRConfig } from 'swr';

export default function EmployeeSalaryForm() {
    const { mutate } = useSWRConfig();
    const [employees, setEmployees] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    // Stores editable salary for each employee, keyed by ac_id
    const [salaryData, setSalaryData] = useState({}); 

    // The A/C ID that will register the payment (debit) transaction
    // Per your request, this is hardcoded to '25'.
    const SALARY_EXPENSE_ACCOUNT_ID = '11072'; 

    // 1. Fetch Employee Accounts
    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await axiosInstance.get("/commondata/getAccounts.php");
                // Filter accounts to only include employees (assuming 'type' is 'EMPLOYEE')
                const employeeAccounts = response.data.filter(actype => actype.type === "EMPLOYEE");

                const updatedEmployees = employeeAccounts.map((item) => ({
                    ac_id: item.id,
                    name: item.name,
                    address: item.address || 'N/A', // New field
                    contact: item.contact || 'N/A', // New field
                    // Assuming a 'salary' column exists in your DB for the default amount
                    salary: Number(item.salary || 0), 
                    balance: Number(item.balance),
                }));

                setEmployees(updatedEmployees);

                // Initialize salaryData state with the employee's default salary from DB
                const initialSalaryData = updatedEmployees.reduce((acc, employee) => {
                    // Use the salary field from the DB as the initial editable value
                    // If salary is 0, start with an empty string for better UX
                    acc[employee.ac_id] = employee.salary > 0 ? employee.salary : ''; 
                    return acc;
                }, {});
                setSalaryData(initialSalaryData);

            } catch (error) {
                console.error("Error fetching employees:", error);
                Swal.fire({
                    icon: "error",
                    title: "Failed to load employees",
                    text: "Could not fetch employee list from the server.",
                });
            }
        };
        fetchEmployees();
    }, []);

    // 2. Handle Salary Input Change
    const handleSalaryChange = (ac_id, value) => {
        // Ensure the value is a number and non-negative
        const numericValue = value === '' ? '' : Math.max(0, parseFloat(value) || 0);
        setSalaryData(prev => ({
            ...prev,
            [ac_id]: numericValue
        }));
    };

    // 3. Handle Pay Click (Dual Transaction Logic)
    const handlePay = async (employee) => {
        const paymentAmount = Number(salaryData[employee.ac_id]);

        if (paymentAmount <= 0 || isNaN(paymentAmount)) {
            Swal.fire({
                icon: "warning",
                title: "Invalid Amount",
                text: `Please enter a valid salary amount for ${employee.name}.`,
            });
            return;
        }

        setIsLoading(true);

        // Generate a unique invoice ID
        const inv_id = `SAL-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const remarks = `Salary payment to ${employee.name}`;
        
        // --- Dual Transaction Data Structure ---
        const transactionData = {
            formdata1: {
                // Transaction 1: Credit (Receive) for Employee account
                // This increases the employee's balance/ledger credit
                inv_id: inv_id,
                ac_id: employee.ac_id, // Employee Account ID
                sell_type: "DUALTRANSACTION",
                payment: "0", 
                receive: paymentAmount.toFixed(2), 
                remarks: remarks,
                posted: "1",
            },
            formdata2: {
                // Transaction 2: Debit (Payment) from Salary Expense Account (A/C 25)
                // This decreases the Expense Account's balance
                inv_id: inv_id,
                ac_id: SALARY_EXPENSE_ACCOUNT_ID, // <--- Hardcoded A/C 25
                sell_type: "DUALTRANSACTION",
                payment: paymentAmount.toFixed(2), // Expense account pays out the amount
                receive: "0", 
                remarks: remarks,
                posted: "1",
            },
        };

        try {
            // Send to the dual transaction API endpoint
            await axiosInstance.post('/commondata/processsalary.php', transactionData);
            
            Swal.fire({
                position: "center",
                icon: "success",
                title: `Salary of ${numberWithCommas(paymentAmount.toFixed(2))} paid to ${employee.name}!`,
                showConfirmButton: false,
                timer: 1500
            });

            // Clear the paid salary input only after successful payment
            setSalaryData(prev => ({ ...prev, [employee.ac_id]: '' }));

            // Re-fetch data to update UI
            mutate('transactions'); 
            
        } catch (error) {
            console.error('Salary payment error:', error);
            Swal.fire({
                icon: "error",
                title: "Payment Failed",
                text: error.response?.data?.error || "An error occurred during payment.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="box box-danger">
            <div className="box-header header-custom">
                <h3 className="box-title">Employee Salary Payment</h3>
            </div>
            <div className="box-body">
               
                <div className="table-responsive">
                    <table className="table table-bordered table-striped">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name & Details</th>
                                <th className="text-right">Current Balance</th>
                                <th>Salary Amount</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.length > 0 ? (
                                employees.map((employee, index) => (
                                    <tr key={employee.ac_id}>
                                        <td>{index + 1}</td>
                                        <td>
                                            <strong>{employee.name}</strong><br/>
                                            <small className="text-muted">
                                                {employee.address}<br/>
                                                Contact: {employee.contact}
                                            </small>
                                        </td>
                                        <td className="text-right text-bold">
                                            {numberWithCommas(employee.balance.toFixed(2))}
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                className="form-control"
                                                // Correctly use ac_id as the key for salaryData lookup
                                                value={salaryData[employee.ac_id]} 
                                                onChange={(e) => handleSalaryChange(employee.ac_id, e.target.value)}
                                                // Show the default salary as a visual placeholder
                                                placeholder={`Default: ${numberWithCommas(employee.salary.toFixed(2))}`}
                                                min="0"
                                            />
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-success btn-sm"
                                                onClick={() => handlePay(employee)}
                                                // Disable button if loading or amount is invalid
                                                disabled={isLoading || Number(salaryData[employee.ac_id]) <= 0 || isNaN(Number(salaryData[employee.ac_id]))}
                                            >
                                                {isLoading ? <i className="fa fa-spinner fa-spin"></i> : 'Pay'}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center">No employee accounts found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
