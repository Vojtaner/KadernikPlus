import { Box, Checkbox, Typography } from '@mui/material'
import AppDataGrid from '../components/DataGrid'
import type { GridColDef } from '@mui/x-data-grid'
import {
  useDeleteTeamMemberMutation,
  useTeamMembersQuery,
  useUpdateTeamMemberSkill,
  type SkillUpdateInput,
} from '../queries'
import { useParams } from 'react-router-dom'
import Loader from './Loader'
import type { TeamMember, TeamSettings } from '../../../entities/team-member'
import AddTeamMemberButton from '../components/FormDialog/AddTeamMemberButton'
import BoxIcon from '../components/BoxIcon'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { useAuth0 } from '@auth0/auth0-react'

// const rows: TeamSettings[] = [
//   { name: 'Vojtěch Laurin', id: '1', canAccessStocks: true, canAccessClients: true, canAccessVisits: true },
//   { name: 'Monika Laurinová', id: '2', canAccessStocks: true, canAccessClients: false, canAccessVisits: true },
//   { name: 'Jan Špecián', id: '3', canAccessStocks: true, canAccessClients: true, canAccessVisits: false },
// ]

const Team = () => {
  const { teamId } = useParams()
  const { user } = useAuth0()
  const { data: teamMembers, isLoading } = useTeamMembersQuery(teamId)
  const { mutate: updateTeamMemberSkill } = useUpdateTeamMemberSkill(teamId)
  const { mutate: deleteTeamMember } = useDeleteTeamMemberMutation()

  console.log({ teamMembers, user })

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
  const columns = createColumns(updateTeamMemberSkill, deleteTeamMember, teamMembersRows)

  return (
    <Box sx={{ height: '100%' }}>
      <AppDataGrid rows={teamMembersRows} columns={columns} />
      <AddTeamMemberButton />
    </Box>
  )
}

const createTeamMemberSettingsRows = (
  teamMembers: (TeamMember & { user: { name: string } })[]
): (TeamSettings & { userId: string })[] => {
  return teamMembers.map((member) => ({
    id: member.id,
    userId: member.userId,
    name: member.user.name,
    canAccessStocks: member.canAccessStocks,
    canAccessClients: member.canAccessClients,
    canAccessVisits: member.canAccessVisits,
  }))
}

export default Team

// const columns: GridColDef<TeamSettings[][number]>[] = [
//   { field: 'name', headerName: 'Uživatel', disableColumnMenu: true, minWidth: 110 },

//   {
//     field: 'canAccessStocks',
//     headerName: 'Sklad',
//     width: 100,
//     editable: false,
//     display: 'flex',
//     disableColumnMenu: true,
//     renderCell: (params) => <Checkbox color={params.value ? 'success' : 'default'} checked={params.value} />,
//   },

//   {
//     field: 'canAccessClients',
//     headerName: 'Klienti',
//     width: 100,
//     editable: false,
//     display: 'flex',
//     disableColumnMenu: true,
//     renderCell: (params) => <Checkbox color={params.value ? 'success' : 'default'} checked={params.value} />,
//   },

//   {
//     field: 'canAccessVisits',
//     headerName: 'Návštěvy',
//     width: 100,
//     editable: false,
//     display: 'flex',
//     disableColumnMenu: true,
//     renderCell: (params) => <Checkbox color={params.value ? 'success' : 'default'} checked={params.value} />,
//   },
// ]

const createColumns = (
  updateFn: (data: SkillUpdateInput) => void,
  deleteFn: (id: string) => void,
  allRows: (TeamSettings & { userId: string })[]
): GridColDef<(TeamSettings & { userId: string })[][number]>[] => [
  { field: 'name', headerName: 'Uživatel', minWidth: 110, disableColumnMenu: true },

  {
    field: 'canAccessStocks',
    headerName: 'Sklad',
    width: 65,
    disableColumnMenu: true,
    renderCell: (params) => (
      <Checkbox
        checked={params.value}
        color={params.value ? 'success' : 'default'}
        onChange={() => {
          const row = allRows.find((r) => r.userId === params.row.userId)
          if (!row) {
            return
          }

          updateFn({
            memberId: row.userId.toString(),
            canAccessStocks: !params.value,
            canAccessClients: row.canAccessClients,
            canAccessVisits: row.canAccessVisits,
          })
        }}
      />
    ),
  },

  {
    field: 'canAccessClients',
    headerName: 'Klienti',
    width: 65,
    disableColumnMenu: true,
    renderCell: (params) => (
      <Checkbox
        checked={params.value}
        color={params.value ? 'success' : 'default'}
        onChange={() => {
          const row = allRows.find((r) => r.userId === params.row.userId)

          if (!row) {
            return
          }

          updateFn({
            memberId: row.userId.toString(),
            canAccessStocks: row.canAccessStocks,
            canAccessClients: !params.value,
            canAccessVisits: row.canAccessVisits,
          })
        }}
      />
    ),
  },

  {
    field: 'canAccessVisits',
    headerName: 'Návštěvy',
    width: 75,
    disableColumnMenu: true,
    renderCell: (params) => (
      <Checkbox
        checked={params.value}
        color={params.value ? 'success' : 'default'}
        onChange={() => {
          const row = allRows.find((r) => r.id === params.row.id)
          if (!row) {
            return
          }
          updateFn({
            memberId: row.userId.toString(),
            canAccessStocks: row.canAccessStocks,
            canAccessClients: row.canAccessClients,
            canAccessVisits: !params.value,
          })
        }}
      />
    ),
  },

  {
    field: 'delete',
    headerName: '',
    width: 60,

    disableColumnMenu: true,
    renderCell: (params) => (
      <BoxIcon
        onClick={() => {
          const row = allRows.find((r) => r.userId === params.row.userId)
          if (!row) {
            return
          }

          deleteFn(row.id.toString())
        }}
        icon={<DeleteOutlineIcon />}
      />
    ),
  },
]
