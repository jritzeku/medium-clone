// @ts-nocheck
 
import { useEffect, useState } from 'react'
import './TagsInput.css'

 
export const TagsInput = ({ setStoryTags, storyTags }) => {
  const removeTags = (indexToRemove) => {
    setStoryTags([...storyTags.filter((_, index) => index !== indexToRemove)])
  }
  const addTags = (e) => {
 

    if (e.target.value !== '') {
      setStoryTags([...storyTags, e.target.value.toLowerCase()])

      e.target.value = ''
    }
  }
  return (
    <div className='tags-input w-full border-2'>
      <ul id='tags'>
        {storyTags?.map((tag, index) => (
          <li key={index} className='tag'>
            <span className='tag-title'>{tag}</span>
            <span className='tag-close-icon' onClick={() => removeTags(index)}>
              x
            </span>
          </li>
        ))}
      </ul>
      <input
        type='text'
      
        onKeyUp={(e) =>
          e.keyCode === 32 && e.target.value.trim() !== '' ? addTags(e) : null
        }
        placeholder='Press spacebar to add tags'
      />
    </div>
  )
}


/*
NOTES:

-This tags input inspired by https://dev.to/prvnbist/create-a-tags-input-component-in-reactjs-ki
*/