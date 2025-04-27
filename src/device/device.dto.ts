enum DeviceState {
  available = 'available',
  inUse = 'in-use',
  inactive = 'inactive',
}

export class DeviceDto {
  id: string;
  name: string;
  brand: string;
  state: DeviceState;
  creationTime: number;
}

export interface FindAllParameters {
  brand?: string;
  state?: DeviceState;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc'; // default is 'asc'
}
