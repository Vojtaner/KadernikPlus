import { useNavigate, type NavigateOptions, type To } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setCurrentLocationAppendix, type AppLanguage } from './store/appUiSlice'
import { useScrollToTheTop, type StockViewKey, type VisitViewKey } from './entity'
import { useState, useEffect, useCallback } from 'react'
import dayjs, { Dayjs } from 'dayjs'
import { produce } from 'immer'
import { useAppLocation } from './routes/reactRouter'

export const useAppNavigate = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useAppLocation()
  const scroll = useScrollToTheTop()

  useEffect(() => {
    scroll()
  }, [location.pathname])

  function appNavigate(to: To, options?: NavigateOptions): void
  function appNavigate(delta: number): void
  function appNavigate(toOrDelta: To | number, options?: NavigateOptions): void {
    dispatch(setCurrentLocationAppendix(''))
    if (typeof toOrDelta === 'number') {
      navigate(toOrDelta)
    } else {
      navigate(toOrDelta, options)
    }
  }

  return appNavigate
}

export type DatesRange = {
  to: Dayjs
  from: Dayjs
}

export type DatesFilter = {
  [K in keyof DatesRange]: DatesRange[K] | string | undefined
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
    dashBoardVisitOverView: {
      dates: { from: dayjs().subtract(1, 'day').toISOString(), to: dayjs().add(1, 'day').toISOString() },
      view: 'byAll',
    },
    allVisitsPage: {
      dates: { from: dayjs().subtract(1, 'day').toISOString(), to: dayjs().add(1, 'day').toISOString() },
      view: 'byAll',
    },
  },
  revenue: { dates: { from: dayjs().subtract(7, 'day').toISOString(), to: dayjs().toISOString() } },
  consumption: {
    dates: { from: dayjs().startOf('month').toISOString(), to: dayjs().endOf('month').toISOString() },
    view: 'byUser',
  },
  language: 'cs',
}

const STORAGE_KEY = 'persistentFilters'

export function usePersistentFilters() {
  const [filters, setFilters] = useState<PersistentFiltersType>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : DEFAULT_PERSISTENT_FILTERS
    } catch {
      return DEFAULT_PERSISTENT_FILTERS
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filters))
  }, [filters])

  const updateFilters = (updater: (draft: typeof filters) => void) => {
    setFilters((prev) => produce(prev, updater))
  }

  return [filters, updateFilters] as const
}

export const useVisitListFilters = (
  type: VisitListApplyFilter
): [
  {
    dates: DatesFilter
    view?: VisitViewKey
  },
  (updater: (draft: { dates: DatesFilter; view?: VisitViewKey }) => void) => void,
] => {
  const [filters, updateFilter] = usePersistentFilters()

  const scopedUpdater = useCallback(
    (updater: (draft: { dates: DatesFilter; view?: VisitViewKey }) => void) => {
      updateFilter((draft) => {
        if (type === 'dashBoardVisitOverView') {
          updater(draft.visits.dashBoardVisitOverView)
        } else if (type === 'allVisitsPage') {
          updater(draft.visits.allVisitsPage)
        }
      })
    },
    [type, updateFilter]
  )

  if (type === 'dashBoardVisitOverView') {
    return [filters.visits.dashBoardVisitOverView, scopedUpdater]
  }
  if (type === 'allVisitsPage') {
    return [filters.visits.allVisitsPage, scopedUpdater]
  }

  return [
    {
      dates: { from: dayjs().subtract(1, 'day').toISOString(), to: dayjs().add(1, 'day').toISOString() },
      view: 'byAll',
    },
    () => {},
  ]
}

export function useDebounce<T>(value: T, delay: number) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])

  return debounced
}
