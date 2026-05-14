export type ParsedBlogContent = {
  htmlContent: string;
  relatedProductIds: string[];
  relatedReferences: string[];
  relatedApplications: string[];
};

const MARKER = "BLOG_RELATED_LINKS";
const RELATED_LINKS_REGEX = new RegExp(`<!--${MARKER}:([\\s\\S]*?)-->`, "g");

export const parseBlogContent = (rawContent: string): ParsedBlogContent => {
  const matches = rawContent.match(RELATED_LINKS_REGEX);
  const latestMatch = matches && matches.length > 0 ? matches[matches.length - 1] : null;

  let relatedProductIds: string[] = [];
  let relatedReferences: string[] = [];
  let relatedApplications: string[] = [];

  if (latestMatch) {
    const jsonPayload = latestMatch.replace(`<!--${MARKER}:`, "").replace("-->", "").trim();
    try {
      const parsed = JSON.parse(jsonPayload);
      relatedProductIds = Array.isArray(parsed?.productIds)
        ? parsed.productIds.filter((value: unknown) => typeof value === "string")
        : [];
      relatedReferences = Array.isArray(parsed?.references)
        ? parsed.references.filter((value: unknown) => typeof value === "string")
        : [];
      relatedApplications = Array.isArray(parsed?.applications)
        ? parsed.applications.filter((value: unknown) => typeof value === "string")
        : [];
    } catch {
      // Ignore malformed payloads and render content only.
    }
  }

  return {
    htmlContent: rawContent.replace(RELATED_LINKS_REGEX, "").trim(),
    relatedProductIds,
    relatedReferences,
    relatedApplications,
  };
};
