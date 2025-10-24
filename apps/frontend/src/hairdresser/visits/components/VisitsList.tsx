import { Stack, Box, Typography } from '@mui/material';
import type { GridColDef } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import { useForm } from 'react-hook-form';
import { useIntl, type IntlShape } from 'react-intl';
import { BasicDatePicker } from '../../../app/components/BasicDatePicker';
import AppDataGrid from '../../../app/components/DataGrid';
import { formatNameShort } from '../../../entity';
import { type VisitListApplyFilter, useAppNavigate, useVisitListFilters } from '../../../hooks';
import { FilterTableButton } from '../../pages/Consumption';
import Loader from '../../../components/Loader';
import { Paths } from '../../../routes/AppRoutes';
import { getMissingStockAllowanceError } from './VisitDetailGrid';
import {
  DepositStatus,
  getIsVisitInPast,
  getRowsWithHeaders,
  getTimeFromUtcToLocal,
  type VisitRow,
  type VisitWithServicesWithProceduresWithStockAllowances,
} from '../entity';
import PhotoCameraFrontOutlinedIcon from '@mui/icons-material/PhotoCameraFrontOutlined';
import { useVisitsQuery } from '../queries';
import CreditCardOffIcon from '@mui/icons-material/CreditCardOff';
import CreditScoreIcon from '@mui/icons-material/CreditScore';
import { getButtonStyle } from '../../entity';
import SmsSendDialog from '../../../components/SmsSendDialog';
import SendIcon from '@mui/icons-material/Send';
import AppTheme from '../../../AppTheme';
import BoxIcon from '../../../app/components/BoxIcon';

type VisitListProps = {
  columnHeaderHeight?: 0;
  hideFooter?: boolean;
  onlyOpenVisits?: boolean;
  visitListApplyFilter: VisitListApplyFilter;
  enableFilters?: boolean;
};

