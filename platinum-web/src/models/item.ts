import { TechnicalSheet } from "./techincalSheet";
import { Note } from "./note";
import { Reference } from "./reference";
import { Image } from "./image";
import { Component } from "./component";
import { Application } from "./application";

export type Item = {
  id: string;
  name: string;
  type: "SINGLE" | "KIT";
  description: string;
  sku?: string | null; // Product SKU from CSV
  category: {
    id: string;
    name: string;
  };
  references?: Reference[]; // Updated structure
  applications?: Application[]; // NEW - vehicle applications
  variants?: Variant[]; // Placeholders for size/color variations
  components?: Component[]; // NEW - only present for KIT products
  attributeValues: AttributeValue[];
};

export type Variant = {
  id: string;
  idProduct?: string;
  name: string;
  sku: string;
  price: number;
  stockQuantity: number;
  notes: Note[];
  technicalSheets: TechnicalSheet[];
  images: Image[];
  // kitItems REMOVED - no longer exists
  attributeValues: AttributeValue[];
};

export interface AttributeValue {
  id: string;
  valueString?: string | null;
  valueNumber?: number | null;
  valueBoolean?: boolean | null;
  valueDate?: Date | null;
  idAttribute: string;
}

// KitItem interface removed - no longer used
