export interface Departament {
  id: number;
  name: string;
  description: string;
  cityCapitalId: number;
  municipalities: number;
  surface: number;
  population: number;
  phonePrefix: string;
  countryId: number;
  cityCapital: City;
  country: Country;
  cities: City[];
  regionId: number;
  region: Region;
  naturalAreas: NaturalArea[];
  maps: Map[];
  indigenousReservations: IndigenousReservation[];
  airports: Airport[];
}

export interface Airport {
  id: number;
  name: string;
  iataCode: string;
  oaciCode: string;
  type: string;
  deparmentId: number;
  department: string;
  cityId: number;
  city: string;
  latitude: number;
  longitude: number;
}

export interface City {
  id: number;
  name: string;
  description: string;
  surface: number;
  population: number;
  postalCode: string;
  departmentId: number;
  department: string;
  touristAttractions: TouristAttraction[];
  presidents: President[];
  indigenousReservations: IndigenousReservation[];
  airports: Airport[];
  radios: Radio[];
}

export interface IndigenousReservation {
  id: number;
  name: string;
  code: string;
  procedureType: string;
  administrativeActType: string;
  administrativeActNumber: number;
  administrativeActDate: Date;
  nativeCommunityId: number;
  nativeCommunity: NativeCommunity;
  deparmentId: number;
  department: string;
  cityId: number;
  city: string;
}

export interface NativeCommunity {
  id: number;
  name: string;
  description: string;
  languages: string;
  images: string[];
  indigenousReservations: string[];
}

export interface President {
  id: number;
  image: string;
  name: string;
  lastName: string;
  startPeriodDate: Date;
  endPeriodDate: Date;
  politicalParty: string;
  description: string;
  cityId: number;
  city: string;
}

export interface Radio {
  id: number;
  name: string;
  frequency: number;
  band: string;
  cityId: number;
  city: string;
  url: string;
  streamers: string[];
}

export interface TouristAttraction {
  id: number;
  name: string;
  description: string;
  images: string[];
  latitude: string;
  longitude: string;
  cityId: number;
  city: string;
}

export interface Country {
  id: number;
  name: string;
  description: string;
  stateCapital: string;
  surface: number;
  population: number;
  languages: string[];
  timeZone: string;
  currency: string;
  currencyCode: string;
  currencySymbol: string;
  isoCode: string;
  internetDomain: string;
  phonePrefix: string;
  radioPrefix: string;
  aircraftPrefix: string;
  subRegion: string;
  region: string;
  borders: string[];
  flags: string[];
}

export interface Map {
  id: number;
  name: string;
  description: string;
  departmentId: number;
  urlImages: string[];
  urlSource: string;
  department: string;
}

export interface NaturalArea {
  id: number;
  areaGroupId: number;
  categoryNaturalAreaId: number;
  name: string;
  departmentId: number;
  daneCode: number;
  landArea: number;
  maritimeArea: number;
  department: string;
  categoryNaturalArea: Region;
}

export interface Region {
  id: number;
  name: string;
  description: string;
  naturalAreas?: string[];
  departments?: string[];
}
