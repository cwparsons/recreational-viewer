'use client';

import { useCallback, useLayoutEffect, useRef } from 'react';

import Link from 'next/link';

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

import { useLocalStorage } from '@/app/_hooks/use-location-storage';
import { type Course } from '@/types/CoursesV2Response';

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

type GridProps = { org: string; courses: Course[] };

type Row = Omit<Course, 'OccurrenceMinStartDate' | 'OccurrenceMaxStartDate'> & {
  OccurrenceMinStartDate: Date;
  OccurrenceMaxStartDate?: Date;
  MinimumAge: number;
  MaximumAge: number;
  FacilityLocation: string;
  spots: string;
};

const Checkbox = ({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}) => (
  <label className="flex cursor-pointer items-center gap-2">
    <input
      checked={checked}
      className="h-5 w-5"
      onChange={(e) => onChange(e.target.checked)}
      type="checkbox"
    />
    <span>{label}</span>
  </label>
);

const valueFormatter = ({ value }: { value: number }) => {
  const totalMonths = Math.round(value * 12);
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  return `${years}y ${months}m`;
};

export const Grid = ({ org, courses }: GridProps) => {
  const gridRef = useRef<AgGridReact<Row>>(null);

  const [filters, setFilters] = useLocalStorage('courseFilters', {
    upcoming: false,
    spotsAvailable: false,
    weekend: false,
    age: { years: undefined as number | undefined, months: undefined as number | undefined },
  });

  // Process row data
  const rowData: Row[] = courses.map((course) => ({
    ...course,
    OccurrenceMinStartDate: new Date(course.OccurrenceMinStartDate),
    OccurrenceMaxStartDate: course.OccurrenceMaxStartDate
      ? new Date(course.OccurrenceMaxStartDate.replace(' - ', ''))
      : undefined,
    MinimumAge: (course.MinAge ?? 0) + (course.MinAgeMonths ?? 0) / 12,
    MaximumAge: (course.MaxAge ?? 0) + (course.MaxAgeMonths ?? 0) / 12,
    FacilityLocation: course.OrgIsSingleLocation
      ? course.Facility || course.Location
      : course.Location + (course.Facility ? ' - ' + course.Facility : ''),
    spots:
      course.Spots === 'FULL - Waitlist Available'
        ? 'Wait list'
        : course.Spots !== ''
          ? course.Spots.replace(' left', '')
          : course.BookButtonText,
  }));

  // Column definitions
  const columnDefs: ColDef<Row>[] = [
    {
      headerName: 'Name',
      field: 'EventName',
      sort: 'asc',
      pinned: 'left',
      tooltipField: 'Details',
      floatingFilter: true,
    },
    { headerName: 'No.', field: 'CourseIdTrimmed', width: 100 },
    {
      headerName: 'Start',
      field: 'OccurrenceMinStartDate',
      sortable: true,
      filter: 'agDateColumnFilter',
      width: 120,
    },
    {
      headerName: 'End',
      field: 'OccurrenceMaxStartDate',
      sortable: true,
      filter: 'agDateColumnFilter',
      width: 120,
    },
    { headerName: 'Occurs', field: 'OccurrenceDescription', width: 150 },
    { headerName: 'Time', field: 'EventTimeDescription', width: 200 },
    { headerName: 'Location', field: 'FacilityLocation', floatingFilter: true, width: 300 },
    {
      headerName: 'Min age',
      field: 'MinimumAge',
      valueFormatter,
      width: 120,
    },
    {
      headerName: 'Max age',
      field: 'MaximumAge',
      valueFormatter,
      width: 120,
    },
    { headerName: 'Price', field: 'PriceRange', width: 120 },
    {
      headerName: 'Spots',
      field: 'spots',
      pinned: 'right',
      width: 120,
      cellRenderer: ({ data, value }: { data: Row; value: string }) => {
        const href = `https://${org}.perfectmind.com/Clients/BookMe4LandingPages/CoursesLandingPage?courseId=${data.EventId}`;

        return (
          <Link href={href} target="_blank" rel="noopener noreferrer">
            {value}
          </Link>
        );
      },
    },
  ];

  // Apply filters to grid
  const applyFilters = useCallback(async () => {
    if (!gridRef.current?.api) return;

    // Build filter model
    const filterModel: any = {};

    // Upcoming events filter
    if (filters.upcoming) {
      filterModel.OccurrenceMinStartDate = {
        type: 'greaterThan',
        dateFrom: new Date().toISOString().split('T')[0],
      };
    }

    // Weekend filter
    if (filters.weekend) {
      filterModel.OccurrenceDescription = {
        filterType: 'text',
        operator: 'OR',
        conditions: [
          { filterType: 'text', type: 'contains', filter: 'Sat' },
          { filterType: 'text', type: 'contains', filter: 'Sun' },
        ],
      };
    }

    // Available spots filter
    if (filters.spotsAvailable) {
      filterModel.spots = {
        filterType: 'text',
        operator: 'AND',
        conditions: [
          { filterType: 'text', type: 'notContains', filter: 'Closed' },
          { filterType: 'text', type: 'notContains', filter: 'Wait' },
          { filterType: 'text', type: 'notContains', filter: 'Full' },
        ],
      };
    }

    // Age filter
    if (filters.age.years !== undefined || filters.age.months !== undefined) {
      const ageValue = (filters.age.years ?? 0) + (filters.age.months ?? 0) / 12;

      filterModel.MinimumAge = {
        filterType: 'number',
        type: 'lessThanOrEqual',
        filter: ageValue,
      };

      filterModel.MaximumAge = {
        filterType: 'number',
        type: 'greaterThanOrEqual',
        filter: ageValue,
      };
    }

    gridRef.current?.api.setFilterModel(filterModel);
  }, [filters, gridRef]);

  // Apply filters when they change
  useLayoutEffect(() => {
    applyFilters();
  }, [filters, applyFilters]);

  const resetFilters = () => {
    setFilters({
      upcoming: false,
      spotsAvailable: false,
      weekend: false,
      age: { years: undefined, months: undefined },
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <form className="flex flex-wrap gap-6 rounded-lg border bg-white px-4 py-3 shadow-lg dark:border-gray-700 dark:bg-gray-800">
        <Checkbox
          checked={filters.upcoming}
          onChange={(checked) => setFilters({ ...filters, upcoming: checked })}
          label="Upcoming events"
        />

        <Checkbox
          checked={filters.spotsAvailable}
          onChange={(checked) => setFilters({ ...filters, spotsAvailable: checked })}
          label="Available spots"
        />

        <Checkbox
          checked={filters.weekend}
          onChange={(checked) => setFilters({ ...filters, weekend: checked })}
          label="Weekend"
        />

        <label className="flex items-center gap-2">
          <span>Age</span>
          <input
            aria-label="Years"
            className="w-16 bg-white px-2 py-1 dark:bg-gray-700"
            min="0"
            placeholder="yy"
            step="1"
            type="number"
            value={filters.age.years ?? ''}
            onChange={(e) =>
              setFilters({
                ...filters,
                age: {
                  ...filters.age,
                  years: e.target.value ? parseInt(e.target.value) : undefined,
                },
              })
            }
          />
          <input
            aria-label="Months"
            className="w-16 bg-white px-2 py-1 dark:bg-gray-700"
            max="11"
            min="0"
            placeholder="mm"
            step="1"
            type="number"
            value={filters.age.months ?? ''}
            onChange={(e) =>
              setFilters({
                ...filters,
                age: {
                  ...filters.age,
                  months: e.target.value ? parseInt(e.target.value) : undefined,
                },
              })
            }
          />
        </label>

        <button className="anchor cursor-pointer" onClick={resetFilters} type="button">
          Reset all filters
        </button>
      </form>

      <AgGridReact
        autoSizeStrategy={{ type: 'fitGridWidth' }}
        columnDefs={columnDefs}
        defaultColDef={{ filter: true }}
        domLayout="autoHeight"
        onGridReady={applyFilters}
        ref={gridRef}
        rowData={rowData}
        theme={themeQuartz.withPart(colorSchemeDarkBlue)}
      />
    </div>
  );
};

