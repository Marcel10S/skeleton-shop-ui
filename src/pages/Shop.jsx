import React, { useEffect, useState } from 'react'
import ProductCarousel from '../components/ProductCarousel'
import CategoryTree from '../components/CategoryTree'
import { apiService } from '../services/api'

const PRODUCTS_PER_PAGE = 12

function Shop() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    Promise.all([apiService.getProducts(), apiService.getCategories()])
      .then(([productsData, categoriesData]) => {
        setProducts(productsData || [])
        setCategories(categoriesData || [])
      })
      .catch(() => setError('Nie udało się wczytać produktów. Spróbuj ponownie później.'))
      .finally(() => setLoading(false))
  }, [])

  const handleCategoryFilter = (categoryId, categoryIds = []) => {
    setSelectedCategory(categoryId)
    setSelectedCategoryIds(categoryIds)
    setPage(1)
  }

  const filteredProducts = selectedCategory
    ? products.filter((product) => selectedCategoryIds.includes(product.category?.id || product.categoryId))
    : products
  const pageCount = Math.max(1, Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE))
  const visibleProducts = filteredProducts.slice((page - 1) * PRODUCTS_PER_PAGE, page * PRODUCTS_PER_PAGE)

  if (loading) {
    return <div className="flex min-h-96 items-center justify-center text-gray-600">Wczytywanie produktów...</div>
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <p className="mb-1 text-sm font-semibold uppercase tracking-wide text-blue-600">ShopHub</p>
        <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">Sklep</h1>
        <p className="mt-2 text-gray-600">Wszystkie produkty w jednym miejscu.</p>
      </div>

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[250px_minmax(0,1fr)] lg:gap-10">
        {categories.length > 0 && <CategoryTree categories={categories} totalProducts={products.length} selectedCategory={selectedCategory} onSelect={handleCategoryFilter} />}
        <section className="min-w-0">
          {error && <div className="mb-6 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">{error}</div>}
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <h2 className="text-2xl font-bold text-gray-900">{selectedCategory ? 'Produkty z kategorii' : 'Wszystkie produkty'}</h2>
            <span className="text-sm text-gray-500">{filteredProducts.length} produktów</span>
          </div>
          {visibleProducts.length > 0 ? (
            <ProductCarousel products={visibleProducts} label={`Produkty na stronie ${page}`} desktopGrid />
          ) : (
            <p className="py-12 text-center text-gray-500">Nie znaleziono produktów.</p>
          )}
          {pageCount > 1 && (
            <nav aria-label="Paginacja produktów" className="mt-8 flex flex-wrap items-center justify-center gap-2">
              <button type="button" disabled={page === 1} onClick={() => setPage((current) => current - 1)} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-40">Poprzednia</button>
              {Array.from({ length: pageCount }, (_, index) => index + 1).map((pageNumber) => (
                <button key={pageNumber} type="button" onClick={() => setPage(pageNumber)} className={`h-10 w-10 rounded-lg text-sm font-semibold ${page === pageNumber ? 'bg-blue-600 text-white' : 'border border-gray-200 text-gray-700 hover:border-blue-400'}`}>{pageNumber}</button>
              ))}
              <button type="button" disabled={page === pageCount} onClick={() => setPage((current) => current + 1)} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-40">Następna</button>
            </nav>
          )}
        </section>
      </div>
    </div>
  )
}

export default Shop
