import axios from 'axios'

const apiUrl = import.meta.env.VITE_ENABLE_MOCKS === 'true'

export const hairToolApi = axios.create(
  apiUrl
    ? {}
    : {
        baseURL: 'http://kadernikplus.cz/',
      }
)
