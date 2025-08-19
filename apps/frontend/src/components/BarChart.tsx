import { BarChart } from '@mui/x-charts/BarChart'
import AppTheme from '../AppTheme'
import dayjs from 'dayjs'
import type { VisitWithServicesWithProceduresWithStockAllowances } from '../entities/visit'

type AppBarChartProps = {
  visitData: VisitWithServicesWithProceduresWithStockAllowances[]
  from: dayjs.Dayjs
  to: dayjs.Dayjs
}

const AppBarChart = (props: AppBarChartProps) => {
  const { visitData, from, to } = props
  const { costs, profit, labels } = getCostsProfitRevenue(visitData, {
    from: from.toDate(),
    to: to.toDate(),
  })

  return (
    <BarChart
      height={260}
      xAxis={[{ scaleType: 'band', data: labels }]}
      series={[
        {
          data: costs,
          label: 'Náklady',
          valueFormatter: (value) => `${value} Kč`,
          color: AppTheme.palette.error.main,
          stack: 'finance',
        },
        {
          data: profit,
          valueFormatter: (value) => `${value} Kč`,
          label: 'Zisk',
          color: AppTheme.palette.success.main,
          stack: 'finance',
        },
      ]}
      margin={{ top: 20, bottom: 20, left: 0, right: 20 }}
      barLabel={(item, context) => (context.bar.height > 30 ? `${item.value} Kč` : null)}
    />
  )
}

export default AppBarChart

type DateRange = {
  from?: Date
  to?: Date
}

type VisitMap = Map<string, { cost: number; revenue: number }>
type Result = { costs: number[]; revenue: number[]; profit: number[]; labels: string[] }

export const getCostsProfitRevenue = (
  visits: VisitWithServicesWithProceduresWithStockAllowances[],
  range?: DateRange
): Result => {
  const visitMap = aggregateVisitsByDate(visits, range)
  const allLabels = getDateLabelsInRange(visitMap, range)

  const costs: number[] = []
  const revenue: number[] = []
  const profit: number[] = []

  const labelToKey = (label: string): string => {
    if (label.match(/^\d{2}\.\d{2}$/)) {
      const [day, month] = label.split('.')
      const year = range?.from ? dayjs(range.from).year() : dayjs().year()
      return dayjs(`${year}-${month}-${day}`, 'YYYY-MM-DD').format('YYYY-MM-DD')
    } else {
      return dayjs(label, 'MMMM YYYY').format('YYYY-MM')
    }
  }

  for (const label of allLabels) {
    const key = labelToKey(label)
    if (key.length === 10) {
      const entry = visitMap.get(key) ?? { cost: 0, revenue: 0 }
      costs.push(entry.cost)
      revenue.push(entry.revenue)
      profit.push(entry.revenue - entry.cost)
    } else if (key.length === 7) {
      let monthCost = 0
      let monthRevenue = 0

      for (const [dateKey, val] of visitMap.entries()) {
        if (dateKey.startsWith(key)) {
          monthCost += val.cost
          monthRevenue += val.revenue
        }
      }
      costs.push(monthCost)
      revenue.push(monthRevenue)
      profit.push(monthRevenue - monthCost)
    }
  }

  return { labels: allLabels, costs, revenue, profit }
}

function aggregateVisitsByDate(
  visits: VisitWithServicesWithProceduresWithStockAllowances[],
  range?: DateRange
): VisitMap {
  const map: VisitMap = new Map()

  for (const visit of visits) {
    const visitDate = new Date(visit.date)
    if (range?.from && visitDate < range.from) {
      continue
    }
    if (range?.to && visitDate > range.to) {
      continue
    }

    const key = visitDate.toISOString().split('T')[0]
    const revenue = parseFloat(`${visit.paidPrice}`)
    const cost = calculateVisitCost(visit)

    const existing = map.get(key)
    if (existing) {
      existing.revenue += revenue
      existing.cost += cost
    } else {
      map.set(key, { cost, revenue })
    }
  }

  return map
}

function calculateVisitCost(visit: VisitWithServicesWithProceduresWithStockAllowances): number {
  let total = 0

  for (const procedure of visit.procedures ?? []) {
    for (const allowance of procedure.stockAllowances ?? []) {
      const qty = parseFloat(`${allowance.quantity}`)
      if (!allowance.stockItem) {
        throw new Error(`Stock item not found for allowance: ${JSON.stringify(allowance)}`)
      }
      const pricePerUnit = allowance.stockItem.price / allowance.stockItem.quantity
      total += qty * pricePerUnit
    }
  }
  return total
}

export function getDateLabelsInRange(map: VisitMap, range?: DateRange): string[] {
  const labels: string[] = []

  if (range?.from && range?.to) {
    const from = dayjs(range.from).startOf('day')
    const to = dayjs(range.to).startOf('day')
    const diffDays = to.diff(from, 'day')

    if (diffDays > 60) {
      let cursor = from.startOf('month')
      while (cursor.isBefore(to) || cursor.isSame(to, 'month')) {
        labels.push(cursor.format('MMMM YYYY'))
        cursor = cursor.add(1, 'month')
      }
    } else {
      let cursor = from
      while (cursor.isBefore(to) || cursor.isSame(to, 'day')) {
        labels.push(cursor.format('DD.MM'))
        cursor = cursor.add(1, 'day')
      }
    }
  } else {
    labels.push(...Array.from(map.keys()))
    labels.sort((a, b) => dayjs(a).unix() - dayjs(b).unix())
  }

  return labels
}
