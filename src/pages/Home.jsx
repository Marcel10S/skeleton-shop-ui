import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ProductCarousel from '../components/ProductCarousel'
import CategoryTree from '../components/CategoryTree'
import { apiService } from '../services/api'

function Home() {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Fetch categories
      try {
        const categoriesData = await apiService.getCategories()
        setCategories(categoriesData || [])
      } catch (err) {
        console.warn('Could not fetch categories:', err)
      }

      // Fetch products
      const productsData = await apiService.getProducts()
      // API already returns formatted prices (divided by 100)
      setProducts(productsData || [])
    } catch (err) {
      setError('Nie udało się wczytać produktów. Spróbuj ponownie później.')
      console.error('Error fetching data:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryFilter = (categoryId, categoryIds = []) => {
    if (!categoryId) {
      navigate('/shop')
      return
    }

    const parameters = new URLSearchParams({
      category: categoryId,
      categories: categoryIds.join(','),
    })
    navigate(`/shop?${parameters.toString()}`)
  }

  const filteredProducts = selectedCategory
    ? products.filter((product) => (
      selectedCategoryIds.includes(product.category?.id || product.categoryId)
    ))
    : products
  const featuredProducts = [...filteredProducts]
    .sort((first, second) => (second.priority || 1) - (first.priority || 1))
    .slice(0, 6)

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Wczytywanie produktów...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12 md:py-20 mb-12 rounded-lg">
        <div className="text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Witamy w Shop Skeleton UI</h1>
          <p className="text-lg md:text-xl text-blue-100 mb-8">
            Odkryj wyjątkowe produkty w najlepszych cenach
          </p>
          <button className="bg-white text-blue-600 font-bold py-3 px-8 rounded-lg hover:bg-blue-50 transition-colors">
            Zacznij zakupy
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[250px_minmax(0,1fr)] lg:gap-10">
        {categories.length > 0 && (
          <CategoryTree
            categories={categories}
            totalProducts={products.length}
            selectedCategory={selectedCategory}
            onSelect={handleCategoryFilter}
          />
        )}

        {/* Products Grid */}
        <section className="min-w-0">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="mb-1 text-sm font-semibold uppercase tracking-wide text-blue-600">Shop Skeleton UI</p>
              <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
                {selectedCategory ? 'Produkty z kategorii' : 'Polecane produkty'}
              </h2>
            </div>
            <span className="text-sm text-gray-500">
              {featuredProducts.length} {featuredProducts.length === 1 ? 'produkt' : 'produktów'}
            </span>
          </div>

          {error && (
            <div className="mb-6 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
              {error}
            </div>
          )}

          {featuredProducts.length > 0 ? (
            <ProductCarousel products={featuredProducts} label="Nasi ulubieńcy dnia" />
          ) : (
            <div className="py-12 text-center">
              <svg
                className="mx-auto mb-4 h-16 w-16 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
              <p className="text-lg text-gray-500">Nie znaleziono produktów</p>
            </div>
          )}
        </section>
      </div>

      {/* Features Section */}
      <section className="mt-16 py-12 bg-gray-100 rounded-lg">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Dlaczego warto wybrać Shop Skeleton UI?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Dostawa do ciebie</h3>
            <p className="text-gray-600">Zamówienie dotrze na wskazany adres</p>
          </div>
          <div className="text-center">
            <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Najlepsze ceny</h3>
            <p className="text-gray-600">Gwarantujemy najniższe ceny</p>
          </div>
          <div className="text-center">
            <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5-4a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Wsparcie 24/7</h3>
            <p className="text-gray-600">Zawsze chętnie pomożemy</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
