import type { SyntheticEvent } from "react";

export const IMAGE_PLACEHOLDER = "/placeholder.png";
export const IMAGE_PLACEHOLDER_BG = "#999999";
export const IMAGE_PLACEHOLDER_BG_CLASS = "bg-[#999999]";
export const IMAGE_PLACEHOLDER_SCALE_CLASS = "scale-[0.88]";
export const IMAGE_PLACEHOLDER_SURFACE_CLASS = `${IMAGE_PLACEHOLDER_BG_CLASS} rounded-lg overflow-hidden`;

export function isMissingImageUrl(url: string | null | undefined): boolean {
  if (url == null || typeof url !== "string") return true;
  const trimmed = url.trim();
  if (trimmed === "") return true;
  const lower = trimmed.toLowerCase();
  if (lower.endsWith("/placeholder.png") || lower.includes("placeholder.png")) {
    return false;
  }
  if (lower.includes("default.png") || lower.includes("no-image")) return true;
  return false;
}

export function getDisplayImageUrl(url: string | null | undefined): string {
  if (url == null || typeof url !== "string" || isMissingImageUrl(url)) {
    return IMAGE_PLACEHOLDER;
  }
  return url.trim();
}

export function getImageClassName(
  url: string | null | undefined,
  baseClass: string,
  usePlaceholderStyle = false
): string {
  if (usePlaceholderStyle || isMissingImageUrl(url)) {
    return `${baseClass} ${IMAGE_PLACEHOLDER_SCALE_CLASS}`.trim();
  }
  return baseClass;
}

export function shouldUsePlaceholderBackground(
  url: string | null | undefined,
  loadFailed = false
): boolean {
  return isMissingImageUrl(url) || loadFailed;
}

export function getImageSurfaceClassName(
  url: string | null | undefined,
  loadFailed = false,
  extraClass = ""
): string {
  const surfaceClass = shouldUsePlaceholderBackground(url, loadFailed)
    ? IMAGE_PLACEHOLDER_SURFACE_CLASS
    : "bg-white";

  return extraClass ? `${surfaceClass} ${extraClass}`.trim() : surfaceClass;
}

export function onImageErrorFallback(event: SyntheticEvent<HTMLImageElement>): void {
  const target = event.currentTarget;
  if (target.src.includes("placeholder.png")) return;
  target.onerror = null;
  target.src = IMAGE_PLACEHOLDER;
  target.classList.add(IMAGE_PLACEHOLDER_SCALE_CLASS);
}
