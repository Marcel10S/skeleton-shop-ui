import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Shop from './pages/Shop'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import OrderSuccess from './pages/OrderSuccess'
import OrderLookup from './pages/OrderLookup'
import InfoPage from './pages/InfoPage'
import { CartProvider } from './context/CartContext'

function App() {
  return (
    <Router>
      <CartProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/order-success/:id" element={<OrderSuccess />} />
            <Route path="/check-order" element={<OrderLookup />} />
            <Route path="/about" element={<InfoPage page="about" />} />
            <Route path="/help" element={<InfoPage page="help" />} />
            <Route path="/contact" element={<InfoPage page="contact" />} />
            <Route path="/faq" element={<InfoPage page="faq" />} />
            <Route path="/privacy" element={<InfoPage page="privacy" />} />
            <Route path="/terms" element={<InfoPage page="terms" />} />
          </Routes>
        </Layout>
      </CartProvider>
    </Router>
  )
}

export default App
