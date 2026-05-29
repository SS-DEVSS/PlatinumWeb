import type { MouseEvent } from "react";
import { Item } from "../models/item";

export function getProductDetailPath(product: Pick<Item, "id" | "type">): string {
  return product.type === "KIT" ? `/kit/${product.id}` : `/producto/${product.id}`;
}

export function shouldOpenProductInNewTab(event: MouseEvent): boolean {
  return event.metaKey || event.ctrlKey || event.shiftKey;
}
