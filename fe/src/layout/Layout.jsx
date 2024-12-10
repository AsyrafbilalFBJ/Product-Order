import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import Footer from '../components/Footer'

function Layout({ children }) {
  return (
    <div>
      <Navbar/>
      <Sidebar children={children}/>
      <Footer/>
    </div>
  )
}

export default Layout