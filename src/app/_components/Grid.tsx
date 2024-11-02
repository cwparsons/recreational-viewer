'use client';

import { Course } from '@/types/CoursesV2Response';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, ColGroupDef } from '@ag-grid-community/core';
import { themeQuartz } from '@ag-grid-community/theming';

const theme = themeQuartz.withParams({
  backgroundColor: '#1f2836',
  browserColorScheme: 'dark',
  chromeBackgroundColor: {
    ref: 'foregroundColor',
    mix: 0.07,
    onto: 'backgroundColor',
  },
  fontFamily: 'inherit',
  foregroundColor: '#FFF',
  headerFontSize: 14,
});

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
  console.log(courses[0]);

  const rowData = courses.map((course) => ({
    ...course,
    OccurrenceMinStartDate: new Date(course.OccurrenceMinStartDate),
    OccurrenceMaxStartDate: course.OccurrenceMaxStartDate ? new Date(course.OccurrenceMaxStartDate.replace(' - ', '')) : undefined,
    FormattedMinimumAge: `${course.MinAge ?? 0}y ${course.MinAgeMonths ?? 0}m`,
    FormattedMaximumAge: `${course.MaxAge ?? 0}y ${course.MaxAgeMonths ?? 0}m`,
    FacilityLocation: getFacilityLocation(course),
    spots: course.BookButtonText === 'Closed' ? 'Closed' : course.Spots || 'N/A',
  }));

  const columnDefs: (ColDef | ColGroupDef)[] = [
    {
      headerName: 'Name',
      field: 'EventName',
      sort: 'asc',
      pinned: 'left',
    },
    {
      headerName: 'No.',
      field: 'CourseIdTrimmed',
      maxWidth: 100,
    },
    {
      headerName: 'Start',
      field: 'OccurrenceMinStartDate',
      maxWidth: 120,
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
      maxWidth: 120,
      sortable: true,
      filter: 'agDateColumnFilter',
      filterParams: {
        defaultOption: 'lessThan',
      },
    },
    {
      headerName: 'Occurs',
      field: 'OccurrenceDescription',
      maxWidth: 150,
    },
    {
      headerName: 'Time',
      field: 'EventTimeDescription',
      maxWidth: 200,
    },
    {
      headerName: 'Location',
      field: 'FacilityLocation',
    },
    {
      headerName: 'Min age',
      field: 'FormattedMinimumAge',
      maxWidth: 100,
    },
    {
      headerName: 'Max age',
      field: 'FormattedMaximumAge',
      maxWidth: 100,
    },
    {
      headerName: 'Price',
      field: 'PriceRange',
      maxWidth: 150,
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

  const gridOptions = {
    autoSizeStrategy: {
      type: 'fitCellContents',
      defaultMinWidth: 100,
    },
  };

  return (
    <AgGridReact
      gridOptions={gridOptions}
      rowData={rowData}
      columnDefs={columnDefs.map((c) => ({ ...c, filter: true }))}
      defaultColDef={{ flex: 1, minWidth: 100 }}
      theme={theme}
    />
  );
};
