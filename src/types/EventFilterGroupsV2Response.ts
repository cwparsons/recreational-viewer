export interface EventFilterGroupsV2Response {
  filterGroups: FilterGroup[];
}

export interface FilterGroup {
  GroupName: string;
  GroupPluralName?: string;
  FilterGroupOrder: unknown;
  FilterGroupKind: number;
  Values: Value[];
  Visible: boolean;
}

export interface Value {
  Name: string;
  ReadableName: unknown;
  Value?: string;
  Value2?: string;
  Metadata?: Metadata;
  ValueKind: number;
  Children?: Children[];
}

export interface Metadata {
  ApplyStartDateLimitation: boolean;
}

export interface Children {
  Name: string;
  ReadableName: unknown;
  Value: string;
  Value2: unknown;
  Metadata: unknown;
  ValueKind: number;
  Children: unknown[];
}
