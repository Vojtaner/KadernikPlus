import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import React from 'react';

import type { DataGridProps, GridValidRowModel } from '@mui/x-data-grid';
import { csCZ } from '@mui/x-data-grid/locales';

type AppDataGridProps<T extends readonly GridValidRowModel[]> = DataGridProps & {
  rows: T;
  columns: GridColDef<T[number]>[];
  sx?: object;
  [key: string]: unknown;
  rowHeight?: number;
  disableColumnMenu?: boolean;
};

function AppDataGrid<T extends readonly GridValidRowModel[]>(props: AppDataGridProps<T>) {
  const {
    rows,
    columns,
    columnHeaderHeight,
    hideFooter,
    rowHeight,
    disableColumnMenu = false,
  } = props;

  const gridColumns: readonly GridColDef[] = React.useMemo(
    () =>
      columns.map(col => ({
        ...col,
        field: col.field,
      })),
    [columns, rows]
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100px' }}>
      <DataGrid
        {...props}
        rows={rows}
        columns={gridColumns}
        localeText={csCZ.components.MuiDataGrid.defaultProps.localeText}
        disableColumnMenu={disableColumnMenu}
        sx={{
          ...props.sx,
          fontSize: '12px',
          border: 'none',
          '& .MuiDataGrid-columnSeparator': {
            display: 'none',
          },
        }}
        pageSizeOptions={[5]}
        disableRowSelectionOnClick
        density="compact"
        rowHeight={rowHeight ?? 60}
        columnHeaderHeight={columnHeaderHeight}
        hideFooter={hideFooter}
      />
    </div>
  );
}

export default AppDataGrid;
