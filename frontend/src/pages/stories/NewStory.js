// @ts-nocheck
 
import AddStory from 'components/forms/AddStory'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { ClipLoader } from 'react-spinners'
import { getDraftAction } from 'redux/slices/draftSlices'

const NewStory = () => {
  const { id } = useParams()

  const dispatch = useDispatch()

  const draftData = useSelector((state) => state?.draft)

  const { draft, loading, appErr, serverErr } = draftData

  useEffect(() => {
    if (id) {
      dispatch(getDraftAction(id))
    }
  }, [])

  return (
    <div  >
      {!id ? (
        <AddStory />
      ) : loading ? (
        <div className='flex items-center justify-center '>
          <ClipLoader
            color={'#008000'}
            loading={loading}
      
            size={150}
            aria-label='Loading Spinner'
            data-testid='loader'
          />
        </div>
      ) : appErr || serverErr ? (
        <h1>
          {serverErr} {appErr}
        </h1>
      ) : (
        <AddStory draft={draft} />
      )}
    </div>
  )
}

export default NewStory
