import { Stack } from '@mui/material'
import PhotoCameraFrontOutlinedIcon from '@mui/icons-material/PhotoCameraFrontOutlined'
// import { useState } from 'react'
// import SelectField from '../components/SelectField'
import VisitsList from './VisitsList'
import DashBoardCard from '../components/DashBoardCard'

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
        {<VisitsList columnHeaderHeight={0} hideFooter={true} />}
      </DashBoardCard>
      {/* <DashBoardCard title="Tržby" icon={<PhotoCameraFrontOutlinedIcon fontSize="medium" />}>
        <AppBarChart />
      </DashBoardCard> */}
    </Stack>
  )
}

// type DateListType = { id: string; name: string }

// const DatesList: DateListType[] = [
//   { id: '1', name: '12.5.2025' },
//   { id: '2', name: '13.5.2025' },
//   { id: '3', name: '14.5.2025' },
//   { id: '4', name: '15.5.2025' },
// ]
