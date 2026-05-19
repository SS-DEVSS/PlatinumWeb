export type CatalogProductSort =
  | "sku_asc"
  | "sku_desc"
  | "created_desc"
  | "created_asc";

export const CATALOG_SORT_OPTIONS: { value: CatalogProductSort; label: string }[] = [
  { value: "sku_asc", label: "SKU (A-Z)" },
  { value: "sku_desc", label: "SKU (Z-A)" },
  { value: "created_desc", label: "Agregados recientemente" },
  { value: "created_asc", label: "Agregados más antiguos" },
];
