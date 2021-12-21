import React from 'react'
import { Link } from 'react-router-dom'

const Error404 = () => {
   return (
      <div className='h-screen w-full bg-gray-50 flex items-center justify-center'>
         <section className='p-10 bg-white rounded-md shadow-lg border text-center grid gap-10 w-96'>
            <h1 className='text-8xl font-bold'>404</h1>
            <p>Pagina no encontrada</p>
            <p className='text-sm text-gray-500'>
               La pagina solicitada no existe dentro del sistema
               <strong className='uppercase'> plataforma clientes</strong>
            </p>
            <Link
               className='hover:text-blue-500 hover:bg-blue-100 py-1 px-3 rounded-full w-max transition duration-300 mx-auto'
               to='/' >
               Ir a la pagina de inicio
            </Link>
         </section>
      </div>
   )
}

export default Error404
