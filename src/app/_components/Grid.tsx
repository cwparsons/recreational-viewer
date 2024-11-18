'use client';

import { ColDef, ColGroupDef } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { useCallback, useEffect, useRef } from 'react';

import { type Course } from '@/types/CoursesV2Response';
import { useLocalStorage } from '../_hooks/use-location-storage';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

type GridProps = {
  city: string;
  courses: Course[];
};

type Row = Omit<
  Course,
  | 'OccurrenceMinStartDate'
  | 'OccurrenceMaxStartDate'
  | 'MinimumAge'
  | 'MaximumAge'
  | 'FormattedMinimumAge'
  | 'FormattedMaximumAge'
  | 'FacilityLocation'
> & {
  OccurrenceMinStartDate: Date;
  OccurrenceMaxStartDate?: Date;
  MinimumAge: number;
  MaximumAge: number;
  FormattedMinimumAge: string;
  FormattedMaximumAge: string;
  FacilityLocation: string;
  spots: string;
};

function formatMonthsYears({ value }: { value: number }) {
  const totalMonths = Math.round(value * 12);
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  return `${years}y ${months}m`;
}

function getFacilityLocation(course: Course) {
  if (course.OrgIsSingleLocation) {
    return course.Facility ? course.Facility : course.Location;
  }

  return course.Location + (course.Facility ? ' - ' + course.Facility : '');
}

function determineSpotsStatus(spots: string, text: string) {
  if (spots === 'FULL - Waitlist Available') return 'Wait list';

  if (spots !== '') return spots.replace(' left', '');

  return text;
}

