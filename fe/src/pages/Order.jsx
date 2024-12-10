import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { LuTrash, LuPencil  } from "react-icons/lu";
import { Link, useNavigate, useParams } from 'react-router-dom';
import currencyFormat from '../utils/Currency';

function Order() {
    const { id } = useParams();
    const [order, setOrder] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchOrder = async () => {
          try {
            const response = await axios.get(`http://127.0.0.1:8000/api/orders/${id}`);
            setOrder(response.data);
          } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to fetch order';
            setError(errorMessage);
          } finally {
            setIsLoading(false);
          }
        };
    
        fetchOrder();
      }, [id]);

    const deleteHadler = async (e) => {
        e.preventDefault()
        setIsProcessing(true);
        try {
          const response = await axios.delete(`http://127.0.0.1:8000/api/orders/${id}`);
          navigate('/');
        } catch (err) {
          const errorMessage = err.response?.data?.message || 'Failed to detele order';
          setError(errorMessage);
        }
    }
    
    if (isLoading) {
        return (
            <div className='h-full flex justify-center items-center'>
                <span className="loading loading-dots loading-lg"></span>
            </div>
        )
    }
      
    return (
        <div className="card bg-base-100 border-2 m-5">
            <div className="card-body p-5 items-center w-full">
                <p className="text-xl font-bold text-center mb-5">Order</p>
                {error && <div className="error-message">{error}</div>}
                <div className="card bg-base-100 border-2 w-full">
                    <div className="card-body p-5">
                        <div className='flex justify-between items-end'>
                            <div className="flex gap-2">
                                <div>
                                    <p className="font-bold text-xl text-black">{order.data.customer.customer_name}</p>
                                    <p className="font-medium text-md text-gray-400 mb-5">{order.data.customer.phone_number}</p>
                                    <p className='font-medium text-md text-gray-400'>Ordered on: {new Date(order.data.order_date).toLocaleDateString()}</p>
                                    <p className={`font-medium text-md`}>Status: <span className={order.data.status == 'completed' ? 'text-green-400' : 'text-red-400'}>{order.data.status}</span> </p>
                                    <p className='font-medium text-lg'>Total amount: {currencyFormat(order.data.total_amount, 'Rp ').format(true) }</p>
                                </div>
                            </div>
                            <div className="card-actions">
                                <Link to={`/orders/${order.data.order_id}/edit`} className="btn btn-info"><LuPencil className='text-xl font-bold'/></Link>
                                <button 
                                    className="btn btn-error" 
                                    disabled={isProcessing}
                                    onClick={()=>document.getElementById('my_modal_5').showModal()}>
                                    <LuTrash className='text-xl font-bold'/>
                                </button>
                            </div>
                        </div>
                        <p className='font-bold text-lg text-black'>
                            Products:
                        </p>
                        <div className='card border-2 w-full'>
                            <div className="overflow-x-auto">
                            <table className="table">
                                {/* head */}
                                <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Product Name</th>
                                    <th>Unit Price</th>
                                    <th>Quantity</th>
                                    <th>Sub Total</th>
                                </tr>
                                </thead>
                                <tbody>
                            {Array.isArray(order.data.order_details) && order.data.order_details.length > 0 ? (
                            order.data.order_details.map((order_detail, index) => (
                                    <tr key={order_detail.order_detail_id} className='hover'>
                                        <th>{index+1}</th>
                                        <td>{order_detail.products.product_name}</td>
                                        <td>{currencyFormat(order_detail.products.unit_price, 'Rp ').format(true) }</td>
                                        <td>{order_detail.quantity}</td>
                                        <td>{currencyFormat(order_detail.sub_total, 'Rp ').format(true) }</td>
                                    </tr>
                            ))
                            ) : (
                                <div className="card-body p-5">
                                    <p>No products found</p>
                                </div>
                            )}
                            <tr>
                                <th colSpan={4} className='text-center'>
                                Total Amount
                                </th>
                                <th>
                                {currencyFormat(order.data.total_amount, 'Rp ').format(true) }
                                </th>
                            </tr>
                            </tbody>
                            </table>
                            </div>
                        </div>
                    </div>
                </div>

                <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
                    <div className="modal-box justify-center">
                        <p className="font-bold text-lg">Are you sure want to delete?</p>
                        <div className="modal-action">
                            <form onSubmit={deleteHadler}>
                                <button type='submit' className="btn btn-error" disabled={isProcessing}>
                                    {isProcessing ? <span className="loading loading-dots loading-sm"></span> : 'Yes'}
                                </button>
                            </form>
                            <form method="dialog">
                                <button className="btn" disabled={isProcessing}>No</button>
                            </form>
                        </div>
                    </div>
                </dialog>
            </div>
        </div>

    )
}

export default Order