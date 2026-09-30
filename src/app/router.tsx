import { createBrowserRouter } from 'react-router-dom'
import { RutaAdmin } from '../features/auth/RutaAdmin'
import { RutaProtegida } from '../features/auth/RutaProtegida'
import { Acceso } from '../pages/Acceso'
import { Admin } from '../pages/Admin'
import { AreaParticular } from '../pages/AreaParticular'
import { AreaProfesional } from '../pages/AreaProfesional'
import { Blog } from '../pages/Blog'
import { Directorio } from '../pages/Directorio'
import { FichaProfesional } from '../pages/FichaProfesional'
import { Home } from '../pages/Home'
import { NotFound } from '../pages/NotFound'
import { ParaProfesionales } from '../pages/ParaProfesionales'
import { SolicitarPresupuesto } from '../pages/SolicitarPresupuesto'
import { SolicitudDetalle } from '../pages/SolicitudDetalle'
import { Layout } from './Layout'

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/blog', element: <Blog /> },
      { path: '/profesionales', element: <Directorio /> },
      { path: '/profesionales/:slug', element: <FichaProfesional /> },
      { path: '/solicitar-presupuesto', element: <SolicitarPresupuesto /> },
      { path: '/para-profesionales', element: <ParaProfesionales /> },
      {
        path: '/solicitudes/:id',
        element: (
          <RutaProtegida>
            <SolicitudDetalle />
          </RutaProtegida>
        ),
      },
      {
        path: '/particular/*',
        element: (
          <RutaProtegida>
            <AreaParticular />
          </RutaProtegida>
        ),
      },
      {
        path: '/profesional/*',
        element: (
          <RutaProtegida>
            <AreaProfesional />
          </RutaProtegida>
        ),
      },
      {
        path: '/admin/*',
        element: (
          <RutaAdmin>
            <Admin />
          </RutaAdmin>
        ),
      },
      { path: '/acceso', element: <Acceso /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])
