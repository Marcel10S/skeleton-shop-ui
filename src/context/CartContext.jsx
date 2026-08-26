import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { apiService } from '../services/api'

const STORAGE_KEY = 'shop-skeleton-ui-cart'
const CART_ID_KEY = 'shop-skeleton-ui-cart-id'
const CartContext = createContext(null)

function readStoredCart() {
  try {
    const storedCart = window.localStorage.getItem(STORAGE_KEY)
    return storedCart ? JSON.parse(storedCart) : []
  } catch {
    return []
  }
}

function readStoredCartId() {
  try {
    return window.localStorage.getItem(CART_ID_KEY)
  } catch {
    return null
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(readStoredCart)
  const [cartId, setCartId] = useState(readStoredCartId)
  const [isLoading, setIsLoading] = useState(false)

  const discardExpiredCart = () => {
    window.localStorage.removeItem(CART_ID_KEY)
    window.localStorage.removeItem(STORAGE_KEY)
    setCartId(null)
    setItems([])
  }

  const createFreshCart = async () => {
    const response = await apiService.createCart()
    setCartId(response.id)
    window.localStorage.setItem(CART_ID_KEY, response.id)
    syncCartFromApi(response)
    return response.id
  }

  // Initialize cart on mount
  useEffect(() => {
    const initCart = async () => {
      try {
        setIsLoading(true)
        if (cartId) {
          try {
            const response = await apiService.getCart(cartId)
            if (response) {
              syncCartFromApi(response)
            }
          } catch (error) {
            if (error.response?.status !== 404) throw error
            discardExpiredCart()
            await createFreshCart()
          }
        } else {
          await createFreshCart()
        }
      } catch (error) {
        console.warn('Failed to sync cart with backend, using local storage:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initCart()
  }, [])

  // Sync local storage when items change
  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const syncCartFromApi = (apiCart) => {
    if (apiCart && apiCart.items) {
      setItems(apiCart.items.map(item => ({
        id: item.productId,
        name: item.productName,
        quantity: item.quantity,
        stock: item.stock,
        price: item.price,
      })))
    }
  }

  const ensureCartId = async () => {
    return cartId || createFreshCart()
  }

  const addToCart = async (product, quantity = 1) => {
    // Optimistic update
    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === product.id)
      const nextQuantity = Math.min(
        (existingItem?.quantity || 0) + quantity,
        product.stock,
      )

      if (existingItem) {
        return currentItems.map((item) => (
          item.id === product.id ? { ...item, quantity: nextQuantity } : item
        ))
      }

      return [...currentItems, { ...product, quantity: Math.min(quantity, product.stock) }]
    })

    // Sync with API
    try {
      const activeCartId = cartId || await ensureCartId()
      if (activeCartId) {
        const response = await apiService.addToCart(activeCartId, product.id, quantity)
        if (response) {
          syncCartFromApi(response)
        }
      }
    } catch (error) {
      if (error.response?.status === 404) {
        try {
          const freshCartId = await createFreshCart()
          const response = await apiService.addToCart(freshCartId, product.id, quantity)
          syncCartFromApi(response)
          return
        } catch (retryError) {
          console.error('Failed to recreate expired cart:', retryError)
        }
      }
      console.error('Failed to add item to cart on backend:', error)
      // Revert optimistic update on error
      setItems((currentItems) => {
        const existingItem = currentItems.find((item) => item.id === product.id)
        if (existingItem && existingItem.quantity > quantity) {
          return currentItems.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity - quantity }
              : item
          )
        }
        return currentItems.filter((item) => item.id !== product.id)
      })
    }
  }

  const updateQuantity = async (productId, quantity) => {
    const currentItem = items.find((item) => item.id === productId)
    if (!currentItem) return

    // Optimistic update
    if (quantity <= 0) {
      setItems((currentItems) => currentItems.filter((item) => item.id !== productId))
    } else {
      setItems((currentItems) =>
        currentItems.map((item) =>
          item.id === productId
            ? { ...item, quantity: Math.min(quantity, item.stock) }
            : item
        )
      )
    }

    // Sync with API
    try {
      const activeCartId = cartId || await ensureCartId()
      if (activeCartId) {
        // Find cart item ID from backend
        const cartResponse = await apiService.getCart(activeCartId)
        const cartItem = cartResponse?.items?.find((item) => item.productId === productId)
        
        if (cartItem) {
          const response = await apiService.updateCartItem(activeCartId, cartItem.id, quantity)
          if (response) {
            syncCartFromApi(response)
          }
        }
      }
    } catch (error) {
      if (error.response?.status === 404) discardExpiredCart()
      console.error('Failed to update item quantity on backend:', error)
      // Revert to previous quantity
      setItems((currentItems) =>
        currentItems.map((item) =>
          item.id === productId
            ? { ...item, quantity: currentItem.quantity }
            : item
        )
      )
    }
  }

  const removeFromCart = async (productId) => {
    const currentItem = items.find((item) => item.id === productId)

    // Optimistic update
    setItems((currentItems) => currentItems.filter((item) => item.id !== productId))

    // Sync with API
    try {
      const activeCartId = cartId || await ensureCartId()
      if (activeCartId) {
        // Find cart item ID from backend
        const cartResponse = await apiService.getCart(activeCartId)
        const cartItem = cartResponse?.items?.find((item) => item.productId === productId)
        
        if (cartItem) {
          const response = await apiService.removeCartItem(activeCartId, cartItem.id)
          if (response) {
            syncCartFromApi(response)
          }
        }
      }
    } catch (error) {
      if (error.response?.status === 404) discardExpiredCart()
      console.error('Failed to remove item from cart on backend:', error)
      // Revert optimistic update
      if (currentItem) {
        setItems((currentItems) => [...currentItems, currentItem])
      }
    }
  }

  const clearCart = async () => {
    // Optimistic update
    setItems([])

    // Sync with API
    try {
      const activeCartId = cartId || await ensureCartId()
      if (activeCartId) {
        const response = await apiService.clearCart(activeCartId)
        if (response) {
          syncCartFromApi(response)
        }
      }
    } catch (error) {
      if (error.response?.status === 404) discardExpiredCart()
      console.error('Failed to clear cart on backend:', error)
    }
  }

  const completeCheckout = () => {
    setItems([])
  }

  const itemCount = items.reduce((total, item) => total + item.quantity, 0)
  const totalsByCurrency = items.reduce((totals, item) => {
    const currency = item.price?.currency || 'USD'
    const amount = (item.price?.amount || 0) * item.quantity
    return { ...totals, [currency]: (totals[currency] || 0) + amount }
  }, {})

  const value = useMemo(() => ({
    items,
    cartId,
    itemCount,
    totalsByCurrency,
    isLoading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    completeCheckout,
  }), [items, cartId, itemCount, totalsByCurrency, isLoading])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart musi być użyty wewnątrz CartProvider')
  }
  return context
}
