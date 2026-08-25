import React from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

function ProductCard({ product }) {
  const { addToCart } = useCart()

  return (
    <Link to={`/product/${product.id}`} className="block h-full">
      <div className="flex h-full flex-col overflow-hidden rounded-lg bg-white shadow-md transition-shadow hover:shadow-xl">
        {/* Product Image */}
        <div className="bg-gray-200 h-48 md:h-56 lg:h-64 overflow-hidden flex items-center justify-center">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              draggable="false"
              onDragStart={(event) => event.preventDefault()}
              className="h-full w-full object-cover transition-transform hover:scale-105"
            />
          ) : (
            <svg
              className="w-24 h-24 text-gray-400"
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
        <div className="flex flex-1 flex-col p-4">
          <h3 title={product.name} className="mb-2 min-h-[3.5rem] overflow-hidden text-lg font-semibold leading-7 text-gray-800 line-clamp-2">
            {product.name}
          </h3>
          <p title={product.description || ''} className="mb-4 min-h-[2.5rem] overflow-hidden text-sm leading-5 text-gray-600 line-clamp-2">
            {product.description}
          </p>

          {/* Price */}
          <div>
            <div>
              <p className="text-2xl font-bold leading-8 text-blue-600">
                {product.price?.currency || 'USD'} {(product.price?.amount || 0).toFixed(2)}
              </p>
            </div>

            {/* Stock Status */}
            <div className="mt-1 min-h-6">
              {product.stock > 0 ? (
                <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded">
                  Dostępny
                </span>
              ) : (
                <span className="text-xs font-semibold text-red-600 bg-red-100 px-2 py-1 rounded">
                  Niedostępny
                </span>
              )}
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={(e) => {
              e.preventDefault()
              addToCart(product)
            }}
            disabled={product.stock === 0}
            className="mt-auto w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            Dodaj do koszyka
          </button>
        </div>
      </div>
    </Link>
  )
}

export default ProductCard
