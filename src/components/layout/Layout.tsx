import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Lightbulb, BarChart2,
  FlaskConical, ExternalLink, LogOut, Menu, X
} from 'lucide-react'
import { useAuthStore }  from '../../store/authStore'
import { useIdeaStore }  from '../../store/ideaStore'

const NAV = [
  { to: '/',        icon: LayoutDashboard, label: 'Evolución'  },
  { to: '/ideas',   icon: Lightbulb,       label: 'Mis Aportes' },
  { to: '/mercado', icon: BarChart2,       label: 'Mercado'    },
  { to: '/recetas', icon: FlaskConical,    label: 'Recetas'    },
]

export function Layout() {
  const [mobile, setMobile] = useState(false)
  const logout   = useAuthStore(s => s.logout)
  const nombre   = useAuthStore(s => s.nombre)
  const navigate = useNavigate()
  const misIdeas = useIdeaStore(s => s.ideas.length)

  const handleLogout = () => { logout(); navigate('/login', { replace: true }) }

  const NavItems = ({ onClick }: { onClick?: () => void }) => (
    <>
      {NAV.map(({ to, icon: Icon, label }) => (
        <NavLink key={to} to={to} end={to === '/'} onClick={onClick}
          className={({ isActive }) => `
            flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-wider
            transition-all duration-150 border-b border-[#504441]/30
            ${isActive
              ? 'bg-[#3c2f00] text-[#eac349] border-l-2 border-l-[#eac349]'
              : 'text-[#9d8d8a] hover:bg-[#201f1f] hover:text-[#d5c3bf]'
            }
          `}>
          <Icon size={17} className="shrink-0" />
          <span>{label}</span>
          {label === 'Mis Aportes' && misIdeas > 0 && (
            <span className="ml-auto bg-[#eac349] text-[#131313] text-[10px] font-black px-1.5 py-0.5 min-w-[20px] text-center">
              {misIdeas}
            </span>
          )}
        </NavLink>
      ))}
    </>
  )

  return (
    <div className="flex flex-col min-h-screen">

      {/* ── Top bar ── */}
      <header className="h-14 bg-[#0e0e0e] border-b border-[#504441] px-4 flex items-center justify-between sticky top-0 z-30">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <button className="md:hidden text-[#9d8d8a] hover:text-[#ecbbb0] p-1" onClick={() => setMobile(true)}>
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#131313] border border-[#eac349] flex items-center justify-center shadow-[0_0_10px_rgba(234,195,73,0.2)]">
              <span className="font-display text-[#eac349] font-black italic text-[10px]">BC</span>
            </div>
            <div className="hidden sm:block">
              <p className="font-display text-[#ecbbb0] italic font-bold text-sm leading-tight">Boca Chueca</p>
              <p className="text-[9px] text-[#504441] uppercase tracking-widest">Portal del Socio</p>
            </div>
          </div>
        </div>

        {/* Nav desktop — horizontal en topbar */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} end={to === '/'}
              className={({ isActive }) => `
                flex items-center gap-2 px-4 py-2 text-[11px] font-bold uppercase tracking-wider
                transition-all duration-150
                ${isActive
                  ? 'bg-[#3c2f00] text-[#eac349]'
                  : 'text-[#9d8d8a] hover:text-[#d5c3bf] hover:bg-[#201f1f]'
                }
              `}>
              <Icon size={14} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Acciones */}
        <div className="flex items-center gap-2">
          <a href="https://taperia-boca-chueca.vercel.app" target="_blank"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#504441] border border-[#504441] hover:text-[#eac349] hover:border-[#eac349] transition-colors">
            <ExternalLink size={12} /> Sitio Web
          </a>
          <div className="flex items-center gap-2 pl-2 border-l border-[#504441]">
            <div className="w-7 h-7 bg-[#2b110b] border border-[#8e241e] flex items-center justify-center">
              <span className="text-[#ecbbb0] font-black text-[10px]">{nombre.charAt(0).toUpperCase()}</span>
            </div>
            <span className="hidden sm:block text-[11px] text-[#9d8d8a] font-bold">{nombre}</span>
            <button onClick={handleLogout} className="p-1.5 text-[#504441] hover:text-[#ffb4ab] transition-colors" title="Salir">
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile drawer ── */}
      {mobile && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/80" onClick={() => setMobile(false)} />
          <div className="absolute left-0 top-0 h-full w-64 bg-[#0e0e0e] border-r border-[#504441] flex flex-col">
            <div className="flex items-center justify-between px-4 h-14 border-b border-[#504441]">
              <p className="font-display text-[#eac349] italic font-bold text-sm">Portal del Socio</p>
              <button onClick={() => setMobile(false)} className="text-[#504441] hover:text-[#9d8d8a]"><X size={18} /></button>
            </div>
            <div className="flex-1 py-2">
              <NavItems onClick={() => setMobile(false)} />
            </div>
            <div className="p-4 border-t border-[#504441]">
              <button onClick={handleLogout} className="flex items-center gap-2 text-[#504441] hover:text-[#ffb4ab] text-sm font-bold uppercase tracking-wider">
                <LogOut size={14} /> Salir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Contenido ── */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl w-full mx-auto">
        <Outlet />
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-[#504441]/30 py-4 text-center">
        <p className="text-[10px] text-[#504441] uppercase tracking-widest">
          La Tapería del Boca Chueca · Portal Privado del Socio
        </p>
      </footer>
    </div>
  )
}
