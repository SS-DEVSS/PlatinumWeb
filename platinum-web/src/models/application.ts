import { AttributeValue } from "./item";

export type Application = {
  id: string;
  sku: string; // Links to product
  origin: string; // e.g., "Fabricante", "Nueva aplicación"
  attributeValues: AttributeValue[]; // Vehicle data (Modelo, Submodelo, Año, etc.)
  createdAt?: Date;
  updatedAt?: Date;
};

