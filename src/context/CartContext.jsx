import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'shophub-cart'
const CartContext = createContext(null)

function readStoredCart() {
  try {
    const storedCart = window.localStorage.getItem(STORAGE_KEY)
    return storedCart ? JSON.parse(storedCart) : []
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(readStoredCart)

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const addToCart = (product, quantity = 1) => {
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
  }

  const updateQuantity = (productId, quantity) => {
    setItems((currentItems) => currentItems
      .map((item) => item.id === productId
        ? { ...item, quantity: Math.max(0, Math.min(quantity, item.stock)) }
        : item)
      .filter((item) => item.quantity > 0))
  }

  const removeFromCart = (productId) => {
    setItems((currentItems) => currentItems.filter((item) => item.id !== productId))
  }

  const clearCart = () => setItems([])

  const itemCount = items.reduce((total, item) => total + item.quantity, 0)
  const totalsByCurrency = items.reduce((totals, item) => {
    const currency = item.price?.currency || 'USD'
    const amount = (item.price?.amount || 0) * item.quantity
    return { ...totals, [currency]: (totals[currency] || 0) + amount }
  }, {})

  const value = useMemo(() => ({
    items,
    itemCount,
    totalsByCurrency,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  }), [items, itemCount, totalsByCurrency])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart musi być użyty wewnątrz CartProvider')
  }
  return context
}
