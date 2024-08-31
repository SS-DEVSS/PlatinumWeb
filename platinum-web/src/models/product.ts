import { Category, CategoryAtributes } from "./category";
import { Document } from "./document";
import { Note } from "./note";
import { Reference } from "./reference";

export type Product = {
  id: string;
  sku: string;
  description: string;
  notes: Note[];
  documents: Document[];
  idCategory: Category["id"];
  references: Reference[];
  variants?: ProductVariant[];
  attributes?: CategoryAtributes[];
};

export type ProductVariant = {
  id: string;
  img_url: string;
  name: string;
  sku: string;
  price?: number;
  quantity?: number;
};

export type ProductSkeleton = {
  id: string;
  image: string;
  sku: string;
  brand: string;
  model: string;
  engine: string;
  year: string;
  diameter: number;
};
