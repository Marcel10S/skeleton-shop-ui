import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { apiService } from '../services/api'

function formatStatus(status) {
  return status === 'paid' ? 'Opłacone' : 'Oczekuje na płatność'
}

function OrderLookup() {
  const [orderNumber, setOrderNumber] = useState('')
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (event) => {
    event.preventDefault()
    const normalizedNumber = orderNumber.trim().toUpperCase()
    if (!normalizedNumber) return

    setLoading(true)
    setError(null)
    setOrder(null)

    try {
      setOrder(await apiService.getOrderByNumber(normalizedNumber))
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'Nie udało się znaleźć zamówienia.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8 max-w-xl">
        <p className="mb-1 text-sm font-semibold uppercase tracking-wide text-blue-600">ShopHub</p>
        <h1 className="text-3xl font-bold text-gray-900">Sprawdź zamówienie</h1>
        <p className="mt-2 text-gray-600">Wpisz czytelny numer zamówienia, aby zobaczyć jego status i szczegóły.</p>
      </div>

      <form onSubmit={handleSubmit} className="mb-8 flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:flex-row">
        <label className="sr-only" htmlFor="order-number">Numer zamówienia</label>
        <input
          id="order-number"
          value={orderNumber}
          onChange={(event) => setOrderNumber(event.target.value)}
          placeholder="np. SH-20260820-1A2B3C4D"
          className="min-w-0 flex-1 rounded-lg border border-gray-300 px-4 py-3 uppercase focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
        <button type="submit" disabled={loading || !orderNumber.trim()} className="rounded-lg bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400">
          {loading ? 'Sprawdzanie...' : 'Sprawdź'}
        </button>
      </form>

      {error && <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">{error}</div>}

      {order && (
        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-6 flex flex-wrap items-start justify-between gap-4 border-b border-gray-100 pb-5">
            <div>
              <p className="text-sm text-gray-500">Numer zamówienia</p>
              <h2 className="text-2xl font-bold tracking-wide text-gray-900">{order.orderNumber}</h2>
              <p className="mt-1 text-sm text-gray-500">{new Date(order.createdAt).toLocaleString('pl-PL')}</p>
            </div>
            <span className="rounded-full bg-amber-100 px-3 py-1.5 text-sm font-semibold text-amber-800">{formatStatus(order.status)}</span>
          </div>

          <div className="mb-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg bg-blue-50 p-4">
              <p className="text-sm text-gray-600">Suma zamówienia</p>
              <p className="mt-1 text-2xl font-bold text-blue-700">{order.total.currency} {order.total.amount.toFixed(2)}</p>
              <p className="mt-1 text-xs text-gray-500">W walucie domyślnej sklepu</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm text-gray-600">Dostawa i płatność</p>
              <p className="mt-1 font-semibold text-gray-900">{order.delivery?.courier?.toUpperCase()}</p>
              <p className="text-sm text-gray-600">{order.paymentMethod}</p>
              <p className="text-sm text-gray-600">{order.delivery?.city}</p>
            </div>
          </div>

          <h3 className="mb-3 text-lg font-bold text-gray-900">Produkty</h3>
          <div className="divide-y divide-gray-100">
            {order.items.map((item) => (
              <div key={`${item.name}-${item.quantity}`} className="flex justify-between gap-4 py-3 text-sm">
                <span className="text-gray-700">{item.name} <span className="text-gray-400">× {item.quantity}</span></span>
                <span className="shrink-0 font-semibold text-gray-900">{item.currency} {(item.unitAmount * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <Link to="/" className="mt-8 inline-block text-sm font-semibold text-blue-600 hover:text-blue-700">← Wróć do sklepu</Link>
    </div>
  )
}

export default OrderLookup
