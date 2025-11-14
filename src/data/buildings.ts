export interface Building {
  id: string;
  name: string;
  position: [number, number, number];
  size: [number, number, number];
  color: string;
  type: 'shop' | 'office' | 'home';
  hasInterior: boolean;
}

export const buildings: Building[] = [
  {
    id: 'shop-1',
    name: 'Corner Store',
    position: [-10, 1.5, 5],
    size: [3, 3, 3],
    color: '#e74c3c',
    type: 'shop',
    hasInterior: true,
  },
  {
    id: 'office-1',
    name: 'Tech Office',
    position: [5, 2, -5],
    size: [4, 4, 4],
    color: '#3498db',
    type: 'office',
    hasInterior: true,
  },
  {
    id: 'home-1',
    name: 'Apartment',
    position: [-8, 1.5, -8],
    size: [3, 3, 3],
    color: '#f39c12',
    type: 'home',
    hasInterior: true,
  },
  {
    id: 'shop-2',
    name: 'Coffee Shop',
    position: [8, 1.5, 8],
    size: [3, 3, 3],
    color: '#9b59b6',
    type: 'shop',
    hasInterior: true,
  },
];

export const jobs = [
  {
    id: 'shop-clerk',
    name: 'Shop Clerk',
    buildingId: 'shop-1',
    payRate: 15,
    description: 'Work at the corner store',
  },
  {
    id: 'office-worker',
    name: 'Software Developer',
    buildingId: 'office-1',
    payRate: 50,
    description: 'Code at the tech office',
  },
  {
    id: 'barista',
    name: 'Barista',
    buildingId: 'shop-2',
    payRate: 12,
    description: 'Make coffee for customers',
  },
];
