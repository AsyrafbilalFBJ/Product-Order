import React from 'react'
import { LuAlignJustify } from "react-icons/lu";

function Navbar() {
  return (
    <div className="navbar bg-base-100 border-b-2 px-5">
        <div className="flex-1">
            <p className="text-xl font-bold">Product Order</p>
            <label htmlFor="my-drawer-2" className="btn btn-ghost drawer-button lg:hidden ms-2">
                <LuAlignJustify/>
            </label>
        </div>
    </div>
  )
}

export default Navbar