import { createBrowserRouter } from 'react-router-dom'
import { Acceso } from '../pages/Acceso'
import { Admin } from '../pages/Admin'
import { AreaParticular } from '../pages/AreaParticular'
import { AreaProfesional } from '../pages/AreaProfesional'
import { Directorio } from '../pages/Directorio'
import { FichaProfesional } from '../pages/FichaProfesional'
import { Home } from '../pages/Home'
import { NotFound } from '../pages/NotFound'
import { SolicitarPresupuesto } from '../pages/SolicitarPresupuesto'
import { Layout } from './Layout'

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/profesionales', element: <Directorio /> },
      { path: '/profesionales/:slug', element: <FichaProfesional /> },
      { path: '/solicitar-presupuesto', element: <SolicitarPresupuesto /> },
      { path: '/particular/*', element: <AreaParticular /> },
      { path: '/profesional/*', element: <AreaProfesional /> },
      { path: '/admin/*', element: <Admin /> },
      { path: '/acceso', element: <Acceso /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])
