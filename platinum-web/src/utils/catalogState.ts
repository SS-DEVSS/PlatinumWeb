import type { CatalogProductSort } from "../models/catalogSort";

export type CatalogViewLevel = "categories" | "subcategories" | "products";

export type CatalogVehicleFilter = {
  attributeId: string;
  value: string;
};

export type CatalogActiveVehicleFilter = CatalogVehicleFilter & {
  attributeName: string;
};

export type CatalogPersistedState = {
  brandId: string | null;
  categoryId: string | null;
  viewLevel: CatalogViewLevel;
  selectedSubcategoryId: string | null;
  drillParentSubcategoryId: string | null;
  searchText: string;
  vehicleFilters: CatalogVehicleFilter[];
  activeVehicleFilters: CatalogActiveVehicleFilter[];
  page: number;
  pageSize: number;
  catalogSort: CatalogProductSort;
};

export const CATALOGO_LAST_STATE_KEY = "catalogo-last-state";

export function readCatalogPersistedState(): Partial<CatalogPersistedState> | null {
  // Try direct key first, fall back to extracting brandId from old full JSON state
  const directBrandId = localStorage.getItem("catalogo-selected-marca");
  if (directBrandId) return { brandId: directBrandId };

  try {
    const raw = localStorage.getItem(CATALOGO_LAST_STATE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<CatalogPersistedState>;
    if (parsed.brandId) return { brandId: parsed.brandId };
  } catch {
    // ignore
  }
  return null;
}

export function writeCatalogPersistedState(state: CatalogPersistedState): void {
  if (state.brandId) {
    localStorage.setItem("catalogo-selected-marca", state.brandId);
  }
  // Clear old full JSON state so it doesn't interfere
  localStorage.removeItem(CATALOGO_LAST_STATE_KEY);
}
