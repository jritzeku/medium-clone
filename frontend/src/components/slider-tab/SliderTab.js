// @ts-nocheck

import { memo, useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'

const SliderTab = ({
  setActiveSection,

  activeSection,
  topics,
  defaultSection,
}) => {
  const sections = useRef()

  const [sliderTopics, setSliderTopics] = useState([])
  const dispatch = useDispatch()

  useEffect(() => {
    setSliderTopics(topics)
  }, [topics])

  const changeActiveSection = (e) => {
    const allSections = Array.from(sections.current.children)

    allSections.map((section) => section.classList.remove('border-b-[1px]'))
    const currentSection = e.target
    currentSection.classList.add('border-b-[1px]')

    setActiveSection(currentSection.innerText)
  }

  return (
    <div className='py-6 relative '>
      <ul
        id='sections'
        ref={sections}
        className='flex gap-6 text-[12px] text-gray-500 h-[30px] border-b-[1px]'
      >
        {sliderTopics.map((topic, index) => (
          <li
            key={index}
            onClick={(e) => changeActiveSection(e)}
            className={`border-gray-500  cursor-pointer hover:brightness-50
            ${topic === activeSection ? 'border-b-[1px]' : ''}`}
          >
            {topic}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default memo(SliderTab)
