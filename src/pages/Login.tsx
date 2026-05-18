import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, User, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { useAuthStore } from '../store/authStore'

export function Login() {
  const [nombre, setNombre] = useState('')
  const [key, setKey]       = useState('')
  const [show, setShow]     = useState(false)
  const [error, setError]   = useState(false)
  const [shake, setShake]   = useState(false)
  const login    = useAuthStore(s => s.login)
  const navigate = useNavigate()

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setError(false)
    if (login(key.trim(), nombre.trim() || 'Socio')) {
      navigate('/', { replace: true })
    } else {
      setError(true)
      setShake(true)
      setTimeout(() => setShake(false), 500)
    }
  }

  return (
    <div className="min-h-screen bg-[#0e0e0e] flex items-center justify-center p-4 relative overflow-hidden">

      {/* Decoración de fondo */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#eac349]/[0.03] rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#8e241e]/[0.05] rounded-full blur-3xl" />
      </div>

      <div className={`w-full max-w-sm relative transition-transform duration-100 ${shake ? 'translate-x-3' : ''}`}>

        {/* Logo / branding */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#131313] border-2 border-[#eac349] mb-5 shadow-[0_0_30px_rgba(234,195,73,0.2)]">
            <span className="font-display text-[#eac349] font-black italic text-xl">BC</span>
          </div>
          <h1 className="font-display text-[#ecbbb0] font-black italic text-3xl leading-tight">
            La Tapería del<br/>
            <span className="text-[#eac349]">Boca Chueca</span>
          </h1>
          <p className="text-[#9d8d8a] text-xs uppercase tracking-[0.15em] mt-3">
            Portal del Socio
          </p>
        </div>

        {/* Card de login */}
        <div className="bg-[#1c1b1b] border border-[#504441] p-8 shadow-[0_0_40px_rgba(0,0,0,0.5)]">

          <p className="text-[#d5c3bf] text-sm text-center mb-6 leading-relaxed">
            Bienvenido al panel exclusivo del proyecto.<br/>
            Ingresa para ver el avance y aportar tus ideas.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Campo nombre */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.12em] text-[#9d8d8a] mb-2">
                Tu nombre
              </label>
              <div className="relative">
                <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#504441]" />
                <input
                  type="text"
                  value={nombre}
                  onChange={e => setNombre(e.target.value)}
                  placeholder="Ej: Jaime"
                  className="w-full bg-[#131313] border border-[#504441] focus:border-[#eac349] text-[#e5e2e1] pl-9 pr-4 py-3 text-sm outline-none transition-colors duration-200 placeholder:text-[#504441]"
                />
              </div>
            </div>

            {/* Campo contraseña */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.12em] text-[#9d8d8a] mb-2">
                Contraseña de acceso
              </label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#504441]" />
                <input
                  type={show ? 'text' : 'password'}
                  value={key}
                  onChange={e => { setKey(e.target.value); setError(false) }}
                  placeholder="••••••••••"
                  autoFocus
                  className={`
                    w-full bg-[#131313] border text-[#e5e2e1] pl-9 pr-10 py-3 text-sm outline-none transition-colors duration-200 placeholder:text-[#504441]
                    ${error ? 'border-[#8e241e]' : 'border-[#504441] focus:border-[#eac349]'}
                  `}
                />
                <button type="button" onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#504441] hover:text-[#9d8d8a] transition-colors">
                  {show ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 text-[#ffb4ab] text-xs bg-[#93000a]/20 border border-[#8e241e]/50 px-3 py-2.5">
                <AlertCircle size={13} className="shrink-0" />
                Contraseña incorrecta. Consulta a Francisco.
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="
                w-full py-3.5 font-bold uppercase tracking-[0.12em] text-sm
                bg-[#eac349] text-[#131313]
                hover:bg-[#cca830] active:scale-[0.99]
                transition-all duration-200 mt-2
                shadow-[0_4px_20px_rgba(234,195,73,0.2)]
              "
            >
              Entrar al Portal
            </button>
          </form>
        </div>

        <p className="text-center text-[10px] text-[#504441] uppercase tracking-wider mt-6">
          Acceso privado — proyecto La Tapería del Boca Chueca
        </p>
      </div>
    </div>
  )
}
