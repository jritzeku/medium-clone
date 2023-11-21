// @ts-nocheck
import React, { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'

const formSchema = Yup.object({
  content: Yup.string().required('Content is required'),
})

const AddComment = ({ parentId, setIsReplying, addCommentHandler }) => {
  const [commentBody, setCommentBody] = useState('')

  const dispatch = useDispatch()

  const formik = useFormik({
    initialValues: {
      content: '',
    },
    onSubmit: (values) => {
      setCommentBody('')
      setIsReplying(false)

      const data = {
        content: values?.content,
      }

      addCommentHandler(data, parentId)
    },
    validationSchema: formSchema,
  })

  return (
    <form onSubmit={formik.handleSubmit} className='flex flex-col p-4'>
      <textarea
        onChange={formik.handleChange('content')}
        onBlur={formik.handleBlur('content')}
        rows='5'
        cols='10'
        className='rounded-lg appearance-none block w-full py-3 px-3 text-base  leading-tight text-gray-600 bg-transparent focus:bg-transparent  border border-gray-200 focus:border-gray-500  focus:outline-none'
        type='text'
      ></textarea> 
 
      <button
        type='submit'
        className='my-2 border-[1px] rounded-full bg-green-700 text-white border-zinc-400 w-40 py-2 hover:brightness-75'
      >
        Add Comment
      </button>
    </form>
  )
}

export default AddComment
