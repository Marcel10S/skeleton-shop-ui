import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { apiService } from '../services/api'

const initialDelivery = {
  courier: 'inpost',
  recipientName: '',
  addressLine: '',
  postalCode: '',
  city: '',
}

function formatPrice(amount, currency) {
  return `${currency} ${amount.toFixed(2)}`
}

function Cart() {
  const navigate = useNavigate()
  const {
    items,
    itemCount,
    totalsByCurrency,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart()
  const [paymentMethods, setPaymentMethods] = useState([])
  const [paymentMethod, setPaymentMethod] = useState('')
  const [delivery, setDelivery] = useState(initialDelivery)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    apiService.getPaymentMethods()
      .then((methods) => {
        setPaymentMethods(methods || [])
        if (methods?.[0]) setPaymentMethod(methods[0].id)
      })
      .catch(() => setMessage({ type: 'error', text: 'Nie udało się wczytać metod płatności.' }))
  }, [])

  const handleDeliveryChange = (event) => {
    const { name, value } = event.target
    setDelivery((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setMessage(null)
    setSubmitting(true)

    try {
      const order = await apiService.createOrder({
        items: items.map((item) => ({ product: item.id, quantity: item.quantity })),
        paymentMethod,
        delivery,
      })
      clearCart()
      navigate(`/order-success/${order.orderNumber}`)
    } catch (error) {
      const responseError = error.response?.data?.error
      setMessage({
        type: 'error',
        text: responseError || 'Nie udało się złożyć zamówienia. Spróbuj ponownie.',
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl py-16 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-blue-600">
          <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-2.3 2.3c-.6.6-.2 1.7.7 1.7H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h1 className="mb-3 text-3xl font-bold text-gray-900">Twój koszyk jest pusty</h1>
        <p className="mb-8 text-gray-600">Dodaj produkty, aby przejść do zamówienia.</p>
        <Link to="/" className="inline-flex rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700">
          Przejdź do sklepu
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="mb-1 text-sm font-semibold uppercase tracking-wide text-blue-600">ShopHub</p>
          <h1 className="text-3xl font-bold text-gray-900">Koszyk</h1>
        </div>
        <span className="text-sm text-gray-500">{itemCount} {itemCount === 1 ? 'produkt' : 'produktów'}</span>
      </div>

      {message && (
        <div className={`mb-6 rounded-lg border px-4 py-3 ${message.type === 'error' ? 'border-red-200 bg-red-50 text-red-700' : 'border-green-200 bg-green-50 text-green-700'}`}>
          {message.text}
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
        <section className="space-y-4">
          {items.map((item) => (
            <article key={item.id} className="flex gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-100">
                {item.image ? <img src={item.image} alt={item.name} className="h-full w-full object-cover" /> : <span className="text-xs text-gray-400">Brak zdjęcia</span>}
              </div>
              <div className="min-w-0 flex-1">
                <Link to={`/product/${item.id}`} className="font-semibold text-gray-900 hover:text-blue-600">{item.name}</Link>
                <p className="mt-1 text-sm text-gray-500">{formatPrice(item.price?.amount || 0, item.price?.currency || 'USD')} / szt.</p>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <label className="text-sm text-gray-600" htmlFor={`quantity-${item.id}`}>Ilość</label>
                  <input id={`quantity-${item.id}`} type="number" min="1" max={item.stock} value={item.quantity} onChange={(event) => updateQuantity(item.id, Number(event.target.value))} className="w-20 rounded-lg border border-gray-300 px-3 py-1.5" />
                  <button type="button" onClick={() => removeFromCart(item.id)} className="text-sm font-medium text-red-600 hover:text-red-700">Usuń</button>
                </div>
              </div>
              <strong className="shrink-0 text-right text-gray-900">{formatPrice((item.price?.amount || 0) * item.quantity, item.price?.currency || 'USD')}</strong>
            </article>
          ))}
        </section>

        <form onSubmit={handleSubmit} className="h-fit space-y-5 rounded-xl border border-gray-200 bg-white p-5 shadow-sm lg:sticky lg:top-24">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Dane dostawy</h2>
            <p className="mt-1 text-sm text-gray-500">Uzupełnij dane, aby złożyć zamówienie.</p>
          </div>
          <select name="courier" value={delivery.courier} onChange={handleDeliveryChange} className="w-full rounded-lg border border-gray-300 px-3 py-2.5">
            <option value="inpost">InPost</option>
            <option value="dpd">DPD</option>
          </select>
          {[
            ['recipientName', 'Imię i nazwisko'],
            ['addressLine', 'Ulica i numer'],
            ['postalCode', 'Kod pocztowy'],
            ['city', 'Miasto'],
          ].map(([name, label]) => (
            <label key={name} className="block text-sm font-medium text-gray-700">
              {label}
              <input required name={name} value={delivery[name]} onChange={handleDeliveryChange} className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2.5 font-normal" />
            </label>
          ))}
          <label className="block text-sm font-medium text-gray-700">
            Metoda płatności
            <select required value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)} className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2.5 font-normal">
              <option value="" disabled>Wybierz metodę</option>
              {paymentMethods.map((method) => <option key={method.id} value={method.id}>{method.name}</option>)}
            </select>
          </label>
          <div className="border-t border-gray-100 pt-4">
            <h3 className="mb-3 font-semibold text-gray-900">Podsumowanie</h3>
            {Object.entries(totalsByCurrency).map(([currency, amount]) => (
              <div key={currency} className="flex justify-between text-lg font-bold text-gray-900"><span>Razem ({currency})</span><span>{formatPrice(amount, currency)}</span></div>
            ))}
          </div>
          <button type="submit" disabled={submitting || !paymentMethod} className="w-full rounded-lg bg-blue-600 px-4 py-3 font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400">
            {submitting ? 'Składanie zamówienia...' : 'Złóż zamówienie'}
          </button>
          <button type="button" onClick={clearCart} className="w-full text-sm text-gray-500 hover:text-red-600">Wyczyść koszyk</button>
        </form>
      </div>
    </div>
  )
}

export default Cart
