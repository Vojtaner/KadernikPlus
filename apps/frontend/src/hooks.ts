import { useNavigate, type NavigateOptions, type To } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setCurrentLocationAppendix, type AppLanguage } from './store/appUiSlice'
import { useScrollToTheTop } from './components/FormDialogs/AddProcedureButton'
import type { StockViewKey, VisitViewKey } from './entity'
import { useState, useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import dayjs, { Dayjs } from 'dayjs'
import { produce } from 'immer'

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

export type DatesFilter = {
  to: Dayjs | string | undefined
  from: Dayjs | string | undefined
}

export type PersistentFiltersType = {
  visits: {
    dashBoardVisitOverView: { dates: DatesFilter; view: 'byAll' }
    allVisitsPage: {
      dates: DatesFilter
      view: VisitViewKey
    }
  }
  revenue: { dates: DatesFilter }
  consumption: {
    dates: DatesFilter
    view: StockViewKey
  }
  language: AppLanguage
}

export type VisitListApplyFilter = keyof PersistentFiltersType['visits'] | 'onlyOpenVisits'

export const DEFAULT_PERSISTENT_FILTERS: PersistentFiltersType = {
  visits: {
    dashBoardVisitOverView: { dates: { from: dayjs().subtract(1, 'day'), to: dayjs().add(1, 'day') }, view: 'byAll' },
    allVisitsPage: {
      dates: { from: dayjs().subtract(1, 'day'), to: dayjs().add(1, 'day') },
      view: 'byAll',
    },
  },
  revenue: { dates: { from: dayjs().subtract(7, 'day'), to: dayjs() } },
  consumption: {
    dates: { from: dayjs().startOf('month'), to: dayjs().endOf('month') },
    view: 'byUser',
  },
  language: 'cs',
}

export function usePersistentFilters() {
  const { user } = useAuth0()
  const storageKey = `filters:${user?.sub}`

  const [filters, setFilters] = useState<PersistentFiltersType>(() => {
    if (!user?.sub) {
      return DEFAULT_PERSISTENT_FILTERS
    }
    try {
      const stored = localStorage.getItem(storageKey)
      return stored ? JSON.parse(stored) : DEFAULT_PERSISTENT_FILTERS
    } catch {
      return DEFAULT_PERSISTENT_FILTERS
    }
  })

  useEffect(() => {
    if (!user?.sub) {
      return
    }
    localStorage.setItem(storageKey, JSON.stringify(filters))
  }, [user?.sub, filters])

  const updateFilters = (updater: (draft: typeof filters) => void) => {
    setFilters((prev: typeof filters) => produce(prev, updater))
  }

  return [filters, updateFilters] as const
}
