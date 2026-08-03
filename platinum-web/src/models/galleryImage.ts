export type GalleryImage = {
  id: string;
  /** URL pública ya resuelta por el backend. */
  imageUrl: string;
  /** Posición dentro de la galería (menor primero). */
  sortOrder?: number;
};
