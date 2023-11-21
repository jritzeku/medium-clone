import { useEffect, useMemo, useState } from 'react'

const useElementOnScreen = (options, targetRef) => {
  const [isVisible, setIsVisible] = useState(false)

  const callbackFunction = (entries) => {
    const [entry] = entries //same as ->  const entry = entries[0]

    setIsVisible(entry.isIntersecting)
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const optionsMemo = useMemo(() => {
    return options
  }, [options])

  useEffect(() => {
    const observer = new IntersectionObserver(callbackFunction, optionsMemo)
    if (targetRef.current) observer.observe(targetRef.current)
  }, [targetRef, optionsMemo])

  return isVisible
}

export default useElementOnScreen
