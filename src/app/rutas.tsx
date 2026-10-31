import type { RouteObject } from 'react-router-dom'
import { RutaAdmin } from '../features/auth/RutaAdmin'
import { RutaProtegida } from '../features/auth/RutaProtegida'
import { Acceso } from '../pages/Acceso'
import { Admin } from '../pages/Admin'
import { AreaParticular } from '../pages/AreaParticular'
import { AreaProfesional } from '../pages/AreaProfesional'
import { Blog } from '../pages/Blog'
import { BlogPost } from '../pages/BlogPost'
import { Directorio } from '../pages/Directorio'
import { FichaProfesional } from '../pages/FichaProfesional'
import { Home } from '../pages/Home'
import { NotFound } from '../pages/NotFound'
import { PaginaOficio } from '../pages/PaginaOficio'
import { OFICIOS_SEO } from '../features/seo/oficios'
import { ParaProfesionales } from '../pages/ParaProfesionales'
import { AvisoLegal, Cookies, Privacidad } from '../pages/Legal'
import { ReclamarFicha } from '../pages/ReclamarFicha'
import { RestablecerContrasena } from '../pages/RestablecerContrasena'
import { Verificar } from '../pages/Verificar'
import { SolicitarPresupuesto } from '../pages/SolicitarPresupuesto'
import { SolicitudDetalle } from '../pages/SolicitudDetalle'
import { Layout } from './Layout'

// Rutas de la aplicación. Se usan en el navegador (router.tsx) y al generar el HTML estático (entry-servidor.tsx).
export const rutas: RouteObject[] = [
  {
    element: <Layout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/blog', element: <Blog /> },
      { path: '/blog/:slug', element: <BlogPost /> },
      { path: '/profesionales', element: <Directorio /> },
      { path: '/profesionales/:slug', element: <FichaProfesional /> },
      { path: '/reclamar/:slug', element: <ReclamarFicha /> },
      { path: '/legal/aviso-legal', element: <AvisoLegal /> },
      { path: '/legal/privacidad', element: <Privacidad /> },
      { path: '/legal/cookies', element: <Cookies /> },
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
      // Una página por oficio, en toda España y por lugar: /electricistas, /electricistas/madrid.
      ...OFICIOS_SEO.flatMap((oficio) => [
        { path: `/${oficio.url}`, element: <PaginaOficio oficio={oficio} /> },
        { path: `/${oficio.url}/:lugar`, element: <PaginaOficio oficio={oficio} /> },
      ]),
      { path: '/acceso', element: <Acceso /> },
      { path: '/restablecer-contrasena', element: <RestablecerContrasena /> },
      { path: '/verificar', element: <Verificar /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]
