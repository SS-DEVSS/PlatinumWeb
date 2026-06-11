import { Attribute } from "../models/category";

export type VehicleFilterSelection = { attributeId: string; value: string };

export function isWebFilterRequired(attribute: Attribute): boolean {
  return attribute.filterRequired !== false;
}

export function sortFilterAttributes(attributes: Attribute[]): Attribute[] {
  return [...attributes].sort((a, b) => (a.order || 0) - (b.order || 0));
}

export function allRequiredFiltersSelected(
  filterAttributes: Attribute[],
  selectedFilters: VehicleFilterSelection[]
): boolean {
  const requiredAttributes = filterAttributes.filter(isWebFilterRequired);
  if (requiredAttributes.length === 0) return true;

  const valueById = new Map(selectedFilters.map((filter) => [filter.attributeId, filter.value]));
  return requiredAttributes.every((attribute) => {
    const value = valueById.get(attribute.id);
    return value !== undefined && value !== "";
  });
}

export function isFilterAttributeEnabled(
  attribute: Attribute,
  filterAttributes: Attribute[],
  selectedFilters: VehicleFilterSelection[]
): boolean {
  if (isWebFilterRequired(attribute)) {
    const requiredBefore = filterAttributes.filter(
      (item) => isWebFilterRequired(item) && item.order < attribute.order
    );
    const valueById = new Map(selectedFilters.map((filter) => [filter.attributeId, filter.value]));
    return requiredBefore.every((item) => {
      const value = valueById.get(item.id);
      return value !== undefined && value !== "";
    });
  }

  return allRequiredFiltersSelected(filterAttributes, selectedFilters);
}

export function buildAttributeStatesFromFilters(
  filterAttributes: Attribute[],
  selectedFilters: VehicleFilterSelection[]
): Record<string, { open: boolean; selectedValue: string; disabled: boolean }> {
  const valueById = new Map(selectedFilters.map((filter) => [filter.attributeId, filter.value]));

  return filterAttributes.reduce<
    Record<string, { open: boolean; selectedValue: string; disabled: boolean }>
  >((acc, attribute) => {
    acc[attribute.id] = {
      open: false,
      selectedValue: valueById.get(attribute.id) ?? "",
      disabled: !isFilterAttributeEnabled(attribute, filterAttributes, selectedFilters),
    };
    return acc;
  }, {});
}

export function applyFilterSelection(
  filterAttributes: Attribute[],
  selectedFilters: VehicleFilterSelection[],
  attributeId: string,
  value: string
): VehicleFilterSelection[] {
  const target = filterAttributes.find((attribute) => attribute.id === attributeId);
  if (!target) return selectedFilters;

  const preserved = selectedFilters.filter((filter) => {
    const attribute = filterAttributes.find((item) => item.id === filter.attributeId);
    return attribute !== undefined && attribute.order < target.order;
  });

  if (!value) {
    return preserved;
  }

  return [...preserved, { attributeId, value }];
}

export function removeFilterAndAfter(
  filterAttributes: Attribute[],
  selectedFilters: VehicleFilterSelection[],
  attributeId: string
): VehicleFilterSelection[] {
  const target = filterAttributes.find((attribute) => attribute.id === attributeId);
  if (!target) return selectedFilters;

  return selectedFilters.filter((filter) => {
    const attribute = filterAttributes.find((item) => item.id === filter.attributeId);
    return attribute !== undefined && attribute.order < target.order;
  });
}
