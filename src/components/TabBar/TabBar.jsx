import { useEffect, useRef, useState } from 'react'
import { IconHome, IconMenu, IconCart } from '../Icons'
import { useCart } from '../../context/CartContext'
import './TabBar.css'

const BUMP_DURATION_MS = 320

export default function TabBar({ activeTab, onChangeTab, swipeHandlers }) {
  const { count } = useCart()
  const [bump, setBump] = useState(false)
  const prevCount = useRef(count)

  useEffect(() => {
    if (count > prevCount.current) {
      setBump(true)
      const timer = setTimeout(() => setBump(false), BUMP_DURATION_MS)
      prevCount.current = count
      return () => clearTimeout(timer)
    }
    prevCount.current = count
  }, [count])

  return (
    <nav className="tabbar" {...swipeHandlers}>
      <button className={activeTab === 'inicio' ? 'active' : ''} onClick={() => onChangeTab('inicio')}>
        <IconHome />
        <span>Inicio</span>
      </button>
      <button className={activeTab === 'menu' ? 'active' : ''} onClick={() => onChangeTab('menu')}>
        <IconMenu />
        <span>Menú</span>
      </button>
      <button className={activeTab === 'carrito' ? 'active' : ''} onClick={() => onChangeTab('carrito')}>
        <IconCart className={bump ? 'bump' : ''} />
        <span className={'tab-badge' + (bump ? ' bump' : '')} hidden={count === 0}>
          {count}
        </span>
        <span>Carrito</span>
      </button>
    </nav>
  )
}
