const Table = ({ children, width = 'w-max', height = 'max-h-75vh' }) => {
  return (
    <section className='my-6 w-full overflow-auto border rounded-md shadow animate__animated animate__fadeIn'>
      <div className={`${width} mx-auto overflow-hidden`}>
        <div className={`${height} w-full overflow-auto`}>
          <table className='w-full relative'>{children}</table>
        </div>
      </div>
    </section>
  )
}

export default Table