const VisitsList = (props: VisitListProps) => {
  const {
    columnHeaderHeight,
    hideFooter = false,
    visitListApplyFilter,
    enableFilters = true,
  } = props;
  const intl = useIntl();
  const navigate = useAppNavigate();

  const [visitListFilters, updateVisitFilters] = useVisitListFilters(visitListApplyFilter);

  const { control } = useForm({
    defaultValues: {
      from: visitListFilters.dates.from,
      to: visitListFilters.dates.to,
    },
  });

  const onlyOpenVisits = visitListApplyFilter === 'onlyOpenVisits';

  const { data: visitData } = useVisitsQuery({
    query: !onlyOpenVisits
      ? { from: dayjs(visitListFilters.dates.from), to: dayjs(visitListFilters.dates.to) }
      : undefined,
  });

  if (!visitData) {
    return <Loader />;
  }

  const onlyOpenVisitsData = visitData.filter(
    visit => !visit.visitStatus && getIsVisitInPast(visit.date),
  );

  const onlyClosedVisitsWithoutStockAllowances = visitData.filter(
    visit => visit.visitStatus && getMissingStockAllowanceError(intl, visit.procedures),
  );

  const filteredData =
    visitListFilters.view === 'byClosedNoStockAllowances'
      ? onlyClosedVisitsWithoutStockAllowances
      : visitData;

  const sortedVisits = [...(onlyOpenVisits ? onlyOpenVisitsData : filteredData)].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  const rowsWithHeaders = getRowsWithHeaders(sortedVisits);
  const rows = createVisitsTable(rowsWithHeaders);

  return (
    <Stack spacing={4}>
      {enableFilters && (
        <Stack direction="row" spacing={2} justifyContent="flex-start">
          <FilterTableButton
            variant={getButtonStyle(visitListFilters.view, 'byAll')}
            setTableView={() => updateVisitFilters?.(draft => (draft.view = 'byAll'))}
            text={intl.formatMessage({
              defaultMessage: 'Všechny',
              id: 'visits.visitViewKey.byAll',
            })}
          />
          <FilterTableButton
            variant={getButtonStyle(visitListFilters.view, 'byClosedNoStockAllowances')}
            setTableView={() =>
              updateVisitFilters?.(draft => (draft.view = 'byClosedNoStockAllowances'))
            }
            text={intl.formatMessage({
              defaultMessage: 'Uzavřené bez spotřeby',
              id: 'visits.visitViewKey.byClosedNoStockAllowances',
            })}
          />
        </Stack>
      )}
      <Stack spacing={2} height="100%">
        {!onlyOpenVisits && (
          <Stack direction="row" spacing={2}>
            <BasicDatePicker
              label={intl.formatMessage({
                defaultMessage: 'Datum od',
                id: 'visitsList.dateFrom',
              })}
              control={control}
              fieldPath="from"
              onChange={date => {
                updateVisitFilters?.(draft => {
                  draft.dates.from = date?.toISOString();
                });
              }}
            />
            <BasicDatePicker
              label={intl.formatMessage({
                defaultMessage: 'Datum do',
                id: 'visitsList.dateTo',
              })}
              control={control}
              fieldPath="to"
              onChange={date => {
                updateVisitFilters?.(draft => {
                  draft.dates.to = date?.toISOString();
                });
              }}
            />
          </Stack>
        )}
        {visitListFilters.view === 'byAll' && (
          <AppDataGrid
            disableColumnMenu={
              visitListApplyFilter === 'dashBoardVisitOverView' ||
              visitListApplyFilter === 'onlyOpenVisits'
            }
            rows={rows}
            columns={createColumns(navigate, intl)}
            columnHeaderHeight={columnHeaderHeight}
            hideFooter={hideFooter}
            getRowClassName={params => {
              return params.row.isHeader ? 'header-row' : '';
            }}
            getRowHeight={params => {
              return params.model.isHeader ? 20 : 40;
            }}
            sx={{
              '& .header-row .MuiDataGrid-cell': {
                backgroundColor: '#fff656',
                fontWeight: 'bold',
                textAlign: 'center',
                justifyContent: 'center',
              },
            }}
          />
        )}
        {visitListFilters.view === 'byClosedNoStockAllowances' && (
          <AppDataGrid
            rows={rows}
            disableColumnMenu={true}
            columns={createColumns(navigate, intl)}
            columnHeaderHeight={columnHeaderHeight}
            hideFooter={hideFooter}
            getRowClassName={params => {
              return params.row.isHeader ? 'header-row' : '';
            }}
            getRowHeight={params => {
              return params.model.isHeader ? 20 : 40;
            }}
            sx={{
              '& .header-row .MuiDataGrid-cell': {
                backgroundColor: '#fff656',
                fontWeight: 'bold',
                textAlign: 'center',
                justifyContent: 'center',
              },
            }}
          />
        )}
      </Stack>
    </Stack>
  );
};
export default VisitsList;

