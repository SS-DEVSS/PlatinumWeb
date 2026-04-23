export type TechnicalSheet = {
  id: string;
  title: string;
  url: string;
  description?: string;
  products?: Array<{ id: string; name: string }> | null;
  references?: string[] | null;
};
