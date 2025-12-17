import { FuelLog, AppSettings } from '../types';

const STORAGE_KEY = 'velocity_track_logs';
const SETTINGS_KEY = 'velocity_track_settings';

// Default Settings
const defaultSettings: AppSettings = {
  useGoogleSheets: false,
  googleScriptUrl: '',
};

// --- Local Storage Helpers ---

export const getSettings = (): AppSettings => {
  const stored = localStorage.getItem(SETTINGS_KEY);
  return stored ? JSON.parse(stored) : defaultSettings;
};

export const saveSettings = (settings: AppSettings) => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};

export const getLogs = (): FuelLog[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  try {
    const logs = JSON.parse(stored);
    // Sort by odometer descending (newest first)
    return logs.sort((a: FuelLog, b: FuelLog) => b.odoEnd - a.odoEnd);
  } catch (e) {
    console.error("Failed to parse logs", e);
    return [];
  }
};

export const saveLog = async (log: FuelLog): Promise<boolean> => {
  try {
    // 1. Save Locally
    const currentLogs = getLogs();
    const updatedLogs = [log, ...currentLogs];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLogs));

    // 2. Try Cloud Sync if enabled
    const settings = getSettings();
    if (settings.useGoogleSheets && settings.googleScriptUrl) {
      await syncToGoogleSheets(log, settings.googleScriptUrl);
    }

    return true;
  } catch (error) {
    console.error("Error saving log:", error);
    return false;
  }
};

export const deleteLog = (id: string) => {
  const currentLogs = getLogs();
  const updatedLogs = currentLogs.filter(l => l.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLogs));
};

// --- Google Sheets Integration ---
// Security Note: We use a user-provided Google Apps Script Web App URL.
// This prevents exposing API keys in client-side code. The Script acts as a proxy.
const syncToGoogleSheets = async (log: FuelLog, scriptUrl: string) => {
  try {
    // We use no-cors to avoid CORS errors with simple form submission simulation
    // Ideally the GAS script returns JSONP or correct CORS headers. 
    // For this implementation, we send a POST request.
    const formData = new FormData();
    formData.append('action', 'append');
    formData.append('data', JSON.stringify(log));

    await fetch(scriptUrl, {
      method: 'POST',
      body: formData,
      mode: 'no-cors' // This is opaque, we won't know if it truly succeeded without proper CORS setup on server
    });
    // Since 'no-cors' doesn't return status, we assume success if no network error thrown
    console.log("Sent to Google Sheets");
  } catch (e) {
    console.error("Failed to sync to Google Sheets", e);
    // We don't block the UI, local save is primary
  }
};

// Generate Mock Data for first-time users
export const generateMockData = () => {
  const baseOdo = 50000;
  const mockLogs: FuelLog[] = [];
  
  for (let i = 0; i < 5; i++) {
    const dist = 400 + Math.random() * 50;
    const litres = 35 + Math.random() * 5;
    const pricePerLiter = 2.05; 
    const amount = litres * pricePerLiter;
    
    const log: FuelLog = {
      id: crypto.randomUUID(),
      date: new Date(Date.now() - (i * 7 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
      fuelBrand: i % 2 === 0 ? 'Shell' : 'Petronas',
      amountRM: parseFloat(amount.toFixed(2)),
      litres: parseFloat(litres.toFixed(2)),
      odoStart: baseOdo + (i * 450),
      odoEnd: baseOdo + (i * 450) + dist,
      distance: parseFloat(dist.toFixed(1)),
      kmPerRM: parseFloat((dist / amount).toFixed(2)),
      kmPerLiter: parseFloat((dist / litres).toFixed(2)),
      notes: 'Generated Sample Data',
      timestamp: Date.now() - (i * 1000)
    };
    mockLogs.push(log);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mockLogs));
};