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
  if (dateValue == null) return null;

  const trimmed = String(dateValue).trim();
  if (/^\d{4}$/.test(trimmed)) {
    const year = Number(trimmed);
    return Number.isNaN(year) ? null : year;
  }

  try {
    const date = dateValue instanceof Date ? dateValue : new Date(trimmed);
    if (!Number.isNaN(date.getTime())) return date.getUTCFullYear();
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

const isPlausibleYear = (value: number): boolean =>
  Number.isInteger(value) && value >= 1900 && value <= 2100;

export const normalizeFilterOptionDisplayValue = (
  value: string | number | boolean,
  attribute: Attribute
): string => {
  const asString = String(value).trim();
  const yearAttribute = isYearAttribute(attribute);

  if (yearAttribute) {
    const yearFromDate = extractYearFromDate(asString);
    if (yearFromDate !== null) return String(yearFromDate);

    const numericYear = Number(asString);
    if (!Number.isNaN(numericYear) && isPlausibleYear(numericYear)) {
      return String(numericYear);
    }
  }

  return asString;
};

export const sortFilterOptionValues = (
  values: Array<string | number | boolean>,
  attribute: Attribute
): string[] => {
  const normalized = values.map((value) => normalizeFilterOptionDisplayValue(value, attribute));
  const uniqueValues = Array.from(new Set(normalized));

  if (isYearAttribute(attribute)) {
    return uniqueValues.sort((left, right) => Number(left) - Number(right));
  }

  return uniqueValues.sort((left, right) =>
    left.localeCompare(right, undefined, { numeric: true })
  );
};

export const dedupeFilterOptionValues = (
  values: Array<string | number | boolean>,
  attribute: Attribute
): string[] => sortFilterOptionValues(values, attribute);

export const getApplicationAttributeDisplayValue = (
  application: Application,
  attribute: Attribute
): string => {
  const attrValue = application.attributeValues.find(
    (av: AttributeValue) => av.idAttribute === attribute.id
  );

  if (isYearAttribute(attribute)) {
    if (attrValue?.valueDate) return formatDateValue(attrValue.valueDate);
    if (attrValue?.valueNumber != null && isPlausibleYear(Number(attrValue.valueNumber))) {
      return String(attrValue.valueNumber);
    }
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

  return sortFilterOptionValues(Array.from(values), attribute);
};
