import { Brand } from "./brand";

export type Category = {
  id: string;
  name: string;
  description: string;
  imgUrl: string;
  brands?: Brand[];
  attributes?: {
    product?: Attribute[];      // Product attributes
    variant?: Attribute[];       // Variant attributes (placeholders)
    reference?: Attribute[];     // Reference attributes (custom fields only)
    application?: Attribute[];   // Application attributes (Modelo, Submodelo, Año, etc.)
  };
  products?: [];
};

export interface Attribute {
  id: string;
  name: string;
  csvName?: string | null; // CSV column name (e.g., "CC_Motor")
  displayName?: string | null; // Display name for UI (e.g., "CC Motor")
  required: boolean;
  type: CategoryAttributesTypes;
  order: number;
  scope: string;
  visibleInCatalog?: boolean;
  visibleInProductDetail?: boolean;
  filterRequired?: boolean;
}

export enum CategoryAttributesTypes {
  STRING = "string",
  NUMERIC = "numeric",
  DATE = "date",
}

export interface ProductCategory {
  id: string;
  name: string;
  type: CategoryAttributesTypes;
  description: string;
}

export const typesArray = Object.values(CategoryAttributesTypes);
