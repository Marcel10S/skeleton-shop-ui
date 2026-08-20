import React from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

function Header({ isMenuOpen, setIsMenuOpen }) {
  const { itemCount } = useCart()

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="text-2xl md:text-3xl font-bold text-blue-600 hover:text-blue-700">
            ShopHub
          </Link>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-700 hover:text-blue-600 focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Przełącz menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-6">
            <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium">
              Strona główna
            </Link>
            <Link to="/shop" className="text-gray-700 hover:text-blue-600 font-medium">
              Sklep
            </Link>
            <Link to="/cart" className="text-gray-700 hover:text-blue-600 font-medium">
              Koszyk
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-blue-600 font-medium">
              Kontakt
            </Link>
          </nav>

          {/* Cart Icon */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/cart" className="relative" aria-label="Otwórz koszyk">
              <svg
                className="w-6 h-6 text-gray-700 hover:text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                {itemCount}
              </span>
            </Link>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden pb-4 space-y-2">
            <Link
              to="/"
              className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded"
              onClick={() => setIsMenuOpen(false)}
            >
              Strona główna
            </Link>
            <Link
              to="/shop"
              className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded"
              onClick={() => setIsMenuOpen(false)}
            >
              Sklep
            </Link>
            <Link
              to="/cart"
              className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded"
              onClick={() => setIsMenuOpen(false)}
            >
              Koszyk
            </Link>
            <Link
              to="/contact"
              className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded"
              onClick={() => setIsMenuOpen(false)}
            >
              Kontakt
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}

export default Header