export const createColumns = (
  navigate: (path: string) => void,
  intl: IntlShape,
): GridColDef<VisitRow[][number]>[] => [
  {
    field: 'date',
    headerName: `${intl.formatMessage({ id: 'stock.time', defaultMessage: 'Čas' })}`,
    width: 45,
    hideSortIcons: false,
    display: 'flex',
    flex: 1.5,
    minWidth: 20,
    renderCell: params =>
      params.row.isHeader ? (
        <Box
          sx={{
            textAlign: 'center',
            fontWeight: 'bold',
            position: 'absolute',
            display: 'flex',
            left: '10px',
          }}
        >
          {params.row.label}
        </Box>
      ) : (
        <Stack>
          <Typography fontSize="12px">{params.row.date}</Typography>
          <Typography color="text.secondary" fontSize="12px">
            {params.row.dateTo}
          </Typography>
        </Stack>
      ),
  },

  {
    field: 'client',
    headerName: `${intl.formatMessage({ id: 'stock.customer', defaultMessage: 'Zákazník' })}`,
    display: 'flex',
    flex: 3.5,
    minWidth: 55,
    renderCell: params =>
      !params.row.isHeader && (
        <Stack direction="row" spacing={0.5} alignItems="center">
          <Typography fontSize="12px">{formatNameShort(params.value)}</Typography>
          {params.row.clientDeposit ? (
            !params.row.visitDepositPayed ? (
              <CreditCardOffIcon sx={{ fontSize: '15px' }} color="error" />
            ) : (
              <CreditScoreIcon sx={{ fontSize: '15px' }} color="success" />
            )
          ) : null}
        </Stack>
      ),
  },
  {
    field: 'serviceName',
    headerName: `${intl.formatMessage({ id: 'stock.servicename', defaultMessage: 'Účes' })}`,
    minWidth: 70,
    flex: 2.5,
    width: 150,
  },
  {
    field: 'visitState',
    headerName: `${intl.formatMessage({ id: 'stock.visitState', defaultMessage: 'Stav' })}`,
    width: 70,
    flex: 1.5,
    display: 'flex',
    editable: false,
    renderCell: params => {
      const isVisitOpen = params.row.visitState;
      return (
        !params.row.isHeader && (
          <Typography
            fontSize="0.9rem"
            onClick={() =>
              params.row.clientId
                ? navigate(Paths.visitDetail(params.row.clientId, params.row.id))
                : {}
            }
            color={isVisitOpen ? 'success' : 'error'}
          >
            {isVisitOpen
              ? intl.formatMessage({ id: 'stock.closedVisit', defaultMessage: 'Zavř.' })
              : intl.formatMessage({ id: 'stock.notClosedVisit', defaultMessage: 'Nezavř.' })}
          </Typography>
        )
      );
    },
  },
  {
    field: 'visitDetailButton',
    headerName: `${intl.formatMessage({ id: 'stock.visitDetailButton', defaultMessage: 'Detail' })}`,
    width: 10,
    flex: 3,
    display: 'flex',
    editable: false,
    renderCell: params => {
      if (!params.row.isHeader && params.row.clientId) {
        const clientId = params.row.clientId;
        return (
          <Stack direction="row" spacing={1}>
            <SmsSendDialog
              visitId={params.row.id}
              openButton={
                <BoxIcon
                  size="small"
                  sx={{
                    background: `${AppTheme.palette.common.white}`,
                    color: `${AppTheme.palette.info.main}`,
                  }}
                  icon={<SendIcon fontSize="small" color="info" />}
                />
              }
            />

            <BoxIcon
              onClick={() => navigate(Paths.visitDetail(clientId, params.row.id))}
              size="small"
              boxColor="#61fb0133"
              sx={{
                background: `${AppTheme.palette.common.white}`,
                color: `${AppTheme.palette.info.main}`,
              }}
              icon={<PhotoCameraFrontOutlinedIcon fontSize="small" color="primary" />}
            />
          </Stack>
        );
      }
    },
  },
];

const isTypeRowHeader = (
  item:
    | VisitWithServicesWithProceduresWithStockAllowances
    | { isHeader: true; label: string; id: string },
): item is { isHeader: true; label: string; id: string } => {
  return 'isHeader' in item;
};

const createVisitsTable = (
  visits: (
    | VisitWithServicesWithProceduresWithStockAllowances
    | { isHeader: true; label: string; id: string }
  )[],
): VisitRow[] => {
  const visitsList = visits.map(visit => {
    if (!visit.id) {
      return;
    }

    if (isTypeRowHeader(visit)) {
      return {
        isHeader: true,
        label: visit.label,
        id: visit.id,
        date: undefined,
        client: undefined,
        serviceName: undefined,
        visitState: undefined,
        visitDepositPayed: undefined,
        clientId: undefined,
      } satisfies VisitRow;
    }

    return {
      id: visit.id,
      isHeader: false,
      date: getTimeFromUtcToLocal(visit.date),
      dateTo: getTimeFromUtcToLocal(visit.dateTo),
      client: `${visit.client.firstName} ${visit.client.lastName}`,
      serviceName: visit.visitServices.map(service => service.service.serviceName).join(','),
      visitState: visit.visitStatus,
      clientId: visit.client.id,
      visitDepositPayed: visit.depositStatus === DepositStatus.ZAPLACENO,
      clientDeposit: visit.client.deposit,
    } satisfies VisitRow;
  });

  return visitsList.filter(visit => visit !== undefined);
};
