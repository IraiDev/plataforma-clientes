import Button from "../button/Button"

const P = ({ tag, value, highlight }) => (
  <p className='capitalize text-gray-500'>
    <strong className='text-gray-700'>{tag}</strong>: {value}
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
  onCreateActivity
}) => {
  return (
    <main
      className='bg-white shadow-lg p-3 grid gap-2 text-xs rounded-md border content-start transition duration-200 transform hover:scale-105'
      onDoubleClick={onClick}
    >
      <div className='flex flex-col gap-2'>
        <header className='font-semibold flex items-baseline gap-2 justify-between'>
          <h1 className='text-sm capitalize'>{title}</h1>
          <span
            title={isPending ? 'Tiene pendientes' : 'No tiene pendientes'}
            className={`px-2 py-0.5 rounded-md ${isPending
              ? 'bg-red-100 text-red-500 '
              : 'bg-green-100 text-green-500 '
              }`}
          >
            {numerator + 1}
          </span>
        </header>
        <section className='grid grid-cols-2 relative'>
          <P value={id} tag='iD' />
          <P value={state} tag='estado' />
          <P value={project} tag='proyecto' />
          <P value={priority} tag='prioridad' />
          <P value={userRequest} tag='solicita' />

          <Button
            className='absolute top-1/2 -right-1 rounded-full hover:bg-gray-200 hover:text-blue-500 flex items-center justify-center'
            type='icon'
            icon='fas fa-file-medical'
            onClick={onCreateActivity}
          />

        </section>
      </div>
      <footer>
        <strong className='text-gray-700'>Descripcion</strong>
        <p className='max-h-24 overflow-custom text-gray-500'>{desc}</p>
      </footer>
    </main>
  )
}

export default Card