export const Grid = ({ city, courses }: GridProps) => {
  const rowData: Row[] = courses.map((course) => ({
    ...course,
    OccurrenceMinStartDate: new Date(course.OccurrenceMinStartDate),
    OccurrenceMaxStartDate: course.OccurrenceMaxStartDate ? new Date(course.OccurrenceMaxStartDate.replace(' - ', '')) : undefined,
    MinimumAge: (course.MinAge ?? 0) + course.MinAgeMonths / 12,
    MaximumAge: (course.MaxAge ?? 0) + course.MaxAgeMonths / 12,
    FormattedMinimumAge: `${course.MinAge ?? 0}y ${course.MinAgeMonths ?? 0}m`,
    FormattedMaximumAge: `${course.MaxAge ?? 0}y ${course.MaxAgeMonths ?? 0}m`,
    FacilityLocation: getFacilityLocation(course),
    spots: determineSpotsStatus(course.Spots, course.BookButtonText),
  }));

  const gridRef = useRef<AgGridReact<Row>>(null);

  const [isTodayFilterChecked, setIsTodayFilterChecked] = useLocalStorage(
    'isTodayFilterChecked',
    window.location.hash.includes('upcoming')
  );
  const [isSpotsAvailableChecked, setIsSpotsAvailableChecked] = useLocalStorage(
    'isSpotsAvailableChecked',
    window.location.hash.includes('available')
  );
  const [isWeekendFilterChecked, setIsWeekendFilterChecked] = useLocalStorage(
    'isWeekendFilterChecked',
    window.location.hash.includes('weekend')
  );
  const [ageFilter, setAgeFilter] = useLocalStorage<{ years?: number; months?: number }>('ageFilter', {});

  const columnDefs: (ColDef<Row> | ColGroupDef<Row>)[] = [
    {
      headerName: 'Name',
      field: 'EventName',
      sort: 'asc',
      pinned: 'left',
      tooltipField: 'Details',
      floatingFilter: true,
    },
    {
      headerName: 'No.',
      field: 'CourseIdTrimmed',
      width: 100,
    },
    {
      headerName: 'Start',
      field: 'OccurrenceMinStartDate',
      sortable: true,
      filter: 'agDateColumnFilter',
      filterParams: {
        type: 'greaterThan',
        dateFrom: new Date().toISOString().split('T')[0],
      },
      width: 120,
    },
    {
      headerName: 'End',
      field: 'OccurrenceMaxStartDate',
      sortable: true,
      filter: 'agDateColumnFilter',
      filterParams: {
        defaultOption: 'lessThan',
      },
      width: 120,
    },
    {
      headerName: 'Occurs',
      field: 'OccurrenceDescription',
      width: 150,
    },
    {
      headerName: 'Time',
      field: 'EventTimeDescription',
      width: 200,
    },
    {
      headerName: 'Location',
      field: 'FacilityLocation',
      floatingFilter: true,
      width: 300,
    },
    {
      headerName: 'Min age',
      field: 'MinimumAge',
      valueFormatter: formatMonthsYears,
      width: 120,
    },
    {
      headerName: 'Max age',
      field: 'MaximumAge',
      valueFormatter: formatMonthsYears,
      width: 120,
    },
    {
      headerName: 'Price',
      field: 'PriceRange',
      width: 120,
    },
    {
      headerName: 'Spots',
      field: 'spots',
      filterParams: {
        maxNumConditions: 3,
      },
      pinned: 'right',
      width: 120,
      cellRenderer: ({ data: { EventId }, value }: { data: Course; value: string }) => {
        const url = `https://${city}.perfectmind.com/Clients/BookMe4LandingPages/CoursesLandingPage?courseId=${EventId}`;

        return (
          <a
            className="text-blue-600 hover:underline dark:text-blue-400"
            href={url}
            target="_blank"
            title="Course detail page"
            rel="noopener noreferrer"
          >
            {value}
          </a>
        );
      },
    },
  ];

  const toggleStartFilter = useCallback(async () => {
    if (!gridRef.current?.api) return;

    const dateFilterComponent = await gridRef.current.api.getColumnFilterInstance('OccurrenceMinStartDate');

    if (!dateFilterComponent) return;

    if (isTodayFilterChecked) {
      dateFilterComponent.setModel({
        type: 'greaterThan',
        dateFrom: new Date().toISOString().split('T')[0],
      });
    } else {
      dateFilterComponent.setModel(null);
    }

    gridRef.current.api.onFilterChanged();
  }, [isTodayFilterChecked]);

  useEffect(() => {
    toggleStartFilter();
  }, [isTodayFilterChecked, toggleStartFilter]);

  const toggleWeekendFilter = useCallback(async () => {
    if (!gridRef.current?.api) return;

    const occursFilterComponent = await gridRef.current.api.getColumnFilterInstance('OccurrenceDescription');

    if (!occursFilterComponent) return;

    if (isWeekendFilterChecked) {
      occursFilterComponent.setModel({
        filterType: 'text',
        operator: 'OR',
        conditions: [
          {
            filterType: 'text',
            type: 'contains',
            filter: 'Sat',
          },
          {
            filterType: 'text',
            type: 'contains',
            filter: 'Sun',
          },
        ],
      });
    } else {
      occursFilterComponent.setModel(null);
    }

    gridRef.current.api.onFilterChanged();
  }, [isWeekendFilterChecked]);

  useEffect(() => {
    toggleWeekendFilter();
  }, [isWeekendFilterChecked, toggleWeekendFilter]);

  const toggleSpotsAvailableFilter = useCallback(async () => {
    if (!gridRef.current?.api) return;

    const spotsFilterComponent = await gridRef.current.api.getColumnFilterInstance('spots');

    if (!spotsFilterComponent) return;

    if (isSpotsAvailableChecked) {
      spotsFilterComponent.setModel({
        filterType: 'text',
        operator: 'AND',
        conditions: [
          {
            filterType: 'text',
            type: 'notContains',
            filter: 'Closed',
          },
          {
            filterType: 'text',
            type: 'notContains',
            filter: 'Wait',
          },
          {
            filterType: 'text',
            type: 'notContains',
            filter: 'Full',
          },
        ],
      });
    } else {
      spotsFilterComponent.setModel(null);
    }

    gridRef.current.api.onFilterChanged();
  }, [isSpotsAvailableChecked]);

  useEffect(() => {
    toggleSpotsAvailableFilter();
  }, [isSpotsAvailableChecked, toggleSpotsAvailableFilter]);

  const toggleAgeFilter = useCallback(async () => {
    if (!gridRef.current?.api) return;

    if (ageFilter.years === undefined && ageFilter.months === undefined) {
      gridRef.current.api.setFilterModel({
        ...gridRef.current.api.getFilterModel(),
        MinimumAge: null,
        MaximumAge: null,
      });
    } else {
      const filter = (ageFilter.years ?? 0) + (ageFilter.months ?? 0) / 12;

      gridRef.current.api.setFilterModel({
        ...gridRef.current.api.getFilterModel(),
        MinimumAge: {
          filterType: 'number',
          type: 'lessThanOrEqual',
          filter,
        },
        MaximumAge: {
          filterType: 'number',
          type: 'greaterThanOrEqual',
          filter,
        },
      });
    }

    gridRef.current.api.onFilterChanged();
  }, [ageFilter]);

  useEffect(() => {
    toggleAgeFilter();
  }, [ageFilter, toggleAgeFilter]);

  const resetFilters = () => {
    setIsTodayFilterChecked(false);
    setIsSpotsAvailableChecked(false);
    setIsWeekendFilterChecked(false);
    setAgeFilter({ years: undefined, months: undefined });

    if (gridRef.current?.api) {
      gridRef.current.api.setFilterModel(null);
    }
  };

  const setInitialFilters = () => {
    toggleStartFilter();
    toggleSpotsAvailableFilter();
    toggleWeekendFilter();
    toggleAgeFilter();
  };

  return (
    <div className="flex flex-col gap-8">
      <form className="flex gap-6 rounded-lg border bg-white p-3 shadow-lg dark:border-gray-700 dark:bg-gray-800">
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={isTodayFilterChecked}
            onChange={(e) => setIsTodayFilterChecked(e.target.checked)}
            className="h-5 w-5 cursor-pointer text-blue-600"
          />
          <span className="text-gray-900 dark:text-gray-100">Upcoming events</span>
        </label>

        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={isSpotsAvailableChecked}
            onChange={(e) => setIsSpotsAvailableChecked(e.target.checked)}
            className="h-5 w-5 cursor-pointer text-blue-600"
          />
          <span className="text-gray-900 dark:text-gray-100">Available spots</span>
        </label>

        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={isWeekendFilterChecked}
            onChange={(e) => setIsWeekendFilterChecked(e.target.checked)}
            className="h-5 w-5 cursor-pointer text-blue-600"
          />
          <span className="text-gray-900 dark:text-gray-100">Weekend</span>
        </label>

        <label className="flex items-center gap-2">
          <span className="text-gray-900 dark:text-gray-100">Age</span>
          <input
            aria-label="Years"
            type="number"
            min="0"
            step="1"
            value={ageFilter.years ?? ''}
            onChange={(e) => setAgeFilter({ ...ageFilter, years: parseInt(e.target.value) })}
            className="w-16 bg-white px-2 py-1 text-black dark:bg-gray-700 dark:text-white"
            placeholder="yy"
          />
          <input
            aria-label="Months"
            type="number"
            min="0"
            max="11"
            step="1"
            value={ageFilter.months ?? ''}
            onChange={(e) => setAgeFilter({ ...ageFilter, months: parseInt(e.target.value) })}
            className="w-16 bg-white px-2 py-1 text-black dark:bg-gray-700 dark:text-white"
            placeholder="mm"
          />
        </label>

        <button className="text-blue-600 hover:underline dark:text-blue-400" onClick={resetFilters} type="button">
          Reset all filters
        </button>
      </form>

      <div className="ag-theme-quartz-auto-dark">
        <AgGridReact<Row>
          ref={gridRef}
          autoSizeStrategy={{
            type: 'fitGridWidth',
          }}
          domLayout="autoHeight"
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={{ filter: true }}
          onGridReady={setInitialFilters}
          // onFirstDataRendered={(params) => params.api.sizeColumnsToFit()}
        />
      </div>
    </div>
  );
};
