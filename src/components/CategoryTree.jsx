import React, { useEffect, useState } from 'react'

const getParentId = (category) => (
  category.parentId || category.parent_id || category.parent?.id || null
)

const buildTree = (categories) => {
  const nodes = new Map(
    categories.map((category) => [
      category.id,
      { ...category, children: [] },
    ])
  )
  const roots = []
  const hasExplicitParents = categories.some((category) => getParentId(category))

  const inferredParents = new Map()
  if (!hasExplicitParents) {
    categories.forEach((category) => {
      const parent = categories
        .filter((candidate) => (
          candidate.id !== category.id
          && category.name.toLowerCase().startsWith(`${candidate.name.toLowerCase()} `)
        ))
        .sort((first, second) => second.name.length - first.name.length)[0]

      if (parent) {
        inferredParents.set(category.id, parent.id)
      }
    })
  }

  categories.forEach((category) => {
    const node = nodes.get(category.id)
    const parentId = getParentId(category) || inferredParents.get(category.id)
    const parent = parentId ? nodes.get(parentId) : null

    if (parent) {
      parent.children.push(node)
    } else {
      roots.push(node)
    }
  })

  return roots
}

const getCategoryIds = (category) => [
  category.id,
  ...category.children.flatMap((child) => getCategoryIds(child)),
]

function CategoryNode({ category, level, selectedCategory, expandedCategories, onToggle, onExpand, onSelect }) {
  const hasChildren = category.children.length > 0
  const isExpanded = expandedCategories.has(category.id)
  const isSelected = selectedCategory === category.id

  return (
    <li>
      <div
        onMouseEnter={() => hasChildren && onExpand(category.id)}
        className={`flex items-center gap-1 rounded-lg transition-colors ${
          isSelected ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
        }`}
      >
        {hasChildren ? (
          <button
            type="button"
            onClick={() => onToggle(category.id)}
            aria-label={`${isExpanded ? 'Zwiń' : 'Rozwiń'} kategorię ${category.name}`}
            aria-expanded={isExpanded}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-gray-400 hover:bg-gray-200 hover:text-blue-600"
          >
            <svg
              className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        ) : (
          <span className="h-9 w-9 shrink-0" aria-hidden="true" />
        )}

        <button
          type="button"
          onClick={() => onSelect(category)}
          className="flex min-h-9 min-w-0 flex-1 items-center justify-between gap-3 py-2 pr-3 text-left text-sm font-medium"
        >
          <span className="truncate">{category.name}</span>
          {category.productCount !== undefined && (
            <span className="shrink-0 text-xs text-gray-400">{category.productCount}</span>
          )}
        </button>
      </div>

      {hasChildren && isExpanded && (
        <ul className="ml-4 border-l border-gray-200 pl-2">
          {category.children.map((child) => (
            <CategoryNode
              key={child.id}
              category={child}
              level={level + 1}
              selectedCategory={selectedCategory}
              expandedCategories={expandedCategories}
              onToggle={onToggle}
              onExpand={onExpand}
              onSelect={onSelect}
            />
          ))}
        </ul>
      )}
    </li>
  )
}

function CategoryTree({ categories, totalProducts, selectedCategory, onSelect }) {
  const tree = buildTree(categories)
  const [expandedCategories, setExpandedCategories] = useState(new Set())

  useEffect(() => {
    setExpandedCategories(new Set(tree.filter((category) => category.children.length > 0).map((category) => category.id)))
  }, [categories])

  const handleToggle = (categoryId) => {
    setExpandedCategories((current) => {
      const next = new Set(current)
      if (next.has(categoryId)) {
        next.delete(categoryId)
      } else {
        next.add(categoryId)
      }
      return next
    })
  }

  const handleExpand = (categoryId) => {
    setExpandedCategories((current) => {
      if (current.has(categoryId)) {
        return current
      }

      return new Set([...current, categoryId])
    })
  }

  const handleSelect = (category) => {
    onSelect(category ? category.id : null, category ? getCategoryIds(category) : [])
  }

  return (
    <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-4 shadow-sm lg:sticky lg:top-24">
      <div className="mb-3 flex items-center gap-3 border-b border-gray-100 pb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M4 6.5A1.5 1.5 0 015.5 5h4l1.5 2h7.5A1.5 1.5 0 0120 8.5v9a1.5 1.5 0 01-1.5 1.5h-13A1.5 1.5 0 014 17.5v-11z" />
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900">Kategorie</h2>
          <p className="text-xs text-gray-500">Znajdź produkty według działu</p>
        </div>
      </div>

      <ul className="space-y-1">
        <li>
          <button
            type="button"
            onClick={() => handleSelect(null)}
            className={`flex min-h-10 w-full items-center justify-between rounded-lg px-3 text-left text-sm font-semibold transition-colors ${
              selectedCategory === null
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-800 hover:bg-gray-50'
            }`}
          >
            <span>Wszystkie produkty</span>
            <span className={selectedCategory === null ? 'text-blue-100' : 'text-gray-400'}>{totalProducts}</span>
          </button>
        </li>
        {tree.map((category) => (
          <CategoryNode
            key={category.id}
            category={category}
            level={0}
            selectedCategory={selectedCategory}
            expandedCategories={expandedCategories}
            onToggle={handleToggle}
            onExpand={handleExpand}
            onSelect={handleSelect}
          />
        ))}
      </ul>
    </aside>
  )
}

export default CategoryTree
