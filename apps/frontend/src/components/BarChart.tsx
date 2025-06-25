import { BarChart } from '@mui/x-charts/BarChart'
import AppTheme from '../AppTheme'

const AppBarChart = () => {
  return (
    <BarChart
      series={[
        { data: [4, 2, 5, 4, 1], stack: 'A', label: 'Series A1', color: AppTheme.palette.primary.main },
        { data: [2, 8, 1, 3, 1], stack: 'A', label: 'Series A2', color: AppTheme.palette.success.main },
      ]}
      barLabel={(item, context) => {
        if ((item.value ?? 0) > 10) {
          return 'High'
        }
        return context.bar.height < 60 ? null : item.value?.toString()
      }}
      height={350}
    />
  )
}

export default AppBarChart
