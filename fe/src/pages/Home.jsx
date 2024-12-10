import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios';
import { LuSearch } from "react-icons/lu";
import currencyFormat from '../utils/Currency';

function Home() {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
          try {
            const response = await axios.get('http://127.0.0.1:8000/api/orders');
            setOrders(response.data);
          } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to fetch orders';
            setError(errorMessage);
          } finally {
            setIsLoading(false); 
          }
        };
    
        fetchOrders();
    }, []);

    if (isLoading) {
        return (
            <div className='h-full flex justify-center items-center'>
                <span className="loading loading-dots loading-lg"></span>
            </div>
        )
    }

    return (
        <div className="card bg-base-100 border-2 m-5">
            <div className="card-body p-5 w-full">
                <p className="text-xl font-bold text-center mb-5">Orders</p>
                {error && <div className="error-message">{error}</div>}
                <div className="grid lg:grid-cols-2 grid-cols-1 gap-2">
                    {Array.isArray(orders.data) && orders.data.length > 0 ? (
                        orders.data.map(order => (
                            <div key={order.order_id} className="card bg-base-100 border-2 w-full">
                                <div className="card-body p-5">
                                    <div className='flex justify-between items-center'>
                                        <div className="flex items-center gap-2">
                                            <div>
                                                <p className="flex items-center font-bold text-xl text-black gap-2 mb-5">{order.customer.customer_name}</p>
                                                <p className='font-medium text-md text-gray-400'>Ordered on: {new Date(order.order_date).toLocaleDateString()}</p>
                                                <p className={`font-medium text-md`}>Status: <span className={order.status == 'completed' ? 'text-green-400' : 'text-red-400'}>{order.status}</span> </p>
                                                <p className='font-medium text-lg'>Total Amount: {currencyFormat(order.total_amount, 'Rp ').format(true) }</p>
                                            </div>
                                        </div>
                                        <div className="card-actions">
                                            <Link to={`/orders/${order.order_id}`} className="btn btn-info"><LuSearch className='text-xl font-bold'/></Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No orders found</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Home