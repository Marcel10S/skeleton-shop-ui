import React, { useEffect, useRef } from 'react'
import ProductCard from './ProductCard'

function ProductCarousel({ products, label = 'Polecane produkty', desktopGrid = false }) {
  const trackRef = useRef(null)
  const loopedProducts = products.length > 3 ? [...products, ...products, ...products] : products
  const dragState = useRef({ startX: 0, startScrollLeft: 0, dragging: false, moved: false })
  const animationFrame = useRef(null)

  const getSetWidth = () => {
    if (!trackRef.current || products.length <= 3) return 0
    const children = trackRef.current.children
    return children[products.length].offsetLeft - children[0].offsetLeft
  }

  const getSlideStep = () => {
    const track = trackRef.current
    if (!track || track.children.length < 2) return track?.clientWidth || 0

    return track.children[1].offsetLeft - track.children[0].offsetLeft
  }

  const normalizeTarget = (target) => {
    const setWidth = getSetWidth()
    if (!setWidth) return Math.max(0, target)

    while (target < setWidth * 0.5) target += setWidth
    while (target > setWidth * 2.5) target -= setWidth
    return target
  }

  const animateTo = (target) => {
    const track = trackRef.current
    if (!track) return

    cancelAnimationFrame(animationFrame.current)
    const start = track.scrollLeft
    const distance = target - start
    const duration = 420
    const startedAt = performance.now()

    const step = (now) => {
      const progress = Math.min((now - startedAt) / duration, 1)
      const easedProgress = 1 - ((1 - progress) ** 3)
      track.scrollLeft = start + distance * easedProgress

      if (progress < 1) {
        animationFrame.current = requestAnimationFrame(step)
      }
    }

    animationFrame.current = requestAnimationFrame(step)
  }

  useEffect(() => {
    const track = trackRef.current
    if (!track || products.length <= 3) return

    requestAnimationFrame(() => {
      track.scrollLeft = getSetWidth()
    })
  }, [products.length])

  const scroll = (direction) => {
    const step = getSlideStep()
    const current = trackRef.current?.scrollLeft || 0
    animateTo(normalizeTarget(current + direction * step))
  }

  const handlePointerDown = (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    if (event.target.closest('button, input, select, textarea, label')) return

    event.preventDefault()
    cancelAnimationFrame(animationFrame.current)
    dragState.current = {
      startX: event.clientX,
      startScrollLeft: trackRef.current.scrollLeft,
      dragging: true,
      moved: false,
    }
    trackRef.current.setPointerCapture?.(event.pointerId)
  }

  const handlePointerMove = (event) => {
    if (!dragState.current.dragging) return
    const distance = event.clientX - dragState.current.startX
    if (Math.abs(distance) > 5) dragState.current.moved = true
    trackRef.current.scrollLeft = dragState.current.startScrollLeft - distance
  }

  const handlePointerUp = (event) => {
    const track = trackRef.current
    dragState.current.dragging = false
    track?.releasePointerCapture?.(event.pointerId)

    if (dragState.current.moved && track) {
      const slideStep = getSlideStep()
      const nearestSlide = Math.round(track.scrollLeft / slideStep)
      animateTo(normalizeTarget(nearestSlide * slideStep))
    }
  }

  const handleScroll = () => {
    const track = trackRef.current
    const setWidth = getSetWidth()
    if (!track || !setWidth) return

    if (track.scrollLeft < setWidth * 0.5) {
      track.scrollLeft += setWidth
    } else if (track.scrollLeft > setWidth * 1.5) {
      track.scrollLeft -= setWidth
    }
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
        onScroll={handleScroll}
        onDragStart={(event) => event.preventDefault()}
        onClickCapture={handleClickCapture}
        className={`select-none gap-4 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${desktopGrid ? 'flex snap-x snap-mandatory cursor-grab overflow-x-auto active:cursor-grabbing touch-pan-y md:justify-center lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-visible' : 'flex snap-x snap-mandatory cursor-grab overflow-x-auto active:cursor-grabbing touch-pan-y md:justify-center'}`}
      >
        {loopedProducts.map((product, index) => (
          <div key={`${product.id}-${index}`} className={`${desktopGrid ? 'min-w-full snap-start sm:min-w-[calc(50%_-_0.5rem)] lg:min-w-0' : 'min-w-full snap-start sm:min-w-[calc(50%_-_0.5rem)] md:min-w-[calc(33.333%_-_0.667rem)]'}`}>
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
