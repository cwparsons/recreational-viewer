'use client';

import { forwardRef } from 'react';

import { ColDef, ModuleRegistry, colorSchemeDarkBlue, themeQuartz } from 'ag-grid-community';
import {
  ClientSideRowModelModule,
  ColumnAutoSizeModule,
  CustomFilterModule,
  DateFilterModule,
  NumberFilterModule,
  TextFilterModule,
  TooltipModule,
  ValidationModule,
} from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';

import { type FormattedCourse } from '../_lib/format-course-data';

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ColumnAutoSizeModule,
  CustomFilterModule,
  DateFilterModule,
  NumberFilterModule,
  TextFilterModule,
  TooltipModule,
  ValidationModule,
]);

type DesktopGridProps = {
  columnDefs: ColDef<FormattedCourse>[];
  rowData: FormattedCourse[];
  isDarkMode: boolean;
  applyFilters: () => void;
};

export const DesktopGrid = forwardRef<AgGridReact<FormattedCourse>, DesktopGridProps>(
  ({ columnDefs, rowData, isDarkMode, applyFilters }, ref) => {
    return (
      <AgGridReact
        autoSizeStrategy={{ type: 'fitGridWidth' }}
        columnDefs={columnDefs}
        defaultColDef={{ filter: true }}
        domLayout="autoHeight"
        onGridReady={applyFilters}
        ref={ref}
        rowData={rowData}
        theme={isDarkMode ? themeQuartz.withPart(colorSchemeDarkBlue) : themeQuartz}
      />
    );
  },
);

DesktopGrid.displayName = 'DesktopGrid';
