import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Select from 'react-select';
import currencyFormat from '../utils/Currency';
import { useNavigate, useParams } from 'react-router-dom';

function Edit( {  } ) {
    const { id } = useParams();
    const [customers, setCustomers] = useState([]);
    const [customer, setCustomer] = useState();
    const [status, setStatus] = useState();
    const [orderDate, setOrderDate] = useState('');
    const [error, setError] = useState('');
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCustomers = async () => {
          try {
            const customers = await axios.get('http://127.0.0.1:8000/api/customers');
            
            const customersData = customers.data.data.map(customer => ({
              value: customer.customer_id,
              label: customer.customer_name,
            }));
            
            setCustomers(customersData);
          } catch (err) {
            const errorMessage = err.customers?.data?.message || 'Failed to fetch Customers';
            setError(errorMessage);
          } 
        };
        
        const fetchOrder = async () => {
            try {
              const response = await axios.get(`http://127.0.0.1:8000/api/orders/${id}`);
              const productsData = response.data.data.order_details.map(product => ({
                value: product.products.product_id,
                label: product.products.product_name,
                unit_price: product.products.unit_price,
                quantity: product.quantity,
                order_detail_id: product.order_detail_id,
                sub_total: product.sub_total,
                product_id: product.products.product_id,
              }));
              setCustomer({
                label: response.data.data.customer.customer_name,
                value: response.data.data.customer_id
              });
              setOrderDate(response.data.data.order_date);
              setSelectedProducts(productsData);
              setStatus(response.data.data.status == "completed" ? true : false);
            } catch (err) {
              const errorMessage = err.response?.data?.message || 'Failed to fetch order';
              setError(errorMessage);
            } finally {
                setIsLoading(false);
            }
        };
          
        fetchOrder();
        fetchCustomers();
    }, []);
    
    const handleCustomerChange = (selectedOption) => {
        setCustomer({
            label: selectedOption.label,
            value: selectedOption.value
        })
    };

    const handleProductChange = (selectedOption) => {
        const updatedProducts = selectedOption.map(option => {
            const existingProduct = selectedProducts.find(product => product.product_id === option.value);
            return (
                existingProduct || {
                    product_id: option.value,
                    product_name: option.label,
                    value: option.value,
                    label: option.label,
                    unit_price: option.unit_price,
                    order_detail_id: option.order_detail_id,
                    quantity: 1,
                }
            );
        });

        setSelectedProducts(updatedProducts);
    };
    
    const handleQuantityChange = (productId, quantity) => {
        const updatedProducts = selectedProducts.map(product =>
            product.product_id === productId
                ? { ...product, quantity: quantity, sub_total: quantity * product.unit_price }
                : product
        );
        setSelectedProducts(updatedProducts);
    };

    const totalAmount = selectedProducts.reduce((total, product) => total + (product.sub_total || 0), 0);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsProcessing(true);
    
        const requestData = {
            customer_id: customer.value,
            order_date: orderDate,
            status: status == true ? "completed" : "uncompleted",
            order_details: selectedProducts.map(product => ({
                product_id: product.product_id,
                order_detail_id: product.order_detail_id,
                quantity: product.quantity
            })),
        };
        console.log(requestData)
        try {
          const order = await axios.put(`http://127.0.0.1:8000/api/orders/${id}`, requestData);
          navigate(`/orders/${id}`);
        } catch (err) {
          const errorMessage = err.response?.data?.message;
          setError(errorMessage);
          setIsProcessing(false);
        } 
    };
    
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
                <p className="card-title text-xl font-bold mb-5">Edit Order</p>
                <form onSubmit={handleSubmit} className='w-full'>
                    <div className='mb-3'>
                        <label htmlFor="">Customer</label>
                        <Select
                            classNames={{
                                control: () =>
                                'p-1 rounded-5 w-full',
                            }}
                            classNamePrefix="select"
                            defaultValue={{ label: customer.label, value: customer.value }}
                            isClearable={true}
                            isSearchable={true}
                            name="customer"
                            options={customers}
                            onChange={handleCustomerChange}
                        />
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="">Order Date</label>
                        <input 
                            type="date" 
                            className="input input-bordered rounded-md focus:outline-none focus:border-blue-500 focus:border-2 w-full" 
                            value={orderDate}
                            onChange={(e) => setOrderDate(e.target.value)}
                        />
                    </div>
                    <div className="my-3">
                        <label className="flex items-center gap-2">
                            <input 
                                type="checkbox" 
                                className="checkbox checkbox-success"
                                checked={status} 
                                onChange={(e) => setStatus(e.target.checked)}/>
                            <span className="">Completed</span>
                        </label>
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="">Product</label>
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
                                    {selectedProducts.map((product, index) => (
                                        <tr key={product.value} className='hover'>
                                            <th>{index+1}</th>
                                            <td>{product.label}</td>
                                            <td>{currencyFormat(product.unit_price, 'Rp ').format(true)}</td>
                                            <td>
                                                <input
                                                    type="number"
                                                    value={product.quantity}
                                                    min="1"
                                                    onChange={(e) =>
                                                        handleQuantityChange(product.product_id, parseInt(e.target.value) || 1)
                                                    }
                                                    className="w-full text-center border border-gray-300 p-1 rounded"
                                                />
                                            </td>
                                            <td>{currencyFormat((product.quantity * product.unit_price), 'Rp ').format(true)}</td>
                                        </tr>
                                    ))}
                                        <tr>
                                            <th colSpan={4} className='text-center'>
                                                Total Amount
                                            </th>
                                            <th>
                                                {currencyFormat(totalAmount, 'Rp ').format(true) }
                                            </th>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <button 
                        type='submit' 
                        className="btn btn-info w-full mt-5"
                        disabled={isProcessing}
                    >
                        {isProcessing ? <span className="loading loading-dots loading-sm"></span> : 'Submit'}
                    </button>
                    <p className='text-red-400'>{error}</p>
                </form>
            </div>
        </div>
    )
}

export default Edit