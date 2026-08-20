import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import OrderSuccess from './pages/OrderSuccess'
import { CartProvider } from './context/CartContext'

function App() {
  return (
    <Router>
      <CartProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/order-success/:id" element={<OrderSuccess />} />
          </Routes>
        </Layout>
      </CartProvider>
    </Router>
  )
}

export default App
