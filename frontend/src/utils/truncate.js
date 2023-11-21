export const truncate = (text, limit = 100) => {
 
  return text.substring(0, limit) + '...'
}
