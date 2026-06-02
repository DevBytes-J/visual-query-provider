import { ValueType } from '../types/query';

export interface SchemaField {
  id: string;
  name: string;
  type: ValueType;
  icon: string;
  options?: string[]; // Added for enum support
}

export const bakerySchema: SchemaField[] = [
  { id: 'pastry_name', name: 'Pastry Name', type: 'string', icon: 'Croissant' },
  { id: 'batch_date', name: 'Batch Date', type: 'date', icon: 'Calendar' },
  { id: 'inventory_level', name: 'Inventory Level', type: 'number', icon: 'Hash' },
  { id: 'status', name: 'Status', type: 'enum', icon: 'Tag', options: ['Fresh', 'Baking', 'Sold Out', 'Day Old'] },
  { id: 'is_vegan', name: 'Is Vegan', type: 'boolean', icon: 'Leaf' }
];
