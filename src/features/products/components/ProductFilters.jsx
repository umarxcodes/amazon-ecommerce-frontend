import Button from '../../../components/UI/Button'
import Field from '../../../components/UI/Field'

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
]

export default function ProductFilters({
  categories,
  filters,
  searchValue,
  onSearchChange,
  onCategoryChange,
  onSortChange,
  priceFilter,
  onPriceChange,
  ratingFilter,
  onRatingChange,
  onReset,
}) {
  return (
    <section className="filters-panel">
      <div className="filters-panel__header">
        <div>
          <span className="eyebrow">Browse smarter</span>
          <h2>Find the right product quickly</h2>
        </div>
        <Button type="button" variant="ghost" size="sm" onClick={onReset}>
          Reset filters
        </Button>
      </div>

      <Field label="Search products">
        <input
          className="field__control"
          type="search"
          placeholder="Search for electronics, books, furniture..."
          value={searchValue}
          onChange={onSearchChange}
        />
      </Field>

      <Field label="Category">
        <select className="field__control" value={filters.category} onChange={onCategoryChange}>
          <option value="all">All categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Sort by">
        <select className="field__control" value={filters.sortBy} onChange={onSortChange}>
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Max price" hint={priceFilter === 'all' ? 'Any budget' : `Up to $${priceFilter}`}>
        <select className="field__control" value={priceFilter} onChange={onPriceChange}>
          <option value="all">All prices</option>
          <option value="25">Under $25</option>
          <option value="50">Under $50</option>
          <option value="100">Under $100</option>
          <option value="250">Under $250</option>
        </select>
      </Field>

      <Field
        label="Minimum rating"
        hint={ratingFilter === 'all' ? 'Show all products' : `${ratingFilter}+ stars`}
      >
        <select className="field__control" value={ratingFilter} onChange={onRatingChange}>
          <option value="all">All ratings</option>
          <option value="4">4 stars & up</option>
          <option value="3">3 stars & up</option>
          <option value="2">2 stars & up</option>
        </select>
      </Field>
    </section>
  )
}
