# Product Order

## Project Description
This project is the development of an Product Order system using React for Frontend and Laravel for Backend. This module is designed to allow users to read, create, update, and delete orders. The database is using Header and Detail table concept to perform normalization in SQL. With normalization, it can reducing data redundancy.
## API Reference

#### Gets all orders

```http
  GET /api/orders
```

#### Get an order by id

```http
  GET /api/orders/:id
```

#### Creates an order

```http
  POST /api/orders
```
    example:
    {
        "customer_id": 1,
    		"order_date": "2024-12-10",
        "order_details": [
            { 
    					"product_id": 2, 
    					"quantity": 12
    				},
            { 
    					"product_id": 2, 
    					"quantity": 12
    				}
        ]
    }

#### Updates an order by id
```http
  PUT /api/orders/:id
```
    example:
    {
        "order_date": "2024-12-07",
        "status": "completed",
        "customer_id": 2,
        "order_details": [
            {
                "product_id": 1,
                "order_detail_id": 6,
                "quantity": 10
            },
            {
                "product_id": 2,
                "order_detail_id": 7,
                "quantity": 10
            }
        ]
    }
    
#### Delete an order by id
```http
  DELETE /api/orders/:id
```
## Installation

Clone repository:

```bash
   git clone https://github.com/AsyrafbilalFBJ/Product-Order.git
```
    
For Frontend
```bash
   cd fe
   npm install
   npm run dev
```

For Backend
```bash
   cd be
```
   create database named {database_name}
   
   duplicate .env.example remane it with .env and edit the DB_DATABASE value with {database_name}
```bash
   composer install
   php artisan migrate
   php artisan db:seed --class=CustomerSeeder
   php artisan db:seed --class=OrderSeeder
   php artisan db:seed --class=ProductSeeder
   php artisan serve
```

## Appendix

run locally in your browser with url from Frontend, by default is http://localhost:5173/
