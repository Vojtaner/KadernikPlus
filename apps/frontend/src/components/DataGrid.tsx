import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import React from 'react'

const CHAR_WIDTH_PX = 6.5

function getMaxWordLength<T>(rows: readonly T[], field: keyof T): number {
  let longest = String(field).length
  for (const row of rows) {
    const cellValue = row[field]
    const valueStr = String(cellValue)
    longest = Math.max(longest, valueStr.length)
  }
  return longest
}

import type { DataGridProps, GridValidRowModel } from '@mui/x-data-grid'

type AppDataGridProps<T extends readonly GridValidRowModel[]> = DataGridProps & {
  rows: T
  columns: GridColDef<T[number]>[]
  sx?: object
  [key: string]: unknown
  rowHeight?: number
}

function AppDataGrid<T extends readonly GridValidRowModel[]>(props: AppDataGridProps<T>) {
  const { rows, columns, columnHeaderHeight, hideFooter, rowHeight } = props

  const gridColumns: readonly GridColDef[] = React.useMemo(
    () =>
      columns.map((col) => ({
        ...col,
        width: col.width ?? getMaxWordLength(rows, col.field as keyof T[number]) * CHAR_WIDTH_PX,
        minWidth: col.minWidth ?? 50,
        field: col.field,
      })),
    [columns, rows]
  )
  console.log({ props })
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <DataGrid
        {...props}
        rows={rows}
        columns={gridColumns}
        autosizeOnMount
        sx={{
          ...props.sx,
          fontSize: '12px',
          border: 'none',
          '& .MuiDataGrid-columnSeparator': {
            display: 'none',
          },
        }}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 13,
            },
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
  )
}

export default AppDataGrid
