import { Outlet } from 'react-router-dom'
import { BurbujaAdmin } from '../components/admin/BurbujaAdmin'
import { Footer } from '../components/layout/Footer'
import { AvisoCookies } from '../components/layout/AvisoCookies'
import { Header } from '../components/layout/Header'

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <AvisoCookies />
      <BurbujaAdmin />
    </div>
  )
}
