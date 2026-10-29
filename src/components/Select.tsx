import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { createPortal } from 'react-dom'
import { Check, ChevronDown } from 'lucide-react'

export interface SelectOption {
  value: string
  label: string
}

interface SelectProps {
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  className?: string
  id?: string
  disabled?: boolean
  placeholder?: string
  'aria-label'?: string
}

export function Select({ value, onChange, options, className = '', id, disabled, placeholder, 'aria-label': ariaLabel }: SelectProps) {
  const uid = useId()
  const listId = `${uid}-list`
  const rootRef = useRef<HTMLDivElement>(null)
  const btnRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLUListElement>(null)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const [pos, setPos] = useState({ top: 0, bottom: 0, left: 0, width: 0, maxH: 280, up: false })

  const selected = useMemo(() => options.find((o) => o.value === value), [options, value])
  const label = selected?.label || placeholder || ''
  const isPlaceholder = !selected || selected.value === ''

  const place = useCallback(() => {
    const btn = btnRef.current
    if (!btn) return
    const rect = btn.getBoundingClientRect()
    const gap = 6
    const vw = window.innerWidth
    const vh = window.innerHeight
    const width = Math.min(Math.max(rect.width, 240), vw - 16)
    const maxH = Math.min(320, vh - 24)
    const spaceBelow = vh - rect.bottom - gap - 8
    const spaceAbove = rect.top - gap - 8
    const up = spaceBelow < 132 && spaceAbove > spaceBelow + 24
    const maxMenu = Math.max(120, Math.min(maxH, up ? spaceAbove : spaceBelow))
    let left = rect.left
    if (left + width > vw - 8) left = vw - width - 8
    if (left < 8) left = 8
    const top = rect.bottom + gap
    const bottom = vh - rect.top + gap
    setPos({ top, bottom, left, width, maxH: maxMenu, up })
  }, [])

  useLayoutEffect(() => {
    if (!open) return
    place()
    const i = options.findIndex((o) => o.value === value)
    setActive(i < 0 ? 0 : i)
  }, [open, options, value, place])

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      const t = e.target as Node
      if (rootRef.current?.contains(t) || menuRef.current?.contains(t)) return
      setOpen(false)
    }
    const onScroll = () => place()
    document.addEventListener('mousedown', onDoc)
    window.addEventListener('resize', onScroll)
    window.addEventListener('scroll', onScroll, true)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      window.removeEventListener('resize', onScroll)
      window.removeEventListener('scroll', onScroll, true)
    }
  }, [open, place])

  useLayoutEffect(() => {
    if (!open) return
    const el = menuRef.current?.querySelector<HTMLElement>('[data-active="true"]')
    el?.scrollIntoView({ block: 'nearest' })
  }, [open, active])

  const pick = (next: string) => {
    onChange(next)
    setOpen(false)
    btnRef.current?.focus()
  }

  const onKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return
    if (!open && (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault()
      setOpen(true)
      return
    }
    if (!open) return
    if (e.key === 'Escape') {
      e.preventDefault()
      setOpen(false)
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((i) => Math.min(options.length - 1, i < 0 ? 0 : i + 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => Math.max(0, i < 0 ? 0 : i - 1))
    } else if (e.key === 'Home') {
      e.preventDefault()
      setActive(0)
    } else if (e.key === 'End') {
      e.preventDefault()
      setActive(options.length - 1)
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      const opt = options[active]
      if (opt) pick(opt.value)
    }
  }

  return (
    <div ref={rootRef} className={`select${open ? ' is-open' : ''}${className ? ` ${className}` : ''}`}>
      <button
        ref={btnRef}
        id={id}
        type="button"
        className="select__btn"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={ariaLabel ? `${ariaLabel}: ${label}` : undefined}
        onClick={() => !disabled && setOpen((v) => !v)}
        onKeyDown={onKey}
      >
        <span className={`select__value${isPlaceholder ? ' is-placeholder' : ''}`}>{label}</span>
        <ChevronDown size={16} strokeWidth={2.2} aria-hidden="true" />
      </button>
      {open &&
        createPortal(
          <ul
            ref={menuRef}
            id={listId}
            className={`select__menu${pos.up ? ' select__menu--up' : ''}`}
            role="listbox"
            aria-label={ariaLabel}
            style={{
              top: pos.up ? undefined : pos.top,
              bottom: pos.up ? pos.bottom : undefined,
              left: pos.left,
              width: pos.width,
              maxHeight: pos.maxH,
            }}
          >
            {options.map((o, i) => {
              const on = o.value === value
              return (
                <li key={`${o.value}-${i}`} role="presentation">
                  <button
                    type="button"
                    role="option"
                    className={`select__option${on ? ' is-selected' : ''}${i === active ? ' is-active' : ''}`}
                    aria-selected={on}
                    data-active={i === active ? 'true' : undefined}
                    onMouseEnter={() => setActive(i)}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => pick(o.value)}
                  >
                    <span>{o.label}</span>
                    {on && <Check size={16} strokeWidth={2.4} aria-hidden="true" />}
                  </button>
                </li>
              )
            })}
          </ul>,
          document.body,
        )}
    </div>
  )
}
