import { Course } from '@/types/CoursesV2Response';

export interface FormattedCourse extends Omit<
  Course,
  'OccurrenceMinStartDate' | 'OccurrenceMaxStartDate'
> {
  OccurrenceMinStartDate: Date;
  OccurrenceMaxStartDate?: Date;
  MinimumAge: number;
  MaximumAge: number;
  FacilityLocation: string;
  spots: string;
}

export function formatCourseData(course: Course): FormattedCourse {
  return {
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
  };
}

export function formatAgeDisplay(ageInYears: number): string {
  const totalMonths = Math.round(ageInYears * 12);
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  return `${years}y ${months}m`;
}
