import { Box, Checkbox, Typography } from '@mui/material'
import AppDataGrid from '../components/DataGrid'
import type { GridColDef } from '@mui/x-data-grid'
import { useTeamMembersQuery } from '../queries'
import { useParams } from 'react-router-dom'
import Loader from './Loader'
import type { TeamMember, TeamSettings } from '../../../entities/team-member'

// const rows: TeamSettings[] = [
//   { name: 'Vojtěch Laurin', id: '1', canAccessStocks: true, canAccessClients: true, canAccessVisits: true },
//   { name: 'Monika Laurinová', id: '2', canAccessStocks: true, canAccessClients: false, canAccessVisits: true },
//   { name: 'Jan Špecián', id: '3', canAccessStocks: true, canAccessClients: true, canAccessVisits: false },
// ]

const Team = () => {
  const { teamId } = useParams()
  const { data: teamMembers, isLoading } = useTeamMembersQuery(teamId)

  if (isLoading) {
    return <Loader />
  }

  if (!teamMembers) {
    return []
  }

  if (!teamMembers) {
    return <Typography>No team members found</Typography>
  }
  const teamMembersRows = createTeamMemberSettingsRows(teamMembers)

  return (
    <Box sx={{ height: '100%' }}>
      <AppDataGrid rows={teamMembersRows} columns={columns} />
    </Box>
  )
}

const createTeamMemberSettingsRows = (teamMembers: (TeamMember & { user: { name: string } })[]): TeamSettings[] => {
  return teamMembers.map((member) => ({
    id: member.id,
    name: member.user.name,
    canAccessStocks: member.canAccessStocks,
    canAccessClients: member.canAccessClients,
    canAccessVisits: member.canAccessVisits,
  }))
}

export default Team

const columns: GridColDef<TeamSettings[][number]>[] = [
  { field: 'name', headerName: 'Uživatel', disableColumnMenu: true, minWidth: 110 },

  {
    field: 'canAccessStocks',
    headerName: 'Sklad',
    width: 100,
    editable: false,
    display: 'flex',
    disableColumnMenu: true,
    renderCell: (params) => <Checkbox color={params.value ? 'success' : 'default'} checked={params.value} />,
  },

  {
    field: 'canAccessClients',
    headerName: 'Klienti',
    width: 100,
    editable: false,
    display: 'flex',
    disableColumnMenu: true,
    renderCell: (params) => <Checkbox color={params.value ? 'success' : 'default'} checked={params.value} />,
  },

  {
    field: 'canAccessVisits',
    headerName: 'Návštěvy',
    width: 100,
    editable: false,
    display: 'flex',
    disableColumnMenu: true,
    renderCell: (params) => <Checkbox color={params.value ? 'success' : 'default'} checked={params.value} />,
  },
]
