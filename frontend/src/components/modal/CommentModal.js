import ReactDOM from 'react-dom'

const CommentModal = ({
  position = 'right-0',
  width,
  open,
  onClose,
  children,
}) => {
  if (!open) return null

  return ReactDOM.createPortal(
    <>
      <div
        onClick={onClose}
        className={`overflow-y-scroll h-screen fixed   z-20  shadow-lg   ${position}`}
      >
        <div
          onClick={(e) => {
            e.stopPropagation()
          }}
          className='bg-white py-8 rounded-sm '
          style={{ width: `${width}` }}
        >
          {children}
        </div>
      </div>
    </>,
    document.getElementById('portal')
  )
}

export default CommentModal
