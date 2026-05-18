import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { LayoutDashboard, BookOpen, BarChart2, FlaskConical, FileText, ExternalLink, LogOut, X, PenLine } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { useIdeaStore } from '../../store/ideaStore'

const NAV = [
  { to: '/',        icon: LayoutDashboard, label: 'Dashboard', mat: 'dashboard'    },
  { to: '/spec',    icon: FileText,        label: 'Spec',      mat: 'description'  },
  { to: '/ideas',   icon: BookOpen,        label: 'Bitácora',  mat: 'history_edu'  },
  { to: '/mercado', icon: BarChart2,        label: 'Mercado',   mat: 'trending_up'  },
  { to: '/recetas', icon: FlaskConical,     label: 'Recetas',   mat: 'restaurant'   },
]

export function Layout() {
  const [drawer, setDrawer] = useState(false)
  const logout    = useAuthStore(s => s.logout)
  const nombre    = useAuthStore(s => s.nombre)
  const navigate  = useNavigate()
  const ideasCount = useIdeaStore(s => s.ideas.length)

  const handleLogout = () => { logout(); navigate('/login', { replace: true }) }

  return (
    <div className="flex flex-col min-h-screen bg-background">

      {/* ── Top bar ── */}
      <header className="
        fixed top-0 w-full z-50 h-16
        bg-background border-b-2 border-on-surface shadow-block
        flex justify-between items-center
        px-4 md:px-10
      ">
        {/* Logo + hamburguesa */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setDrawer(true)}
            className="md:hidden p-2 text-primary hover:bg-surface-container-high transition-colors active:translate-x-0.5 active:translate-y-0.5 min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Menú"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
          <span className="font-display text-primary-container font-bold uppercase tracking-tighter text-2xl italic">BC</span>
        </div>

        {/* Nav desktop */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} end={to === '/'}
              className={({ isActive }) => `
                flex items-center gap-2 px-4 py-2 text-[11px] font-bold uppercase tracking-widest
                border-2 transition-all duration-100
                ${isActive
                  ? 'border-primary-container text-primary-container bg-surface-container shadow-block-sm'
                  : 'border-transparent text-on-surface-variant hover:text-primary hover:bg-surface-container-high'
                }
              `}>
              <Icon size={14} /> {label}
              {label === 'Bitácora' && ideasCount > 0 && (
                <span className="bg-primary-container text-on-primary-container text-[9px] font-black px-1.5 py-0.5 min-w-[18px] text-center">
                  {ideasCount}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Avatar + acciones */}
        <div className="flex items-center gap-3">
          <a href="https://taperia-boca-chueca.vercel.app" target="_blank"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest border-2 border-outline-variant text-on-surface-variant hover:border-primary-container hover:text-primary-container transition-colors">
            <ExternalLink size={11} /> Sitio
          </a>
          <div
            className="w-10 h-10 border-2 border-on-surface shadow-block-sm bg-surface-container-high flex items-center justify-center cursor-pointer"
            title={`${nombre} — click para salir`}
            onClick={handleLogout}
          >
            <span className="font-display font-bold text-primary-container italic text-sm">
              {nombre.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>
      </header>

      {/* ── Drawer móvil ── */}
      {drawer && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/80" onClick={() => setDrawer(false)} />
          <div className="absolute left-0 top-0 h-full w-4/5 max-w-xs bg-surface-container-lowest border-r-2 border-on-surface flex flex-col shadow-block-lg">

            <div className="flex items-center justify-between px-4 h-16 border-b-2 border-on-surface">
              <span className="font-display text-primary-container font-bold uppercase tracking-tighter text-xl italic">BC · Portal</span>
              <button onClick={() => setDrawer(false)}
                className="text-on-surface-variant hover:text-primary min-w-[44px] min-h-[44px] flex items-center justify-center">
                <X size={18} />
              </button>
            </div>

            <nav className="flex-1 py-4 overflow-y-auto">
              {NAV.map(({ to, icon: Icon, label }) => (
                <NavLink key={to} to={to} end={to === '/'} onClick={() => setDrawer(false)}
                  className={({ isActive }) => `
                    flex items-center gap-4 px-6 py-4 text-sm font-bold uppercase tracking-widest
                    border-l-4 transition-all min-h-[52px]
                    ${isActive
                      ? 'border-primary-container text-primary-container bg-surface-container'
                      : 'border-transparent text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                    }
                  `}>
                  <Icon size={18} className="shrink-0" />
                  <span>{label}</span>
                  {label === 'Bitácora' && ideasCount > 0 && (
                    <span className="ml-auto bg-primary-container text-on-primary-container text-[9px] font-black px-1.5 py-0.5">
                      {ideasCount}
                    </span>
                  )}
                </NavLink>
              ))}
            </nav>

            <div className="p-4 border-t-2 border-on-surface space-y-1">
              <a href="https://taperia-boca-chueca.vercel.app" target="_blank"
                className="flex items-center gap-3 px-2 py-3 text-sm font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary-container transition-colors">
                <ExternalLink size={16} /> Ver sitio web
              </a>
              <button onClick={handleLogout}
                className="w-full flex items-center gap-3 px-2 py-3 text-sm font-bold uppercase tracking-widest text-on-surface-variant hover:text-secondary transition-colors min-h-[44px]">
                <LogOut size={16} /> Salir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Contenido ── */}
      <main className="flex-1 pt-16 pb-24 md:pb-8">
        <div className="px-4 md:px-10 py-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>

      {/* ── Bottom nav móvil (estilo Stitch) ── */}
      <nav className="md:hidden fixed bottom-0 w-full z-40 h-20 bg-surface-container border-t-2 border-on-surface flex justify-around items-center px-2">
        {NAV.map(({ to, mat, label }) => (
          <NavLink key={to} to={to} end={to === '/'}
            className={({ isActive }) => `
              flex flex-col items-center justify-center gap-0.5
              min-w-[44px] min-h-[44px] px-3 transition-all
              ${isActive ? 'text-primary-container scale-105' : 'text-on-surface-variant opacity-70 hover:text-primary'}
            `}>
            <span className="material-symbols-outlined text-[22px]">{mat}</span>
            <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* ── FAB — acceso rápido bitácora ── */}
      <NavLink to="/ideas"
        className="
          md:hidden fixed right-5 bottom-24 z-50
          w-14 h-14 bg-primary-container text-on-primary-container
          border-2 border-on-surface shadow-block
          flex items-center justify-center
          active:translate-x-0.5 active:translate-y-0.5 active:shadow-block-sm transition-all
        "
        title="Nueva entrada en bitácora"
      >
        <PenLine size={22} />
      </NavLink>

      {/* Footer */}
      <div className="hidden md:block border-t border-outline-variant/30 py-3 text-center">
        <p className="text-[10px] text-outline uppercase tracking-widest">
          La Tapería del Boca Chueca · Portal Privado del Socio
        </p>
      </div>
    </div>
  )
}
