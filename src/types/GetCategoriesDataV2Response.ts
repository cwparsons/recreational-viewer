export type GetCategoriesDataV2Response = GetCategoriesDataV2[];

export interface GetCategoriesDataV2 {
  Name: string;
  OriginalName: string;
  ShowCalendarCategory: boolean;
  Calendars: Calendar[];
}

export interface Calendar {
  Items: unknown[];
  Category: unknown;
  BookingLink?: string;
  MakeupBookingLink?: string;
  BookingTypeInfo: BookingTypeInfo;
  AssignedServices: unknown;
  PreventDuplicateBookingWithinEventGroup: boolean;
  Id: string;
  Name: string;
  EventObjectId: string;
}

export interface BookingTypeInfo {
  BookingType: number;
  IsSchoolProgram: boolean;
  IsCustomBookingOnline: boolean;
  IsCustomBookingAdmin: boolean;
  IsCustomBooking: boolean;
}
