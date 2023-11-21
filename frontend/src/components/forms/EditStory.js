// @ts-nocheck
import Main from 'components/container/Main'
import PreviewImage from 'components/preview_image/PreviewImage'
import { TagsInput } from 'components/tag/TagsInput'
import { useFormik } from 'formik'
import Editor from 'pages/stories/Editor'
import { useRef, useState } from 'react'
import 'react-quill/dist/quill.snow.css'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import { editStoryAction } from 'redux/slices/storySlices'
import * as yup from 'yup'

const formSchema = yup.object().shape({
  title: yup.string().trim().required('Title required'),
  content: yup.string().trim().required('Content is required'),
  image: yup.string().trim().required('Image is required'),
})

const EditStory = ({ story }) => {
  const dispatch = useDispatch()
  const [storyTags, setStoryTags] = useState(story?.tags)
  const [showImage, setShowImage] = useState(false)

  const { id } = useParams()

  let history = useHistory()

  const userData = useSelector((state) => state?.user)

  const { userAuth } = userData

  const yourImage = useRef()

  const formik = useFormik({
    // initialValues: storyInitialValues,

    initialValues: {
      title: story?.title,
      content: story?.content,
      tags: story?.tags,
      image: story?.thumbnailImg,
    },

    onSubmit: (values) => {
      if (
        formik.values.content.replace(/<(.|\n)*?>/g, '').trim().length === 0
      ) {
        return
      }
      values.tags = storyTags

 

      const editedData = {
        title: values?.title,
        content: values?.content,
        tags: values?.tags,
        image: values?.image,
      }

 

      dispatch(editStoryAction([story?._id, editedData]))

      history.push(`/me/myStories`)
    },
    validationSchema: formSchema,
  })

  return (
    <Main>
      <div className='my-4 flex flex-col items-center gap-4'>
        <label htmlFor='' className='my-4'>
          Include tags relevant to your story
        </label>

        <form
          onSubmit={formik.handleSubmit}
          className='flex flex-col  items-center justify-center gap-4  mx-auto w-[85%] bg-white p-4 rounded-sm shadow-md'
        >
          <div className='w-full my-4'>
            <span className='text-[12px] text-red-600'>Required *</span>
            <label htmlFor='' className='my-4'>
              Include tags relevant to your story
            </label>

            <TagsInput setStoryTags={setStoryTags} storyTags={storyTags} />
          </div>

          <div className='w-full my-4'>
            <span className='text-[12px] text-red-600'>Required *</span>
            {story && (
              <div className='border-2 flex items-center justify-between p-2 gap-4'>
                <span>Current story thumbnail image: </span>
                <img
                  src={story?.thumbnailImg}
                  alt=''
                  style={{ width: '40px' }}
                />
              </div>
            )}

            <label
              for='files'
              className=' flex items-center justify-between bg-gray-50 hover:brightness-90 w-full mx-auto border-2 border-dashed p-4 cursor-pointer'
            >
              Select new thumbnail Image
              <input
                id='files'
                type='file'
                className='hidden'
                accept='image/jpeg, image/png'
                onChange={(e) => {
                  setShowImage(true)
 
                  formik.setFieldValue('image', e.currentTarget.files[0])
                }}
              />
              {formik.values.image && showImage && (
                <PreviewImage file={formik.values?.image} />
              )}
            </label>

            <span
              ref={yourImage}
              className={`${
                showImage ? 'block' : 'hidden'
              } text-gray-600 text-[12px]`}
            >
              Your thumbnail is uploaded: {formik.values?.image?.name}
            </span>
          </div>

          <div className='w-full my-4'>
            <span className='text-[12px] text-red-600'>Required *</span>
            <input
              value={formik.values.title}
              onChange={formik.handleChange('title')}
              type='text '
              placeholder='Title'
              className='rounded-sm border-[1px] text-[14px] p-2 w-[100%]'
            />
            <div className='text-red-400 mb-2'>
              {formik.touched.title && formik.errors.title}
            </div>
          </div>

          <div className='w-full my-4'>
            <span className='text-[12px] text-red-600'>Required *</span>
            <Editor
              value={formik.values.content}
              onChange={formik.handleChange('content')}
            />

            <div className='text-red-900 mb-2'>
              {formik.touched.content &&
                formik.values.content.replace(/<(.|\n)*?>/g, '').trim()
                  .length === 0 &&
                formik.errors.title}
            </div>
          </div>

          <div className='flex gap-6 items-center'>
            <button
              name='publishButton'
              onKeyDown={(e) => {
                e.key === 'Enter' && e.preventDefault()
              }}
              type='submit'
              style={{ marginTop: '5px' }}
              className='bg-green-700 text-white px-3 py-1 rounded-full hover:brightness-75'
            >
              Edit story
            </button>
          </div>
        </form>
      </div>
    </Main>
  )
}

export default EditStory
