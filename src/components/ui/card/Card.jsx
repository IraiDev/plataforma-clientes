const P = ({ tag, value, highlight }) => (
  <p
    className={`
      ${highlight ? 'text-red-400 font-semibold' : 'text-gray-600'} capitalize
    `}
  >
    {tag}: {value}
  </p>
)

const Card = ({
  title,
  desc,
  numerator,
  id,
  project,
  state,
  priority,
  userRequest,
  isPending,
  onClick,
}) => {
  return (
    <main
      className='bg-white shadow-lg p-2.5 grid gap-3 text-xs rounded-md border'
      onDoubleClick={onClick}
    >
      <header className='font-semibold flex items-baseline gap-2 justify-between'>
        <span className='bg-green-100 text-green-500 px-2 py-0.5 rounded-md'>
          {numerator + 1}
        </span>
        <h1 className='text-lg capitalize'>{title}</h1>
      </header>
      <section className='grid grid-cols-2'>
        <P value={id} tag='iD' />
        <P value={state} tag='estado' highlight={isPending} />
        <P value={project} tag='proyecto' />
        <P value={priority} tag='prioridad' />
        <P value={userRequest} tag='solicita' />
      </section>
      <footer>
        <h5 className='text-gray-600'>Descripcion</h5>
        <p className='max-h-24 overflow-custom'>{desc}</p>
      </footer>
    </main>
  )
}

export default Card
