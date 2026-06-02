export interface BakeryItem {
  pastry_name: string;
  batch_date: string;
  inventory_level: number;
  status: string;
  is_vegan: boolean;
}

export const mockBakeryData: BakeryItem[] = [
  { pastry_name: 'Matcha Croissant', batch_date: '2023-10-01', inventory_level: 15, status: 'Fresh', is_vegan: false },
  { pastry_name: 'Strawberry Macaron', batch_date: '2023-10-02', inventory_level: 42, status: 'Baking', is_vegan: false },
  { pastry_name: 'Vegan Chocolate Cake', batch_date: '2023-10-01', inventory_level: 5, status: 'Fresh', is_vegan: true },
  { pastry_name: 'Vanilla Eclair', batch_date: '2023-09-28', inventory_level: 0, status: 'Sold Out', is_vegan: false },
  { pastry_name: 'Day-Old Baguette', batch_date: '2023-09-30', inventory_level: 8, status: 'Day Old', is_vegan: true },
  { pastry_name: 'Almond Tart', batch_date: '2023-10-03', inventory_level: 20, status: 'Baking', is_vegan: false },
  { pastry_name: 'Lemon Meringue', batch_date: '2023-10-02', inventory_level: 12, status: 'Fresh', is_vegan: false },
  { pastry_name: 'Vegan Blueberry Scone', batch_date: '2023-10-01', inventory_level: 18, status: 'Fresh', is_vegan: true }
];
