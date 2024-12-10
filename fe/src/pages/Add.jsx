import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Select from 'react-select';
import currencyFormat from '../utils/Currency';
import { useNavigate } from 'react-router-dom';

function Add() {
    const [customers, setCustomers] = useState([]);
    const [customer, setCustomer] = useState();
    const [orderDate, setOrderDate] = useState('');
    const [products, setProducts] = useState([]);
    const [error, setError] = useState('');
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
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

        
        const fetchProducts = async () => {
            try {
              const products = await axios.get('http://127.0.0.1:8000/api/products');
              const productsData = products.data.data.map(product => ({
                value: product.product_id,
                label: product.product_name,
                unit_price: product.unit_price,
              }));
              setProducts(productsData);
            } catch (err) {
              const errorMessage = err.products?.data?.message || 'Failed to fetch Products';
              setError(errorMessage);
            } 
          };
          
        fetchCustomers();
        fetchProducts();
    }, []);

    const handleCustomerChange = (selectedOption) => {
        setCustomer(selectedOption.value)
        console.log(customer)
    };

    const handleProductChange = (selectedOption) => {
        const updatedProducts = selectedOption.map(option => {
            const existingProduct = selectedProducts.find(product => product.product_id === option.value);
            return (
                existingProduct || {
                    product_id: option.value,
                    product_name: option.label,
                    unit_price: option.unit_price,
                    quantity: 1,
                    sub_total: option.unit_price,
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
            customer_id: customer,
            order_date: orderDate,
            order_details: selectedProducts.map(product => ({
                product_id: product.product_id,
                quantity: product.quantity
            })),
        };

        try {
          const order = await axios.post('http://127.0.0.1:8000/api/orders', requestData);
          navigate('/');
        } catch (err) {
          const errorMessage = err.response?.data?.message;
          setError(errorMessage);
          setIsProcessing(false);
        } 
    };

    return (
        <div className="card bg-base-100 border-2 m-5">
            <div className="card-body p-5 items-center w-full">
                <p className="card-title text-xl font-bold mb-5">Add Order</p>
                <form onSubmit={handleSubmit} className='w-full'>
                    <div className='mb-3'>
                        <label htmlFor="">Customer</label>
                        <Select
                            classNames={{
                                control: () =>
                                'p-1 rounded-5 w-full',
                            }}
                            classNamePrefix="select"
                            isClearable={true}
                            isSearchable={true}
                            name="customers"
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
                    <div className='mb-3'>
                        <label htmlFor="">Product</label>
                        <Select
                            classNames={{
                                control: (state) =>
                                'p-1 rounded-5 w-full',
                            }}
                            isMulti
                            classNamePrefix="select"
                            isClearable={true}
                            isSearchable={true}
                            name="products"
                            options={products}
                            onChange={handleProductChange}
                        />
                    </div>
                    <div className='card border-2 w-full'>
                        <div className="overflow-x-auto">
                            <table className="table">
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
                                    <tr key={product.product_id} className='hover'>
                                        <th>{index+1}</th>
                                        <td>{product.product_name}</td>
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

export default Add