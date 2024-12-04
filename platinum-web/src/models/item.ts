import { TechnicalSheet } from "./techincalSheet";
import { Note } from "./note";
import { Reference } from "./reference";
import { Image } from "./image";

export type Item = {
  id: string;
  name: string;
  type: "SINGLE" | "KIT";
  description: string;
  category: {
    id: string;
    name: string;
  };
  references: Reference[];
  variants?: Variant[];
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
  kitItems?: Item[];
  attributeValues: AttributeValue[];
};

export interface AttributeValue {
  id: string;
  valueString?: string | null;
  valueNumber?: number | null;
  valueBoolean?: boolean | null;
  valueDate?: Date | null;
}
