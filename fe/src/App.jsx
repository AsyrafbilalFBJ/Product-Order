import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Add from './pages/Add'
import Order from './pages/Order'
import Edit from './pages/Edit'
import Layout from './layout/Layout'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout children={<Home />} />} />
        <Route path='/orders/:id' element={<Layout children={<Order />} />} />
        <Route path='/orders/create' element={<Layout children={<Add />} />} />
        <Route path='/orders/:id/edit' element={<Layout children={<Edit />} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
