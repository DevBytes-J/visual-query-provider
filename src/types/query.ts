export type Operator = 'eq' | 'neq' | 'gt' | 'lt' | 'contains' | 'startsWith' | 'in' | 'between';

export type ValueType = 'string' | 'number' | 'date' | 'enum' | 'boolean';

export type Condition = {
  id: string;
  field: string;
  operator: Operator;
  value: any;
  valueType: ValueType;
};

export type Group = {
  id: string;
  logic: 'AND' | 'OR';
  children: Array<Condition | Group>;
};

export type QueryTree = Group; // root is always a group
