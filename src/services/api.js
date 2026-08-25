import axios from 'axios'

// Configure API base URL - requests will go through Vite proxy to avoid CORS issues
// Vite proxy forwards /api/* requests to http://localhost:81/api/*
const API_BASE_URL = '/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// API endpoints
export const apiService = {
  // Products
  getProducts: async (params = {}) => {
    try {
      const response = await api.get('/products', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching products:', error)
      throw error
    }
  },

  getProductById: async (id) => {
    try {
      const response = await api.get(`/products/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching product:', error)
      throw error
    }
  },

  createProduct: async (productData) => {
    try {
      const response = await api.post('/products', productData)
      return response.data
    } catch (error) {
      console.error('Error creating product:', error)
      throw error
    }
  },

  updateProduct: async (id, productData) => {
    try {
      const response = await api.put(`/products/${id}`, productData)
      return response.data
    } catch (error) {
      console.error('Error updating product:', error)
      throw error
    }
  },

  deleteProduct: async (id) => {
    try {
      const response = await api.delete(`/products/${id}`)
      return response.data
    } catch (error) {
      console.error('Error deleting product:', error)
      throw error
    }
  },

  // Categories
  getCategories: async (params = {}) => {
    try {
      const response = await api.get('/categories', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching categories:', error)
      throw error
    }
  },

  getCategoryById: async (id) => {
    try {
      const response = await api.get(`/categories/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching category:', error)
      throw error
    }
  },

  // Orders
  getOrders: async (params = {}) => {
    try {
      const response = await api.get('/orders', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching orders:', error)
      throw error
    }
  },

  createOrder: async (orderData) => {
    try {
      const response = await api.post('/orders', orderData)
      return response.data
    } catch (error) {
      console.error('Error creating order:', error)
      throw error
    }
  },

  getOrderByNumber: async (orderNumber) => {
    try {
      const response = await api.get(`/orders/${encodeURIComponent(orderNumber)}`)
      return response.data
    } catch (error) {
      console.error('Error fetching order:', error)
      throw error
    }
  },

  getPaymentMethods: async () => {
    try {
      const response = await api.get('/payment-methods')
      return response.data
    } catch (error) {
      console.error('Error fetching payment methods:', error)
      throw error
    }
  },

  // Cart
  createCart: async () => {
    try {
      const response = await api.post('/carts', {})
      return response.data
    } catch (error) {
      console.error('Error creating cart:', error)
      throw error
    }
  },

  getCart: async (cartId) => {
    try {
      const response = await api.get(`/carts/${cartId}`)
      return response.data
    } catch (error) {
      console.error('Error fetching cart:', error)
      throw error
    }
  },

  getCartByToken: async (token) => {
    try {
      const response = await api.get(`/carts/token/${token}`)
      return response.data
    } catch (error) {
      console.error('Error fetching cart by token:', error)
      throw error
    }
  },

  addToCart: async (cartId, productId, quantity = 1) => {
    try {
      const response = await api.post(`/carts/${cartId}/items`, {
        productId,
        quantity,
      })
      return response.data
    } catch (error) {
      console.error('Error adding item to cart:', error)
      throw error
    }
  },

  removeCartItem: async (cartId, itemId) => {
    try {
      const response = await api.delete(`/carts/${cartId}/items/${itemId}`)
      return response.data
    } catch (error) {
      console.error('Error removing cart item:', error)
      throw error
    }
  },

  updateCartItem: async (cartId, itemId, quantity) => {
    try {
      const response = await api.put(`/carts/${cartId}/items/${itemId}`, {
        quantity,
      })
      return response.data
    } catch (error) {
      console.error('Error updating cart item:', error)
      throw error
    }
  },

  clearCart: async (cartId) => {
    try {
      const response = await api.post(`/carts/${cartId}/clear`)
      return response.data
    } catch (error) {
      console.error('Error clearing cart:', error)
      throw error
    }
  },
}

export default api
