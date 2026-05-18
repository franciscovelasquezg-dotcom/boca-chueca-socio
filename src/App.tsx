import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { ProtectedRoute } from './components/ui/ProtectedRoute'
import { Layout }         from './components/layout/Layout'
import { Login }          from './pages/Login'
import { Dashboard }      from './pages/Dashboard'
import { MisIdeas }       from './pages/MisIdeas'
import { Mercado }        from './pages/Mercado'
import { Recetas }        from './pages/Recetas'

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index           element={<Dashboard />} />
            <Route path="ideas"    element={<MisIdeas />}  />
            <Route path="mercado"  element={<Mercado />}   />
            <Route path="recetas"  element={<Recetas />}   />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'transparent',
            boxShadow: 'none',
            padding: 0,
            margin: 0,
          }
        }}
      />
    </>
  )
}
