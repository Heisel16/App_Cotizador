'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

const nav = [
  { href: '/cotizaciones', label: 'Cotizaciones', icon: '📋' },
  { href: '/productos', label: 'Productos', icon: '📦' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <>
      {/* Header móvil */}
      <header className="mobile-header">
        <span className="mobile-brand">🔧 Cotizador</span>
        <button className="menu-btn" onClick={() => setOpen(true)}>☰</button>
      </header>

      {/* Overlay */}
      <div
        className={`sidebar-overlay ${open ? 'open' : ''}`}
        onClick={() => setOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <span className="brand-icon">🔧</span>
          <span className="brand-name">Cotizador</span>
        </div>
        <nav className="sidebar-nav">
          {nav.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-link ${pathname.startsWith(item.href) ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>
    </>
  )
}