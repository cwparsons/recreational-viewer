'use client';

import { useCallback, useLayoutEffect, useRef, useState } from 'react';

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

import { formatOccurrenceDescription } from '../_lib/format-occurrence-description';
import { Checkbox } from './Checkbox';

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
  const [isDesktop, setIsDesktop] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Responsive check using ResizeObserver
  useLayoutEffect(() => {
    const check = () => setIsDesktop(window.innerWidth > 1024);
    check();

    const resizeObserver = new ResizeObserver(() => {
      check();
    });

    resizeObserver.observe(document.body);

    return () => resizeObserver.disconnect();
  }, []);

  // Dark mode detection
  useLayoutEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

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

  // Apply filters to grid and for mobile
  const filterRowData = useCallback(
    (data: Row[]) => {
      return data.filter((row) => {
        // Upcoming events filter
        if (filters.upcoming) {
          const today = new Date();
          if (row.OccurrenceMinStartDate < new Date(today.toISOString().split('T')[0]))
            return false;
        }
        // Weekend filter
        if (filters.weekend) {
          if (!/Sat|Sun/.test(row.OccurrenceDescription)) return false;
        }
        // Available spots filter
        if (filters.spotsAvailable) {
          if (/Closed|Wait|Full/i.test(row.spots)) return false;
        }
        // Age filter
        if (filters.age.years !== undefined || filters.age.months !== undefined) {
          const ageValue = (filters.age.years ?? 0) + (filters.age.months ?? 0) / 12;
          if (!(row.MinimumAge <= ageValue && row.MaximumAge >= ageValue)) return false;
        }
        return true;
      });
    },
    [filters],
  );

  // Reintroduce applyFilters for ag-Grid only
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

      {/* Desktop grid */}
      {isDesktop && (
        <AgGridReact
          autoSizeStrategy={{ type: 'fitGridWidth' }}
          columnDefs={columnDefs}
          defaultColDef={{ filter: true }}
          domLayout="autoHeight"
          onGridReady={applyFilters}
          ref={gridRef}
          rowData={rowData}
          theme={isDarkMode ? themeQuartz.withPart(colorSchemeDarkBlue) : themeQuartz}
        />
      )}

      {/* Mobile table using <details>/<summary> */}
      {!isDesktop && (
        <div className="flex flex-col gap-2">
          {filterRowData(rowData)
            .sort((a, b) => a.EventName.localeCompare(b.EventName))
            .map((row) => {
              const href = `https://${org}.perfectmind.com/Clients/BookMe4LandingPages/CoursesLandingPage?courseId=${row.EventId}`;
              return (
                <details
                  key={row.EventId}
                  className="rounded-lg border bg-white px-4 py-3 shadow dark:border-gray-700 dark:bg-gray-800"
                >
                  <summary className="flex cursor-pointer items-center justify-between gap-4">
                    {formatOccurrenceDescription(
                      row.EventName,
                      row.OccurrenceMinStartDate,
                      row.OccurrenceDescription,
                    )}
                    <Link
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="whitespace-nowrap text-blue-600 underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {row.spots}
                    </Link>
                  </summary>
                  <table className="mt-2 w-full text-sm">
                    <tbody>
                      <tr hidden>
                        <th className="pt-2 pr-4 text-start align-top font-semibold">Number:</th>
                        <td className="pt-2">{row.CourseIdTrimmed}</td>
                      </tr>
                      <tr>
                        <th className="pt-2 pr-4 text-start align-top font-semibold">
                          Description:
                        </th>
                        <td className="pt-2">{row.Details}</td>
                      </tr>
                      <tr>
                        <th className="pt-2 pr-4 text-start align-top font-semibold">Start:</th>
                        <td className="pt-2">{row.OccurrenceMinStartDate.toLocaleDateString()}</td>
                      </tr>
                      {row.OccurrenceMaxStartDate && (
                        <tr>
                          <th className="pt-2 pr-4 text-start align-top font-semibold">End:</th>
                          <td className="pt-2">
                            {row.OccurrenceMaxStartDate.toLocaleDateString()}
                          </td>
                        </tr>
                      )}
                      <tr>
                        <th className="pt-2 pr-4 text-start align-top font-semibold">Occurs:</th>
                        <td className="pt-2">{row.OccurrenceDescription}</td>
                      </tr>
                      <tr>
                        <th className="pt-2 pr-4 text-start align-top font-semibold">Time:</th>
                        <td className="pt-2">{row.EventTimeDescription}</td>
                      </tr>
                      <tr>
                        <th className="pt-2 pr-4 text-start align-top font-semibold">Location:</th>
                        <td className="pt-2">{row.FacilityLocation}</td>
                      </tr>
                      <tr>
                        <th className="pt-2 pr-4 text-start align-top font-semibold">Min age:</th>
                        <td className="pt-2">{valueFormatter({ value: row.MinimumAge })}</td>
                      </tr>
                      <tr>
                        <th className="pt-2 pr-4 text-start align-top font-semibold">Max age:</th>
                        <td className="pt-2">{valueFormatter({ value: row.MaximumAge })}</td>
                      </tr>
                      <tr>
                        <th className="pt-2 pr-4 text-start align-top font-semibold">Price:</th>
                        <td className="pt-2">{row.PriceRange}</td>
                      </tr>
                    </tbody>
                  </table>
                </details>
              );
            })}
        </div>
      )}
    </div>
  );
};

