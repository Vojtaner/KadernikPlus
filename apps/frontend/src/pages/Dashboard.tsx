import { Stack } from '@mui/material'
import PhotoCameraFrontOutlinedIcon from '@mui/icons-material/PhotoCameraFrontOutlined'
// import { useState } from 'react'
// import SelectField from '../components/SelectField'
import VisitsList from './VisitsList'
import DashBoardCard from '../components/DashBoardCard'
import RevenuChart from '../components/RevenueChart'

export const Dashboard = () => {
  // const [selectedId, setSelectedId] = useState<string>('1')

  // const onSelectDate = (value: string) => {
  //   setSelectedId(value)
  // }

  return (
    <Stack direction="column" rowGap={5}>
      <DashBoardCard
        title="Přehled návštěv"
        icon={<PhotoCameraFrontOutlinedIcon fontSize="medium" />}
        // action={
        //   <SelectField<DateListType>
        //     items={DatesList}
        //     keyExtractor={(date) => date.id}
        //     labelExtractor={(date) => date.name}
        //     value={selectedId}
        //     onChange={onSelectDate}
        //     sx={{ height: '30px' }}
        //   />
        // }
      >
        <VisitsList columnHeaderHeight={0} hideFooter={true} />
      </DashBoardCard>
      <DashBoardCard title="Tržby" icon={<PhotoCameraFrontOutlinedIcon fontSize="medium" />}>
        <RevenuChart />
      </DashBoardCard>
    </Stack>
  )
}
