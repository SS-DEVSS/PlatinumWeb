import { Category } from "../models/category";
import { Subcategory } from "../models/subcategory";

export type CategoryDrillLevel =
  | { type: "category"; category: Category }
  | { type: "subcategory"; category: Category; node: Subcategory };

export type CategorySearchHit = {
  category: Category;
  subcategoryId: string | null;
  label: string;
};

export const matchCategorySearch = (query: string, name: string): boolean =>
  !query.trim() || name.toLowerCase().includes(query.trim().toLowerCase());

export function flattenCategorySearchHits(
  categories: Category[],
  subcategoriesByCategoryId: Map<string, Subcategory[]>
): CategorySearchHit[] {
  const hits: CategorySearchHit[] = [];
  for (const cat of categories) {
    if (!cat.id) continue;
    hits.push({ category: cat, subcategoryId: null, label: cat.name ?? "" });
    const tree = subcategoriesByCategoryId.get(cat.id) ?? [];
    const walk = (nodes: Subcategory[], path: string[]) => {
      for (const node of nodes) {
        const currentPath = [...path, node.name];
        const label = [cat.name, ...currentPath].join(" › ");
        hits.push({ category: cat, subcategoryId: node.id, label });
        if (node.children?.length) walk(node.children, currentPath);
      }
    };
    walk(tree, []);
  }
  return hits;
}

export function getCategoryFilterLabel(
  category: Category | null,
  subcategoryId: string | null,
  subcategoriesByCategoryId: Map<string, Subcategory[]>
): string {
  if (!category) return "Todas las categorías";
  if (!subcategoryId) return category.name ?? "";

  const tree = category.id ? subcategoriesByCategoryId.get(category.id) : undefined;
  if (!tree) return category.name ?? "";

  const findPath = (nodes: Subcategory[], targetId: string, path: string[] = []): string[] | null => {
    for (const node of nodes) {
      const currentPath = [...path, node.name];
      if (node.id === targetId) return currentPath;
      if (node.children?.length) {
        const found = findPath(node.children, targetId, currentPath);
        if (found) return found;
      }
    }
    return null;
  };

  const path = findPath(tree, subcategoryId);
  if (!path) return category.name ?? "";
  return `${category.name} › ${path.join(" › ")}`;
}
