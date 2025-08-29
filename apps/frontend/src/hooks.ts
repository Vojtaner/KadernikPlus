import { useNavigate, type NavigateOptions, type To } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setCurrentLocationAppendix } from './store/appUiSlice'
import { useScrollToTheTop } from './components/FormDialogs/AddProcedureButton'

export const useAppNavigate = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const scroll = useScrollToTheTop()

  function appNavigate(to: To, options?: NavigateOptions): void
  function appNavigate(delta: number): void
  function appNavigate(toOrDelta: To | number, options?: NavigateOptions): void {
    dispatch(setCurrentLocationAppendix(''))

    if (typeof toOrDelta === 'number') {
      navigate(toOrDelta)
    } else {
      navigate(toOrDelta, options)
    }
    scroll()
  }

  return appNavigate
}
