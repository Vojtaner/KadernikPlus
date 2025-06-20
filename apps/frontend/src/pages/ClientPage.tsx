import { Divider, Stack } from '@mui/material'
import CustomerProfileGrid from '../components/CustomerProfileGrid'
import VisitDetailCard from '../components/VisitDetailCard'
import Note from '../components/Note'

const VisitPage = () => {
  return (
    <Stack spacing={2}>
      <CustomerProfileGrid />
      <Divider />
      <Note />
      <VisitDetailCard />
      <VisitDetailCard />
    </Stack>
  )
}
export default VisitPage
