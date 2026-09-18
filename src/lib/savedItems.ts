/**
 * "Saved" procedures and locations — deliberately NOT a user-account feature.
 * Everything here lives in the visitor's own browser (localStorage): no
 * login, no server-side record tied to a real identity, nothing that turns
 * "searched for a fertility clinic" into data Starkwell holds about a named
 * person. Trade-off: it doesn't follow you to another device, and clearing
 * browser data clears it. That's the right trade for where the site is today
 * — see the account-system conversation this came out of.
 */

export interface SavedService {
  service_key: string;
  display_name: string;
  category: string;
  saved_at: string;
}

export interface SavedFacility {
  facility_key: string;
  label: string;
  address: string;
  city: string;
  saved_at: string;
}

const SERVICES_KEY = "starkwell:saved_services";
const FACILITIES_KEY = "starkwell:saved_facilities";

function read<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function write<T>(key: string, items: T[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(items));
  } catch {
    // Private browsing, storage disabled, or quota exceeded — saving no-ops
    // rather than breaking the page.
  }
}

export function getSavedServices(): SavedService[] {
  return read<SavedService>(SERVICES_KEY);
}

export function isServiceSaved(serviceKey: string): boolean {
  return getSavedServices().some(s => s.service_key === serviceKey);
}

/** Returns the new saved state (true = now saved, false = now removed). */
export function toggleSavedService(
  service: Pick<SavedService, "service_key" | "display_name" | "category">
): boolean {
  const items = getSavedServices();
  const idx = items.findIndex(s => s.service_key === service.service_key);
  if (idx >= 0) {
    items.splice(idx, 1);
    write(SERVICES_KEY, items);
    return false;
  }
  items.unshift({ ...service, saved_at: new Date().toISOString() });
  write(SERVICES_KEY, items);
  return true;
}

export function removeSavedService(serviceKey: string): void {
  write(SERVICES_KEY, getSavedServices().filter(s => s.service_key !== serviceKey));
}

export function getSavedFacilities(): SavedFacility[] {
  return read<SavedFacility>(FACILITIES_KEY);
}

export function isFacilitySaved(facilityKey: string): boolean {
  return getSavedFacilities().some(f => f.facility_key === facilityKey);
}

export function toggleSavedFacility(
  facility: Pick<SavedFacility, "facility_key" | "label" | "address" | "city">
): boolean {
  const items = getSavedFacilities();
  const idx = items.findIndex(f => f.facility_key === facility.facility_key);
  if (idx >= 0) {
    items.splice(idx, 1);
    write(FACILITIES_KEY, items);
    return false;
  }
  items.unshift({ ...facility, saved_at: new Date().toISOString() });
  write(FACILITIES_KEY, items);
  return true;
}

export function removeSavedFacility(facilityKey: string): void {
  write(FACILITIES_KEY, getSavedFacilities().filter(f => f.facility_key !== facilityKey));
}
