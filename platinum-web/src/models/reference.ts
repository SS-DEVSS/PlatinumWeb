import { AttributeValue } from "./item";

export type Reference = {
  id: string;
  sku: string; // Links to product
  referenceBrand: string | null;
  referenceNumber: string;
  typeOfPart: string | null;
  type: string; // e.g., "Aftermarket"
  description: string | null;
  attributeValues: AttributeValue[]; // Only for additional/custom fields
  createdAt?: Date;
  updatedAt?: Date;
};

// Legacy format for backward compatibility
export type ReferenceLegacy = {
  value: string;
};
