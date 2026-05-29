import { Application } from "../models/application";
import { Attribute, CategoryAttributesTypes } from "../models/category";
import { AttributeValue } from "../models/item";

/** Max application-attribute filters on product detail compatibilities table. */
export const APPLICATION_TABLE_FILTER_LIMIT = 4;

/** Hidden on catalogue compatibilities table only (admin still shows Origen). */
export const isCatalogueHiddenApplicationAttribute = (attribute: Attribute): boolean => {
  const name = attribute.name.trim().toLowerCase();
  const display = attribute.displayName?.trim().toLowerCase() ?? "";
  return name === "origen" || display === "origen";
};

export const extractYearFromDate = (dateValue: Date | string | null | undefined): number | null => {
  if (!dateValue) return null;
  try {
    const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
    if (!isNaN(date.getTime())) return date.getFullYear();
  } catch {
    // ignore
  }
  return null;
};

export const formatDateValue = (dateValue: Date | string | null | undefined): string => {
  const year = extractYearFromDate(dateValue);
  return year !== null ? year.toString() : "-";
};

const isYearAttribute = (attribute: Attribute): boolean => {
  const nameLower = attribute.name.toLowerCase();
  const displayLower = attribute.displayName?.toLowerCase() ?? "";
  return (
    attribute.type === CategoryAttributesTypes.DATE ||
    nameLower.includes("año") ||
    nameLower.includes("year") ||
    displayLower.includes("año") ||
    displayLower.includes("year")
  );
};

export const getApplicationAttributeDisplayValue = (
  application: Application,
  attribute: Attribute
): string => {
  const attrValue = application.attributeValues.find(
    (av: AttributeValue) => av.idAttribute === attribute.id
  );

  if (isYearAttribute(attribute)) {
    if (attrValue?.valueDate) return formatDateValue(attrValue.valueDate);
    if (attrValue?.valueString) {
      const dateFromString = new Date(attrValue.valueString);
      if (!isNaN(dateFromString.getTime())) return dateFromString.getFullYear().toString();
      return attrValue.valueString;
    }
    return "-";
  }

  const raw =
    attrValue?.valueString ??
    (attrValue?.valueNumber != null ? String(attrValue.valueNumber) : undefined) ??
    (attrValue?.valueBoolean != null ? String(attrValue.valueBoolean) : undefined) ??
    (attrValue?.valueDate ? formatDateValue(attrValue.valueDate) : undefined);

  if (raw == null || String(raw).trim() === "") return "-";
  return String(raw);
};

export const applicationMatchesFilters = (
  application: Application,
  filters: Array<{ attributeId: string; value: string }>,
  attributesById: Map<string, Attribute>
): boolean => {
  return filters.every(({ attributeId, value }) => {
    const attribute = attributesById.get(attributeId);
    if (!attribute) return true;
    return getApplicationAttributeDisplayValue(application, attribute) === value;
  });
};

export const getDistinctApplicationFilterOptions = (
  applications: Application[],
  attribute: Attribute,
  priorFilters: Array<{ attributeId: string; value: string }>,
  attributesById: Map<string, Attribute>
): string[] => {
  const pool =
    priorFilters.length === 0
      ? applications
      : applications.filter((app) =>
          applicationMatchesFilters(app, priorFilters, attributesById)
        );

  const values = new Set<string>();
  pool.forEach((app) => {
    const display = getApplicationAttributeDisplayValue(app, attribute);
    if (display && display !== "-") values.add(display);
  });

  return Array.from(values).sort((a, b) => a.localeCompare(b, "es"));
};
