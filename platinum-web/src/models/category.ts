import { Brand } from "./brand";

export type Category = {
  id: string;
  name: string;
  image: string;
  description: string;
  brands?: Brand[];
  attributes?: CategoryAtributes[];
  variants?: string[];
};

export enum CategoryAttributesTypes {
  STRING = "string",
  NUMERIC = "numeric",
  DATE = "date",
}

export const typesArray = Object.values(CategoryAttributesTypes);

console.log(typesArray);

export type CategoryAtributes = {
  id: string;
  id_category: string;
  name: string;
  type: CategoryAttributesTypes;
  required: boolean;
};
