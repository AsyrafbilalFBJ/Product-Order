import React from 'react'
import { LuListTodo, LuSquarePlus } from "react-icons/lu";
import { Link } from 'react-router-dom';

function Sidebar({ children }) {
  const currentPath = window.location.pathname;

  return (
    <div className="drawer lg:drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col max-lg:h-screen">
            {/* Page content here */}
            {children}
        </div>
        <div className="drawer-side border-r-2">
            <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
            <ul className="menu bg-white text-base-content min-h-full w-64 p-4">
              <li >
                <Link to="/" className={`btn justify-start ${currentPath === '/' ? 'btn-neutral' : 'btn-ghost'}`}>
                  <LuListTodo />Orders
                </Link>
              </li>
              <li>
                <Link to="/orders/create" className={`btn justify-start ${currentPath === '/orders/create' ? 'btn-neutral' : 'btn-ghost'}`}>
                  <LuSquarePlus />Add Order
                </Link>
              </li>
            </ul>
        </div>
    </div>
  )
}

export default Sidebar