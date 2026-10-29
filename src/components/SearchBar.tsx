import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { useI18n } from '../i18n'

interface SearchBarProps {
  initial?: string
  size?: 'lg' | 'md'
  placeholder?: string
}

export function SearchBar({ initial = '', size = 'lg', placeholder }: SearchBarProps) {
  const { t } = useI18n()
  const [q, setQ] = useState(initial)
  const navigate = useNavigate()

  const submit = (e: FormEvent) => {
    e.preventDefault()
    navigate(`/qidiruv?q=${encodeURIComponent(q.trim())}`)
  }

  return (
    <form className={`searchbar searchbar--${size}`} role="search" onSubmit={submit}>
      <Search size={20} className="searchbar__icon" aria-hidden="true" />
      <label htmlFor={`search-${size}`} className="sr-only">
        {t('common.search')}
      </label>
      <input
        id={`search-${size}`}
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={placeholder ?? t('search.placeholder')}
        autoComplete="off"
      />
      <button type="submit" className="btn btn--primary">
        <Search size={18} />
        <span>{t('common.searchAction')}</span>
      </button>
    </form>
  )
}
