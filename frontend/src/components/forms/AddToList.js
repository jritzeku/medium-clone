// @ts-nocheck
import React from 'react'
import { useFormik } from 'formik'
import * as yup from 'yup'

const formSchema = yup.object().shape({
  listChoices: yup.array().min(1).required(),
})

const AddToList = ({
  myLists,
  story,
  addToListHandler,
  setShowListChoices,
}) => {
  const formik = useFormik({
    enableReinitialize: true,

    initialValues: {
      listChoices: [],
    },

    onSubmit: (values) => {
      addToListHandler(story?._id, values)
      setShowListChoices(false)
    },
    validationSchema: formSchema,
  })

  return (
    <>
      <form onSubmit={formik.handleSubmit} className='py-1 p-3'>
        <div className='text-red-400 mb-2'>{formik.errors?.listChoices}</div>

        {myLists?.map((list, index) => (
          <div key={index} className='flex items-center  gap-2 py-2 '>
            {list?.stories?.find((s) => s?._id === story?._id) ? (
              <input
                disabled={true}
                checked={true}
                type='checkbox'
                name='listChoices'
                onChange={formik.handleChange}
                className='w-4 h-4 border-2  '
                value={list?._id.toString()}
              />
            ) : (
              <input
                type='checkbox'
                name='listChoices'
                onChange={formik.handleChange}
                className='w-4 h-4 border-2 accent-green-700 '
                value={list?._id.toString()}
              />
            )}

            <label htmlFor=''>{list?.name}</label>
          </div>
        ))}

        <button
          type='submit'
          className={`${
            !(formik.isValid && formik.dirty)
              ? 'text-white rounded-full opacity-50 bg-gray-400 my-2 p-2 '
              : 'p-2 text-white rounded-full   bg-green-800  my-2 hover:brightness-75'
          }`}
          disabled={!(formik.isValid && formik.dirty)}
        >
          Add story to lists
        </button>
      </form>

      <p className='text-gray-600 my-2'>
        To create list or to edit/remove list, visit
        <span
          onClick={() => {
            const newWindow = window.open(
              `/me/library`,
              '_blank',
              'noopener,noreferrer' //for security reasons
            )
            if (newWindow) newWindow.opener = null
          }}
          className='text-green-700 cursor-pointer ml-2'
        >
          Library section
        </span>
      </p>
    </>
  )
}

export default AddToList
 