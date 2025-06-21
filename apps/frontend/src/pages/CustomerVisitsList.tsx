import { Divider, Stack } from '@mui/material'
import CustomerProfileGrid from '../components/CustomerProfileGrid'
import VisitDetailCard from '../components/VisitDetailCard'
import Note from '../components/Note'

const CustomerVisitsList = () => {
  return (
    <Stack spacing={2}>
      <CustomerProfileGrid />
      <Divider />
      <Note />
      <VisitDetailCard />
      <VisitDetailCard />
      <VisitDetailCard />
      <VisitDetailCard />
      <VisitDetailCard />
      <VisitDetailCard />
      <VisitDetailCard />
      <VisitDetailCard />
      <VisitDetailCard />
      <VisitDetailCard />
    </Stack>
  )
}
export default CustomerVisitsList
