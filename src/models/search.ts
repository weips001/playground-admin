import { useState, useCallback } from 'react'

export default () => {
  const [search, setSearch] = useState()

  // 增加数量
  const changeSearch = useCallback((params) => {
    const {phone} = params
    if (phone != undefined) {
      const data = {
        phone
      }
      setSearch(data)
    } else {
      setSearch({})
    }
  }, [])

  return {
    search,
    changeSearch
  }
}