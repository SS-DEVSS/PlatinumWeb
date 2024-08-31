import { Category } from "./category";

export type Brand = {
  id: string;
  name: string;
  description?: string;
  logo_img_url: string;
  categories?: Category[];
};
