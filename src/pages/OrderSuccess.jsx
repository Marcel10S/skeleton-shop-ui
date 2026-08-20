import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { apiService } from '../services/api'

function OrderSuccess() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)

  useEffect(() => {
    apiService.getOrderByNumber(id).then(setOrder).catch(() => {})
  }, [id])

  return (
    <div className="mx-auto max-w-2xl py-16 text-center">
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600">
        <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 className="mb-3 text-3xl font-bold text-gray-900">Zamówienie złożone</h1>
      <p className="mb-2 text-gray-600">Dziękujemy za zakupy w ShopHub.</p>
      <p className="mb-2 text-sm text-gray-500">Numer zamówienia: <strong>{order?.orderNumber || id}</strong></p>
      {order?.total && <p className="mb-8 text-lg font-bold text-blue-600">Suma: {order.total.currency} {order.total.amount.toFixed(2)}</p>}
      {!order?.total && <div className="mb-8" />}
      <Link to="/" className="inline-flex rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700">
        Wróć do sklepu
      </Link>
    </div>
  )
}

export default OrderSuccess
