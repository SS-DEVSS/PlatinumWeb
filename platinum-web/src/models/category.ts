import { Brand } from "./brand";

export type Category = {
  id: string;
  name: string;
  description: string;
  imgUrl: string;
  brands?: Brand[];
  attributes?: {
    product?: Attribute[];
    variant?: Attribute[];
  };
  products?: [];
};

export interface Attribute {
  id: string;
  name: string;
  required: boolean;
  type: CategoryAttributesTypes;
  order: number;
  scope: string;
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
