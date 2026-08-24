import { useEffect, useState } from 'react'
import type { FormEvent, ReactElement } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { get } from '../api'
import Footer from '../components/Footer'
import Pagination from '../components/Pagination'
import ProductGrid from '../components/ProductGrid'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { usePageHero } from '../hooks/usePageHero'
import { categoryUrl } from '../lib/links'
import type { Paginated, ProductSummary } from '../types'

const PAGE_SIZE = 8

const CATEGORY_META: Record<string, { eyebrow: string; title1: string; title2: string; lead: string; label: string; searchLabel: string }> = {
  'home-decor': {
    eyebrow: 'Category / 01',
    title1: 'Home',
    title2: 'decor.',
    lead: 'Vases, decorative objects, and candle holders that bring character to small corners of the home.',
    label: 'Home decor',
    searchLabel: 'Search in home decor',
  },
  'table-accessories': {
    eyebrow: 'Category / 02',
    title1: 'Table',
    title2: 'accessories.',
    lead: 'Bowls, trays, and tabletop objects that make everyday moments feel more intentional.',
    label: 'Table accessories',
    searchLabel: 'Search in table accessories',
  },
  vases: {
    eyebrow: 'Category / 03',
    title1: 'Vases &',
    title2: 'vessels.',
    lead: 'Forms that stand alone, accompany flowers, or create a pause on a surface.',
    label: 'Vases & vessels',
    searchLabel: 'Search in vases and vessels',
  },
  lifestyle: {
    eyebrow: 'Category / 04',
    title1: 'Everyday',
    title2: 'rituals.',
    lead: 'Small objects for making tea, reading, lighting a candle, and returning to yourself.',
    label: 'Lifestyle',
    searchLabel: 'Search in lifestyle',
  },
}

const CHIPS = [
  { slug: 'home-decor', label: 'Home decor' },
  { slug: 'table-accessories', label: 'Table accessories' },
  { slug: 'vases', label: 'Vases & vessels' },
  { slug: 'lifestyle', label: 'Lifestyle' },
]

const SUBCATEGORIES: Record<string, { label: string; value: string }[]> = {
  'home-decor': [
    { label: 'Vases', value: 'vases' },
    { label: 'Decorative objects', value: 'decorative-objects' },
    { label: 'Candle holders', value: 'candle-holders' },
  ],
  'table-accessories': [
    { label: 'Bowls', value: 'bowls' },
    { label: 'Trays', value: 'trays' },
    { label: 'Serving pieces', value: 'serving-pieces' },
  ],
  vases: [
    { label: 'Vases', value: 'vases' },
    { label: 'Bud vases', value: 'vases' },
    { label: 'Floor vessels', value: 'vases' },
  ],
  lifestyle: [
    { label: 'Candle holders', value: 'candle-holders' },
    { label: 'Catchalls', value: 'lifestyle' },
    { label: 'Incense holders', value: 'lifestyle' },
  ],
}

const SHOP_CATEGORIES = [
  { label: 'Home decor', value: 'home-decor' },
  { label: 'Table accessories', value: 'table-accessories' },
  { label: 'Lifestyle', value: 'lifestyle' },
]

const SHOP_COLLECTIONS = [
  { label: 'Ruang Pagi', value: 'ruang-pagi' },
  { label: 'Bumi Tenang', value: 'bumi-tenang' },
]

const SHOP_MATERIALS = [
  { label: 'Ceramic', value: 'ceramic' },
  { label: 'Wood', value: 'wood' },
  { label: 'Terracotta', value: 'terracotta' },
]

const SHOP_AVAILABILITY = [
  { label: 'Ready to ship', value: 'ready' },
  { label: 'Made to order', value: 'made-to-order' },
]

function readList(params: URLSearchParams, key: string): string[] {
  const raw = params.get(key)
  return raw ? raw.split(',').map((s) => s.trim()).filter(Boolean) : []
}

