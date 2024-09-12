import { Brand } from "./brand";

export type Category = {
  id: string;
  name: string;
  imgUrl: string;
  description: string;
  brands?: Brand[];
  categoryAttributes?: CategoryAtribute[];
  products?: [];
  variantAttributes?: VariantAtributes[];
  kits: [];
};

export enum CategoryAttributesTypes {
  STRING = "string",
  NUMERIC = "numeric",
  DATE = "date",
}

export const typesArray = Object.values(CategoryAttributesTypes);

console.log(typesArray);

export type CategoryAtribute = {
  id: string;
  id_category: string;
  name: string;
  type: CategoryAttributesTypes;
  required: boolean;
};

export type VariantAtributes = {
  id: string;
  name: string;
  type: CategoryAttributesTypes;
  required: boolean;
  order: number;
};
