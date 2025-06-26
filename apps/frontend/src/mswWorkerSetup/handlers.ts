// import { http, HttpResponse } from 'msw'
// import hairToolApi from '../axios/axios'

import { mockGetUser } from '../api/api'

export const handlers = [mockGetUser()]