export default function Catalog(): ReactElement {
  const [searchParams, setSearchParams] = useSearchParams()

  const categoryParam = searchParams.get('category') ?? ''
  const meta = CATEGORY_META[categoryParam]
  const mode = meta ? 'category' : 'shop'

  const q = searchParams.get('q') ?? ''
  const subcategory = readList(searchParams, 'subcategory')
  const shopCategories = mode === 'shop' ? categoryParam.split(',').map((s) => s.trim()).filter(Boolean) : []
  const collection = readList(searchParams, 'collection')
  const material = readList(searchParams, 'material')
  const availability = readList(searchParams, 'availability')
  const sort = searchParams.get('sort') ?? 'newest'
  const page = Math.max(1, Number(searchParams.get('page') ?? 1) || 1)

  const [data, setData] = useState<Paginated<ProductSummary> | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [searchText, setSearchText] = useState(q)

  useEffect(() => setSearchText(q), [q])

  const title = mode === 'category' && meta ? meta.title1 : 'Objects for'
  const title2 = mode === 'category' && meta ? meta.title2 : 'everyday living.'
  useDocumentTitle(
    mode === 'category' && meta ? `${meta.label} — Napak Living` : 'Shop — Napak Living'
  )
  usePageHero()

  const setParams = (updates: Record<string, string | string[] | null>): void => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        for (const [key, value] of Object.entries(updates)) {
          if (value === null || value === '' || (Array.isArray(value) && value.length === 0)) {
            next.delete(key)
          } else {
            next.set(key, Array.isArray(value) ? value.join(',') : String(value))
          }
        }
        return next
      },
      { replace: true }
    )
  }

  useEffect(() => {
    let cancelled = false
    setError(null)
    const cats =
      mode === 'category'
        ? subcategory.length
          ? subcategory
          : categoryParam
          ? [categoryParam]
          : []
        : shopCategories

    get<Paginated<ProductSummary>>('/products', {
      q: q || undefined,
      category: cats.length ? cats.join(',') : undefined,
      collection: collection.length ? collection.join(',') : undefined,
      material: material.length ? material.join(',') : undefined,
      availability: availability.length ? availability.join(',') : undefined,
      sort,
      page,
      limit: PAGE_SIZE,
    })
      .then((d) => {
        if (cancelled) return
        if (d.page > d.totalPages && d.totalPages > 0) {
          setParams({ page: String(d.totalPages) })
          return
        }
        setData(d)
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Unable to load products.')
      })
    return () => {
      cancelled = true
    }
  }, [categoryParam, subcategory.join(','), shopCategories.join(','), collection.join(','), material.join(','), availability.join(','), sort, page])

  const handleCheck = (group: string, value: string, checked: boolean): void => {
    const list =
      group === 'subcategory' ? subcategory : group === 'category' ? shopCategories : readList(searchParams, group)
    const next = checked ? Array.from(new Set([...list, value])) : list.filter((v) => v !== value)
    setParams({ [group]: next.length ? next : null, page: null })
  }

  const handleSearch = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    setParams({ q: searchText.trim() || null, page: null })
  }

  const handleSort = (value: string): void => {
    setParams({ sort: value === 'newest' ? null : value, page: null })
  }

  const handlePage = (nextPage: number): void => {
    setParams({ page: nextPage > 1 ? String(nextPage) : null })
    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  let countText = ''
  if (data) {
    const start = data.total === 0 ? 0 : (data.page - 1) * data.pageSize + 1
    const end = Math.min(data.page * data.pageSize, data.total)
    const showing = data.total > 0 ? ` / showing ${start}–${end}` : ''
    countText = `${data.total} objects${showing}`
  }

  return (
    <>
      <main id="main-content" className="page-main">
        <section className="page-hero container" aria-labelledby="page-title">
          <p className="breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <Link to="/catalog">Shop</Link>
            {mode === 'category' && meta && (
              <>
                <span>/</span>
                <span>{meta.label}</span>
              </>
            )}
          </p>
          <div className="page-hero-row">
            <div>
              <p className="eyebrow">
                {mode === 'category' && meta ? meta.eyebrow : 'The catalog / all objects'}
              </p>
              <h1 id="page-title" className="display-title">
                <span>{title}</span>
                <span className="muted-line">{title2}</span>
              </h1>
            </div>
            <p className="lead">
              {mode === 'category' && meta
                ? meta.lead
                : 'Quiet forms that fill the home with more feeling and less noise.'}
            </p>
          </div>
          <nav
            className="category-links"
            aria-label={mode === 'category' ? 'Other categories' : 'Quick category filters'}
          >
            <Link
                className="category-chip"
                to="/catalog"
                aria-current={!categoryParam ? 'page' : undefined}
              >
                All objects
              </Link>
            {CHIPS.map((chip) => (
              <Link
                key={chip.slug}
                className="category-chip"
                to={categoryUrl(chip.slug)}
                aria-current={mode === 'category' && categoryParam === chip.slug ? 'page' : undefined}
              >
                {chip.label}
              </Link>
            ))}
          </nav>
          <div className="page-hero-rule"></div>
        </section>

        <section
          className="catalog-section container"
          id="catalog"
          aria-label={mode === 'category' && meta ? `${meta.label} products` : 'Product catalog'}
        >
          <div className="catalog-layout">
            <aside
              className="filter-panel"
              aria-label={mode === 'category' && meta ? `Filter ${meta.label.toLowerCase()}` : 'Product filters'}
            >
              <h2 className="filter-heading">
                {mode === 'category' && meta ? meta.label : 'Refine your search'}
              </h2>

              {mode === 'category' && meta && (
                <div className="filter-group">
                  <h3 className="filter-group-title">Subcategory</h3>
                  <div className="filter-options">
                    {SUBCATEGORIES[categoryParam].map((opt) => (
                      <label className="filter-option" key={opt.label}>
                        <input
                          type="checkbox"
                          data-filter="subcategory"
                          value={opt.value}
                          checked={subcategory.includes(opt.value)}
                          onChange={(e) => handleCheck('subcategory', opt.value, e.target.checked)}
                        />
                        {opt.label}
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {mode === 'shop' && (
                <div className="filter-group">
                  <h3 className="filter-group-title">Category</h3>
                  <div className="filter-options">
                    {SHOP_CATEGORIES.map((opt) => (
                      <label className="filter-option" key={opt.value}>
                        <input
                          type="checkbox"
                          data-filter="category"
                          value={opt.value}
                          checked={shopCategories.includes(opt.value)}
                          onChange={(e) => handleCheck('category', opt.value, e.target.checked)}
                        />
                        {opt.label}
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="filter-group">
                <h3 className="filter-group-title">Collection</h3>
                <div className="filter-options">
                  {SHOP_COLLECTIONS.map((opt) => (
                    <label className="filter-option" key={opt.value}>
                      <input
                        type="checkbox"
                        data-filter="collection"
                        value={opt.value}
                        checked={collection.includes(opt.value)}
                        onChange={(e) => handleCheck('collection', opt.value, e.target.checked)}
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </div>

              {mode === 'shop' && (
                <>
                  <div className="filter-group">
                    <h3 className="filter-group-title">Material</h3>
                    <div className="filter-options">
                      {SHOP_MATERIALS.map((opt) => (
                        <label className="filter-option" key={opt.value}>
                          <input
                            type="checkbox"
                            data-filter="material"
                            value={opt.value}
                            checked={material.includes(opt.value)}
                            onChange={(e) => handleCheck('material', opt.value, e.target.checked)}
                          />
                          {opt.label}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="filter-group">
                    <h3 className="filter-group-title">Availability</h3>
                    <div className="filter-options">
                      {SHOP_AVAILABILITY.map((opt) => (
                        <label className="filter-option" key={opt.value}>
                          <input
                            type="checkbox"
                            data-filter="availability"
                            value={opt.value}
                            checked={availability.includes(opt.value)}
                            onChange={(e) =>
                              handleCheck('availability', opt.value, e.target.checked)
                            }
                          />
                          {opt.label}
                        </label>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <Link
                className="filter-reset"
                to={mode === 'category' && categoryParam ? categoryUrl(categoryParam) : '/catalog'}
              >
                {mode === 'category' ? 'Reset filters' : 'Reset all filters'}
              </Link>
            </aside>

            <div className="catalog-content">
              <div className="catalog-toolbar">
                <form className="search-control" onSubmit={handleSearch}>
                  <label className="sr-only" htmlFor="catalog-search">
                    Search products
                  </label>
                  <input
                    id="catalog-search"
                    type="search"
                    name="q"
                    placeholder={
                      mode === 'category' && meta ? meta.searchLabel : 'Search by name, SKU, or material'
                    }
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                  />
                  <button type="submit" aria-label="Search">
                    ⌕
                  </button>
                </form>
                <div className="sort-control">
                  <label htmlFor="sort">Sort by</label>
                  <select
                    className="select-control"
                    id="sort"
                    value={sort}
                    onChange={(e) => handleSort(e.target.value)}
                  >
                    <option value="newest">Newest</option>
                    <option value="name-asc">Name: A–Z</option>
                    <option value="name-desc">Name: Z–A</option>
                    {mode === 'shop' && <option value="price-asc">Price: low to high</option>}
                  </select>
                </div>
              </div>

              <p className="catalog-result-count">{countText}</p>

              {error ? (
                <p className="catalog-empty">{error}</p>
              ) : data ? (
                <ProductGrid products={data.items} className="catalog-grid" />
              ) : null}

              {mode === 'shop' && data && (
                <Pagination page={data.page} totalPages={data.totalPages} onPage={handlePage} />
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer variant={mode === 'shop' ? 'instagram' : 'contact'} />
    </>
  )
}