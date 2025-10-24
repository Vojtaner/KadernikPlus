import { Box, Checkbox, Typography } from '@mui/material';
import AppDataGrid from '../../app/components/DataGrid';
import type { GridColDef } from '@mui/x-data-grid';
import { useParams } from 'react-router-dom';
import Loader from '../../components/Loader';
import type { TeamMember, TeamSettings } from '../../entities/team-member';
import BoxIcon from '../../app/components/BoxIcon';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddTeamMemberButton from '../team/components/AddTeamMemberButton';
import {
  useTeamMembersQuery,
  useUpdateTeamMemberSkill,
  useDeleteTeamMemberMutation,
  type SkillUpdateInput,
} from '../team/queries';
import { useAppNavigate } from '../../hooks';
import { FormattedMessage, useIntl, type IntlShape } from 'react-intl';

const Team = () => {
  const { teamId } = useParams();
  const navigate = useAppNavigate();
  const intl = useIntl();
  const { data: teamMembers, isLoading } = useTeamMembersQuery(teamId);
  const { mutate: updateTeamMemberSkill } = useUpdateTeamMemberSkill(teamId);
  const { mutate: deleteTeamMember } = useDeleteTeamMemberMutation();

  if (isLoading) {
    return <Loader />;
  }

  if (!teamMembers) {
    return [];
  }

  if (!teamMembers) {
    return (
      <Typography>
        <FormattedMessage id="team.noMembers" defaultMessage="Žádní členové týmu nenalezeni." />
      </Typography>
    );
  }

  const teamMembersRows = createTeamMemberSettingsRows(teamMembers);
  const columns = createColumns(
    updateTeamMemberSkill,
    deleteTeamMember,
    navigate,
    teamMembersRows,
    intl,
  );

  return (
    <Box sx={{ height: '100%' }}>
      <AppDataGrid rows={teamMembersRows} columns={columns} />
      <AddTeamMemberButton />
    </Box>
  );
};

const createTeamMemberSettingsRows = (
  teamMembers: (TeamMember & { user: { name: string } })[],
): (TeamSettings & { userId: string })[] => {
  return teamMembers.map(member => ({
    id: member.id,
    userId: member.userId,
    name: member.user.name,
    canAccessStocks: member.canAccessStocks,
    canAccessClients: member.canAccessClients,
    canAccessVisits: member.canAccessVisits,
  }));
};

export default Team;

const createColumns = (
  updateFn: (data: SkillUpdateInput) => void,
  deleteFn: (id: string) => void,
  navigate: (path: string) => void,
  allRows: (TeamSettings & { userId: string })[],
  intl: IntlShape,
): GridColDef<(TeamSettings & { userId: string })[][number]>[] => [
  { field: 'name', headerName: 'Uživatel', flex: 6, minWidth: 110, disableColumnMenu: true },
  {
    field: 'canAccessStocks',
    headerName: `${intl.formatMessage({ id: 'team.stock', defaultMessage: 'Sklad' })}`,
    flex: 6,
    width: 85,
    disableColumnMenu: true,
    renderCell: params => (
      <Checkbox
        checked={params.value}
        color={params.value ? 'success' : 'default'}
        onChange={() => {
          const row = allRows.find(r => r.userId === params.row.userId);

          if (!row) {
            return;
          }

          updateFn({
            memberId: row.userId.toString(),
            canAccessStocks: !params.value,
            canAccessClients: row.canAccessClients,
            canAccessVisits: row.canAccessVisits,
          });
        }}
      />
    ),
  },

  // {
  //   field: 'canAccessClients',
  //   headerName: 'Klienti',
  //   width: 65,
  //   disableColumnMenu: true,
  //   renderCell: (params) => (
  //     <Checkbox
  //       checked={params.value}
  //       color={params.value ? 'success' : 'default'}
  //       onChange={() => {
  //         const row = allRows.find((r) => r.userId === params.row.userId)

  //         if (!row) {
  //           return
  //         }

  //         updateFn({
  //           memberId: row.userId.toString(),
  //           canAccessStocks: row.canAccessStocks,
  //           canAccessClients: !params.value,
  //           canAccessVisits: row.canAccessVisits,
  //         })
  //       }}
  //     />
  //   ),
  // },

  // {
  //   field: 'canAccessVisits',
  //   headerName: 'Návštěvy',
  //   width: 75,
  //   disableColumnMenu: true,
  //   renderCell: (params) => (
  //     <Checkbox
  //       checked={params.value}
  //       color={params.value ? 'success' : 'default'}
  //       onChange={() => {
  //         const row = allRows.find((r) => r.id === params.row.id)
  //         if (!row) {
  //           return
  //         }
  //         updateFn({
  //           memberId: row.userId.toString(),
  //           canAccessStocks: row.canAccessStocks,
  //           canAccessClients: row.canAccessClients,
  //           canAccessVisits: !params.value,
  //         })
  //       }}
  //     />
  //   ),
  // },

  {
    field: 'delete',
    headerName: '',
    width: 60,
    disableColumnMenu: true,
    renderCell: params => (
      <BoxIcon
        onClick={() => {
          const row = allRows.find(r => r.userId === params.row.userId);
          if (!row) {
            return;
          }

          deleteFn(row.userId);
          navigate('/');
        }}
        icon={<DeleteOutlineIcon />}
      />
    ),
  },
];
