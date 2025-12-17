export interface FuelLog {
  id: string;
  date: string;
  fuelBrand: string;
  amountRM: number;
  litres: number;
  odoStart: number;
  odoEnd: number;
  distance: number;
  kmPerRM: number;
  kmPerLiter: number;
  notes: string;
  timestamp: number;
}

export interface AppSettings {
  useGoogleSheets: boolean;
  googleScriptUrl: string; // Secure way: User deploys a Web App script, we post to it.
}

export enum Page {
  DASHBOARD = 'dashboard',
  ADD_LOG = 'add_log',
  HISTORY = 'history',
  SETTINGS = 'settings'
}