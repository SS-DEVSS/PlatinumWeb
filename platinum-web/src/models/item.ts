import { Category, CategoryAtributes } from "./category";
import { Document } from "./document";
import { Note } from "./note";
import { Reference } from "./reference";

export type Item = {
  id: string;
  sku: string;
  description: string;
  notes: Note[];
  documents: Document[];
  idCategory: Category["id"];
  references: Reference[];
  variants?: Variant[];
  attributes?: CategoryAtributes[];
};

export type Variant = {
  id: string;
  idProduct: string;
  name: string;
  sku: string;
  price: number;
  stockQuantity: number;
  images: [];
  variantAttributes: Attribute[];
};

export type Attribute = {
  id: string;
  valueString: string | null;
  valueNumber: number | null;
  valueBoolean: boolean | null;
  valueDate: Date | null;
  idVariantAttribute: string;
};
