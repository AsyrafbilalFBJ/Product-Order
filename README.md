# Invoice Module for Point of Sales System

## Project Description
This project is the development of an invoice module for a web-based Point of Sales (POS) system using React. This module is designed to allow users to create, manage, and organize invoices with pagination features to enhance the user experience in navigating the invoice list.

## Feature
- **Frontend**: 3 pages(Dashboard, Create Invoice, Invoices)
    - Dashboard: show Revenue Graph
    - Create Invoice: user can create invoice
    - Invoices: show invoices with detail

- **Backend**: 6 endpoints(get, Create Invoice, Invoices)
    - GET "/invoices": Gets a list of all invoices
    - GET "/invoices/reports/:graph": Gets a report based on a given graph parameter(daily, weekly, monthly)
    - GET "/invoices/:id": Gets details of a particular invoice based on a given ID
    - POST "/invoice": Creates a new invoice
    - GET "/products": Gets a list of all available products
    - GET "/products-sold/:id": Gets a list of products that have been sold based on an invoice number

## Instalasi
1. Clone repository:
   ```bash
   git clone https://github.com/AsyrafbilalFBJ/Invoice-App.git
   
## For Frontend
2. Change directory ke Frontend:
   ```bash
   cd invoice-app

## For Backend
2. Change directory ke Frontend:
   ```bash
   cd invoice-app-be

3. Install depedencies:
   ```bash
   npm install

4. Run Project:
   ```bash
   npm run dev
