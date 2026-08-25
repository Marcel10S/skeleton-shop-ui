import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { apiService } from '../services/api'
import { useCart } from '../context/CartContext'

function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { addToCart } = useCart()

  useEffect(() => {
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await apiService.getProductById(id)
      
      // API already returns properly formatted data with prices divided by 100
      setProduct(data)
    } catch (err) {
      setError('Nie udało się wczytać szczegółów produktu.')
      console.error('Error fetching product:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async () => {
    await addToCart(product, quantity)
  }

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value)
    setQuantity(Math.max(1, Math.min(value, product?.stock || 1)))
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Wczytywanie produktu...</p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Nie znaleziono produktu</h2>
        <p className="text-gray-600 mb-6">{error || 'Produkt, którego szukasz, nie istnieje.'}</p>
        <button
          onClick={() => navigate('/')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg"
        >
          Wróć na stronę główną
        </button>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Breadcrumb */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/')}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Wróć do produktów
        </button>
      </div>

      {/* Product Detail */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Image */}
        <div className="flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden min-h-96">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <svg
              className="w-32 h-32 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          )}
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            {product.name}
          </h1>

          {/* Rating and Reviews */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-5 h-5 ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-gray-600">(128 opinii)</span>
          </div>

          {/* Price */}
          <div className="mb-6">
            <div className="flex items-baseline gap-4">
              <span className="text-4xl font-bold text-blue-600">
                {product.price?.currency || 'USD'} {(product.price?.amount || 0).toFixed(2)}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Opis</h3>
            <p className="text-gray-600 leading-relaxed">
              {product.description || 'Brak dostępnego opisu'}
            </p>
          </div>

          {/* Add to Cart Section */}
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            {/* Stock Status */}
            <div className="mb-4">
              {product.stock > 0 ? (
                <span className="text-green-600 font-semibold">
                  ✓ Dostępny ({product.stock} szt. w magazynie)
                </span>
              ) : (
                <span className="text-red-600 font-semibold">Niedostępny</span>
              )}
            </div>

            {/* Quantity Selector */}
            {product.stock > 0 && (
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Ilość:
                </label>
                <select
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  {[...Array(Math.min(10, product.stock))].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {product.stock > 0 ? 'Dodaj do koszyka' : 'Niedostępny'}
            </button>

            {/* Additional Options */}
            <div className="mt-4 flex gap-2">
              <button className="flex-1 border-2 border-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors">
                ♡ Lista życzeń
              </button>
              <button className="flex-1 border-2 border-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors">
                Udostępnij
              </button>
            </div>
          </div>

          {/* Shipping & Returns */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-3">Dostawa i zwroty</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>✓ Darmowa dostawa dla zamówień powyżej 50 USD</li>
              <li>✓ 30 dni na zwrot</li>
              <li>✓ Bezpieczne płatności</li>
              <li>✓ Roczna gwarancja</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      <section className="mt-16 pt-12 border-t-2">
        <h2 className="text-2xl md:text-3xl font-bold mb-8">Podobne produkty</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Placeholder for related products */}
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow-md p-4 text-center text-gray-500"
            >
              <p>Podobny produkt {i + 1}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default ProductDetail
