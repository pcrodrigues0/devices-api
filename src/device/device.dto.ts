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
