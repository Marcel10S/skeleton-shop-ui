import React from 'react'
import { Link } from 'react-router-dom'

function ProductCard({ product }) {
  return (
    <Link to={`/product/${product.id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden h-full">
        {/* Product Image */}
        <div className="bg-gray-200 h-48 md:h-56 lg:h-64 overflow-hidden flex items-center justify-center">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform"
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
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 mb-2">
            {product.name}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2 mb-4">
            {product.description}
          </p>

          {/* Price */}
          <div className="flex items-end justify-between">
            <div>
              <p className="text-2xl font-bold text-blue-600">
                {product.price?.currency || 'USD'} {(product.price?.amount || 0).toFixed(2)}
              </p>
            </div>

            {/* Stock Status */}
            <div className="text-right">
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
              // TODO: Add to cart functionality
            }}
            disabled={product.stock === 0}
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Dodaj do koszyka
          </button>
        </div>
      </div>
    </Link>
  )
}

export default ProductCard
