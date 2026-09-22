import { useNow } from '../../utils/useNow'
import { isOpenNow } from '../../utils/schedule'
import logo from '../../assets/images/logo-optimized.png'
import './TopBar.css'

/**
 * @param {boolean} showLogo - Muestra el logo arriba a la derecha. Solo en
 * Menú y Carrito (Inicio ya tiene su propia identidad visual más grande).
 */
export default function TopBar({ showLogo = false }) {
  const now = useNow()
  const open = isOpenNow(now)

  return (
    <header className="topbar">
      <span className="logo-text">Patrick's JK</span>
      <div className={open ? 'openpill' : 'openpill openpill-closed'}>
        <span className="dot"></span>
        {open ? 'Abierto' : 'Cerrado'}
      </div>
      {showLogo && <img className="topbar-logo" src={logo} alt="Patrick's JK" />}
    </header>
  )
}
