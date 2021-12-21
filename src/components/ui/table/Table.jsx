
const Table = ({ children, width = 'w-max', height = 'max-h-75vh' }) => {
   return (
      <section className="mt-6 w-full overflow-custom animate__animated animate__fadeIn">
         <div className={`${width} mx-auto overflow-hidden rounded-lg shadow-lg`}>
            <div className={`${height} w-full overflow-custom`}>
               <table className="w-full relative">
                  {children}
               </table>
            </div>
         </div>
      </section>
   )
}

export default Table
