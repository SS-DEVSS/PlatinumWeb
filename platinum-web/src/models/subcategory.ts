export type Subcategory = {
  id: string;
  name: string;
  description: string | null;
  categoryId: string | null;
  parentId: string | null;
  productCount?: number;
  children?: Subcategory[];
};
