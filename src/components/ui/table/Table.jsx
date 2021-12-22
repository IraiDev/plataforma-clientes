
const Table = ({ children, width = 'w-max', height = 'max-h-75vh' }) => {
   return (
      <section className="mt-6 w-full overflow-custom border rounded-md shadow-xl animate__animated animate__fadeIn">
         <div className={`${width} mx-auto overflow-hidden`}>
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
