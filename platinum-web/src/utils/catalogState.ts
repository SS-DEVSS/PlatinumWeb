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

export function readCatalogPersistedState(): CatalogPersistedState | null {
  const raw = localStorage.getItem(CATALOGO_LAST_STATE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as CatalogPersistedState;
  } catch {
    return null;
  }
}

export function writeCatalogPersistedState(state: CatalogPersistedState): void {
  localStorage.setItem(CATALOGO_LAST_STATE_KEY, JSON.stringify(state));
  if (state.brandId) {
    localStorage.setItem("catalogo-selected-marca", state.brandId);
  }
  if (state.categoryId) {
    localStorage.setItem("catalogo-selected-categoria", state.categoryId);
  }
}
