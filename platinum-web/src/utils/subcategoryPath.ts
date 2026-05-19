import { Subcategory } from "../models/subcategory";

function findSubcategoryPathInTree(
  nodes: Subcategory[],
  targetId: string,
  path: Subcategory[] = []
): Subcategory[] | null {
  for (const node of nodes) {
    const currentPath = [...path, node];
    if (node.id === targetId) return currentPath;
    if (node.children?.length) {
      const found = findSubcategoryPathInTree(node.children, targetId, currentPath);
      if (found) return found;
    }
  }
  return null;
}

/** First N levels of the subcategory path, e.g. "Kit > Disco". */
export function formatProductSubcategoryLabel(
  tree: Subcategory[],
  subcategoryId: string | null | undefined,
  maxLevels = 2
): string | null {
  if (!subcategoryId || tree.length === 0 || maxLevels < 1) return null;
  const path = findSubcategoryPathInTree(tree, subcategoryId);
  if (!path?.length) return null;
  const labels = path
    .slice(0, maxLevels)
    .map((node) => node.name?.trim())
    .filter((name): name is string => Boolean(name));
  return labels.length > 0 ? labels.join(" > ") : null;
}
