 "use client";

import { useEffect, useState } from 'react';
import axios from 'axios';

const PaymentsPage = () => {
    const [payments, setPayments] = useState([]);

    const fetchPayments = async () => {
        try {
            const response = await axios.get('/api/payments');
            setPayments(response.data.payments);
        } catch (error) {
            console.error('Error fetching payments:', error);
        }
    };

    useEffect(() => {
        fetchPayments();
    }, []);

    return (
        <div>
            <h1>Payments</h1>
            <table>
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Subscription</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Payment Date</th>
                    </tr>
                </thead>
                <tbody>
                    {payments.map(payment => (
                        <tr key={payment._id}>
                            <td>{payment.user_id.name}</td> {/* Populated User Name */}
                            <td>{payment.subscription_id.name}</td> {/* Populated Subscription Name */}
                            <td>${payment.amount.toFixed(2)}</td>
                            <td>{payment.status}</td>
                            <td>{new Date(payment.payment_date).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PaymentsPage;