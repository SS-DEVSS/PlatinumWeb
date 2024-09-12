import { CategoryAtribute } from "./category";
import { Document } from "./document";
import { Note } from "./note";
import { Reference } from "./reference";

export type Item = {
  id: string;
  name: string;
  sku: string;
  description: string;
  notes: Note[];
  documents: Document[];
  category: {
    id: string;
    name: string;
  };
  references: Reference[];
  variants?: Variant[];
  kitVariants?: Variant[];
  productVariants?: Variant[];
  productCategoryAttributes?: Attribute[];
  kitCategoryAttributes?: Attribute[];
  attributes?: CategoryAtribute[];
};

export type Variant = {
  id: string;
  idProduct?: string;
  idKit?: string;
  idParent?: string;
  name: string;
  sku: string;
  price: number;
  stockQuantity: number;
  images: [];
  variantAttributes: Attribute[];
  productVariants?: ComponentVariant[];
};

export type Attribute = {
  id: string;
  valueString: string | null;
  valueNumber: number | null;
  valueBoolean: boolean | null;
  valueDate: Date | null;
  idVariantAttribute: string;
  idCategoryAttribute: string;
};

export type ComponentVariant = {
  id: string;
  name: string;
  sku: string;
  price: number;
  stockQuantity: number;
};
