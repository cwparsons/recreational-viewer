export interface CoursesV2Response {
  courses: Course[];
  nextKey: string;
}

export interface Course {
  OccurrenceMinStartDate: string;
  OccurrenceMaxStartDate: string;
  DisplayableRestrictionsForCourses: string;
  DisplayablePrerequisiteEventsRestrictionsForCourses: string;
  EventTimeDescription: string;
  EventId: string;
  CourseId: string;
  CourseIdTrimmed: string;
  EventName: string;
  Details: string;
  Spots: string;
  OccurrenceDate: unknown;
  BookButtonText: string;
  BookButtonDescription: string;
  ClosedButtonName: string;
  Instructor: unknown;
  Facility: string;
  DisplaySettings: DisplaySettings;
  PriceRange: string;
  AllDayEvent: boolean;
  AnyTimeBrokenOccurrences: boolean;
  FormattedStartDate: string;
  FormattedStartTime: string;
  FormattedEndDate: string;
  FormattedEndTime: string;
  FirstOccurrenceFormattedEndTime: string;
  AlternativeLocation: unknown;
  HasAlternativeLocation: boolean;
  OccurrenceDescription: string;
  Occurrences: Occurrence[];
  NumberOfSessions: number;
  PrerequisiteEvents: boolean;
  MinAge: unknown;
  MinAgeMonths: number;
  MaxAge: unknown;
  MaxAgeMonths: number;
  NoAgeRestriction: boolean;
  AgeRestrictions: string;
  GenderRestrictions: string;
  RankRestrictions: string;
  FromRank: unknown;
  ToRank: unknown;
  StartingRankId: unknown;
  EndingRankId: unknown;
  DurationInMinutes: number;
  FeeFrequency: unknown;
  OrgLogo: string;
  OrgIsSingleLocation: boolean;
  OrgLegalName: string;
  OrgName: string;
  Address: Address;
  Location: string;
  BookingType: number;
}

export interface DisplaySettings {
  DisplayInstructorsName: boolean;
  DisplayPrices: boolean;
  DisplaySpotsLeft: boolean;
  DisplayRegistrationDate: boolean;
  DisplayNumberOfSessions: boolean;
  DisplayCourseId: boolean;
  DisplayAgeRestrictions: boolean;
  DisplayRankRestrictions: boolean;
  DisplayGenderRestrictions: boolean;
  ButtonName: string;
  UseBookMe5UiWidgetVersion: boolean;
  WidgetUIVersion: number;
}

export interface Occurrence {
  StartDateWithOffset: string;
  StartDate: string;
  EndDateWithOffset: string;
  EndDate: string;
  OccurrenceOrderNumber: number;
  DurationInMinutes: number;
}

export interface Address {
  AddressTag: string;
  Street: string;
  City: string;
  PostalCode: string;
  CountryId: number;
  Country: string;
  StateProvinceId: number;
  AnyFieldMissing: boolean;
  Latitude: number;
  Longitude: number;
  Id: string;
}
