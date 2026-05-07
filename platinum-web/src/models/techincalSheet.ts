export type TechnicalSheet = {
  id: string;
  title: string;
  url: string;
  description?: string;
  products?: Array<{ id: string; name: string; sku?: string | null }> | null;
  references?: string[] | null;
};
