// @ts-nocheck
import Modal from 'components/modal/Modal'
import { useFormik } from 'formik'
import { useDispatch, useSelector } from 'react-redux'
import { createListAction } from 'redux/slices/listSlices'
import * as yup from 'yup'

const formSchema = yup.object().shape({
  name: yup.string().required('List name is required'),
  description: yup.string().required('List description is required'),
})

const CreateList = ({ open, onClose, setOpenEdit }) => {
  const dispatch = useDispatch()

  const list = useSelector((store) => store?.list)
  const { listCreated, loading, appErr, serverErr } = list

  const formik = useFormik({
    enableReinitialize: true,

    initialValues: {
      name: '',
      description: '',
      isPrivate: [],
    },

    onSubmit: (values) => {
      const listData = {
        name: values?.name,
        description: values?.description,
        isPrivate: values?.isPrivate[0],
      }

      dispatch(createListAction(listData))
      setOpenEdit(false)
    },
    validationSchema: formSchema,
  })

  return (
    <Modal width='500px' open={open} onClose={onClose}>
      <img
        onClick={onClose}
        src='/images/close.png'
        alt=''
        style={{ width: '24px' }}
        className='cursor-pointer ml-[90%]'
      />

      <form
        onSubmit={formik.handleSubmit}
        className='flex flex-col items-center justify-center gap-5 bg-white  py-8 '
      >
        {appErr || serverErr ? (
          <div className='text-red-400'>
            {serverErr} {appErr}
          </div>
        ) : null}

        <p className='text-3xl font-bold'> Create new list</p>

        <input
          value={formik.values?.name}
          onChange={formik.handleChange('name')}
          onBlur={formik.handleBlur('name')}
          type='text '
          placeholder='List name'
          className='rounded-full border-[1px] text-[14px] p-2 w-[50%]'
        />

        <div className='text-red-400 mb-2'>
          {formik.touched?.name && formik.errors?.name}
        </div>

        <input
          value={formik.values?.description}
          onChange={formik.handleChange('description')}
          onBlur={formik.handleBlur('description')}
          type='text '
          placeholder='Description of list'
          className='rounded-full border-[1px] text-[14px] p-2 w-[50%]'
        />

        <div className='text-red-500'>
          {formik.touched?.description && formik.errors?.description}
        </div>

        <div className='flex items-center justify-center gap-2 py-2'>
          <label htmlFor=''>Make it private</label>

          <input
            type='checkbox'
            name='isPrivate'
            onChange={formik.handleChange}
            className='w-4 h-4 border-2'
            value={'true'}
          />
        </div>

        <button
          type='submit'
          className='bg-green-700 rounded-full px-3 py-2 text-[12px] text-white cursor-pointer hover:brightness-90'
        >
          Create List
        </button>
      </form>
    </Modal>
  )
}

export default CreateList
