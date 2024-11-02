export interface EventFilterGroupsV2Response {
  filterGroups: FilterGroup[];
}

export interface FilterGroup {
  GroupName: string;
  GroupPluralName?: string;
  FilterGroupOrder: any;
  FilterGroupKind: number;
  Values: Value[];
  Visible: boolean;
}

export interface Value {
  Name: string;
  ReadableName: any;
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
  ReadableName: any;
  Value: string;
  Value2: any;
  Metadata: any;
  ValueKind: number;
  Children: any[];
}
