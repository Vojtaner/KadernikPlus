import { Divider, Stack } from '@mui/material'
import ClientProfileGrid from '../components/ClientProfileGrid'
import VisitDetailCard from '../components/VisitDetailCard'
import Note from '../components/Note'

const ClientProfile = () => {
  return (
    <Stack spacing={2}>
      <ClientProfileGrid />
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
    </Stack>
  )
}
export default ClientProfile
