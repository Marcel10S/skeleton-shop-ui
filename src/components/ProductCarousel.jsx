import React, { useRef } from 'react'
import ProductCard from './ProductCard'

function ProductCarousel({ products, label = 'Polecane produkty', desktopGrid = false }) {
  const trackRef = useRef(null)
  const dragState = useRef({ startX: 0, startScrollLeft: 0, dragging: false, moved: false })

  const scroll = (direction) => {
    trackRef.current?.scrollBy({
      left: direction * trackRef.current.clientWidth,
      behavior: 'smooth',
    })
  }

  const handlePointerDown = (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    dragState.current = {
      startX: event.clientX,
      startScrollLeft: trackRef.current.scrollLeft,
      dragging: true,
      moved: false,
    }
    trackRef.current.setPointerCapture?.(event.pointerId)
  }

  const handlePointerMove = (event) => {
    if (!dragState.current.dragging || desktopGrid) return
    const distance = event.clientX - dragState.current.startX
    if (Math.abs(distance) > 5) dragState.current.moved = true
    trackRef.current.scrollLeft = dragState.current.startScrollLeft - distance
  }

  const handlePointerUp = (event) => {
    dragState.current.dragging = false
    trackRef.current.releasePointerCapture?.(event.pointerId)
  }

  const handleClickCapture = (event) => {
    if (dragState.current.moved) {
      event.preventDefault()
      event.stopPropagation()
      dragState.current.moved = false
    }
  }

  return (
    <div className="relative">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-sm text-gray-500">{label}</p>
      </div>
      <div
        ref={trackRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onClickCapture={handleClickCapture}
        className={`select-none gap-4 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${desktopGrid ? 'grid lg:grid-cols-3 lg:gap-6' : 'flex snap-x snap-mandatory cursor-grab overflow-x-auto active:cursor-grabbing touch-pan-y'}`}
      >
        {products.map((product) => (
          <div key={product.id} className={`${desktopGrid ? 'min-w-full sm:min-w-[calc(50%_-_0.5rem)] lg:min-w-0' : 'min-w-full snap-start sm:min-w-[calc(50%_-_0.5rem)] md:min-w-[calc(33.333%_-_0.667rem)]'}`}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
      <div className="mt-3 flex justify-center gap-3">
        <button type="button" onClick={() => scroll(-1)} aria-label="Poprzednie produkty" className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-xl text-gray-700 shadow-sm hover:border-blue-400 hover:text-blue-600">
          <span aria-hidden="true">←</span>
        </button>
        <button type="button" onClick={() => scroll(1)} aria-label="Następne produkty" className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-xl text-gray-700 shadow-sm hover:border-blue-400 hover:text-blue-600">
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  )
}

export default ProductCarousel
