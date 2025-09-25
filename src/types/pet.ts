export interface Location {
  lat: number;
  lng: number;
}

export interface Pet {
  id: string;
  name: string;
  breed: string;
  age: number;
  description?: string;
  photo: string;
  homeLocation: Location;
  currentLocation: Location;
  pathHistory: Location[];
  isActive: boolean;
  lastUpdate: Date;
}