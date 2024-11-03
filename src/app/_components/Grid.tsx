'use client';

import { AgGridReact } from 'ag-grid-react';
import { ColDef, ColGroupDef } from 'ag-grid-community';
import { useRef, useState } from 'react';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

import { type Course } from '@/types/CoursesV2Response';

type GridProps = {
  city: string;
  courses: Course[];
};

function getFacilityLocation(course: Course) {
  if (course.OrgIsSingleLocation) {
    return course.Facility ? course.Facility : course.Location;
  }

  return course.Location + (course.Facility ? ' - ' + course.Facility : '');
}

export const Grid = ({ city, courses }: GridProps) => {
  const rowData = courses.map((course) => ({
    ...course,
    OccurrenceMinStartDate: new Date(course.OccurrenceMinStartDate),
    OccurrenceMaxStartDate: course.OccurrenceMaxStartDate ? new Date(course.OccurrenceMaxStartDate.replace(' - ', '')) : undefined,
    FormattedMinimumAge: `${course.MinAge ?? 0}y ${course.MinAgeMonths ?? 0}m`,
    FormattedMaximumAge: `${course.MaxAge ?? 0}y ${course.MaxAgeMonths ?? 0}m`,
    FacilityLocation: getFacilityLocation(course),
    spots: course.BookButtonText === 'Closed' ? 'Closed' : course.Spots || 'N/A',
  }));

  type Row = (typeof rowData)[number];
  const gridRef = useRef<AgGridReact<Row>>(null);
  const [isTodayFilterChecked, setIsTodayFilterChecked] = useState(false);
  const [isSpotsAvailableChecked, setIsSpotsAvailableChecked] = useState(false);

  const columnDefs: (ColDef<Row> | ColGroupDef<Row>)[] = [
    {
      headerName: 'Name',
      field: 'EventName',
      sort: 'asc',
    },
    {
      headerName: 'No.',
      field: 'CourseIdTrimmed',
    },
    {
      headerName: 'Start',
      field: 'OccurrenceMinStartDate',
      sortable: true,
      filter: 'agDateColumnFilter',
      filterParams: {
        defaultOption: 'greaterThan',
        defaultFilter: new Date().toISOString().split('T')[0],
      },
    },
    {
      headerName: 'End',
      field: 'OccurrenceMaxStartDate',
      sortable: true,
      filter: 'agDateColumnFilter',
      filterParams: {
        defaultOption: 'lessThan',
      },
    },
    {
      headerName: 'Occurs',
      field: 'OccurrenceDescription',
    },
    {
      headerName: 'Time',
      field: 'EventTimeDescription',
    },
    {
      headerName: 'Location',
      field: 'FacilityLocation',
    },
    {
      headerName: 'Min age',
      field: 'FormattedMinimumAge',
    },
    {
      headerName: 'Max age',
      field: 'FormattedMaximumAge',
    },
    {
      headerName: 'Price',
      field: 'PriceRange',
    },
    {
      headerName: 'Spots',
      field: 'spots',
      cellRenderer: (params: { data: Course; value: string }) => {
        const url = `https://${city}.perfectmind.com/Clients/BookMe4LandingPages/CoursesLandingPage?courseId=${params.data.EventId}`;

        return (
          <a className="text-blue-600 hover:underline dark:text-blue-400" href={url} target="_blank" rel="noopener noreferrer">
            {params.value}
          </a>
        );
      },
    },
  ];

  const toggleStartFilter = async () => {
    if (gridRef.current === null) return;

    const dateFilterComponent = await gridRef.current.api.getColumnFilterInstance('OccurrenceMinStartDate');

    if (!dateFilterComponent) return;

    if (isTodayFilterChecked) {
      dateFilterComponent.setModel(null);
    } else {
      dateFilterComponent.setModel({
        type: 'greaterThan',
        dateFrom: new Date().toISOString().split('T')[0],
      });
    }

    gridRef.current.api.onFilterChanged();
    setIsTodayFilterChecked(!isTodayFilterChecked);
  };

  const toggleSpotsAvailableFilter = async () => {
    if (gridRef.current === null) return;

    const spotsFilterComponent = await gridRef.current.api.getColumnFilterInstance('spots');

    if (!spotsFilterComponent) return;

    console.log(spotsFilterComponent.getModel());

    if (isSpotsAvailableChecked) {
      spotsFilterComponent.setModel(null);
    } else {
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
            filter: 'Waitlist',
          },
        ],
      });
    }

    gridRef.current.api.onFilterChanged();
    setIsSpotsAvailableChecked(!isSpotsAvailableChecked);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="mb-3 flex gap-2 rounded-lg border bg-white p-3 shadow-lg dark:border-gray-700 dark:bg-gray-800">
        <label className="flex cursor-pointer items-center space-x-2">
          <input
            type="checkbox"
            checked={isTodayFilterChecked}
            onChange={toggleStartFilter}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
          <span className="font-medium text-gray-900 dark:text-gray-100">Filter upcoming events</span>
        </label>

        <label className="flex cursor-pointer items-center space-x-2">
          <input
            type="checkbox"
            checked={isSpotsAvailableChecked}
            onChange={toggleSpotsAvailableFilter}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
          <span className="font-medium text-gray-900 dark:text-gray-100">Show only available spots</span>
        </label>
      </div>

      <div className="ag-theme-quartz-auto-dark flex-1">
        <AgGridReact<Row>
          ref={gridRef}
          autoSizeStrategy={{
            type: 'fitCellContents',
          }}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={{ filter: true }}
        />
      </div>
    </div>
  );
};
