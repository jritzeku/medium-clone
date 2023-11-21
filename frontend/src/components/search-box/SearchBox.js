import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'

const SearchBox = () => {
  const [keyword, setKeyword] = useState('')
  const history = useHistory()

  const submitHandler = (e) => {
    e.preventDefault()

    if (keyword.trim()) {
      const newWindow = window.open(
        `/search/${keyword}`,
        '_blank',
        'noopener,noreferrer' //for security reasons
      )
      if (newWindow) newWindow.opener = null
    } else {
      history.push('/')
    }
  }

  return (
    <form className=' pl-[6px]' onSubmit={submitHandler}>
      <div className='flex items-center justify-center gap-2 relative'>
        <img
          src='/images/search.png'
          alt=''
          style={{ width: '14px' }}
          className='absolute left-4'
        />
        <input
          className='py-2 w-[240px] pl-12 bg-gray-100 rounded-full text-[12px]'
          type='text'
          placeholder='Search by author, title, tags '
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </div>
    </form>
  )
}

export default SearchBox

 