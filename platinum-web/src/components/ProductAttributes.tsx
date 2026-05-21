import { REFERENCE_FIELD_LABELS } from "../constants/referenceFieldLabels";
import { Attribute, Category } from "../models/category";
import { Item, Variant, AttributeValue } from "../models/item";
import { Reference } from "../models/reference";
import { Application } from "../models/application";
import { Card, CardHeader, CardTitle } from "./ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "./ui/table";

interface ProductAttributesProps {
  selectedProduct: Item;
  selectedVariant: Variant | null;
  category: Category;
  reference?: Reference | null;
  applications?: Application[];
}

export const ProductAttributes = ({
  selectedProduct,
  selectedVariant,
  category,
  reference,
  applications = [],
}: ProductAttributesProps) => {
  const filterDetailAttributes = (attrs: Attribute[] | undefined) =>
    attrs?.filter(
      (attr) =>
        attr.name.toLowerCase() !== "descripción" &&
        attr.visibleInProductDetail !== false
    );

  const renderAttributes = (
    attributes: Attribute[] | undefined,
    values: AttributeValue[],
    isLastSection: boolean = false,
    roundTopCorners: boolean = false
  ) => {
    if (!attributes || attributes.length === 0) return null;

    const rows = attributes
      .map((attribute) => {
        const valueObj = values.find((val) => val.idAttribute === attribute.id);
        const displayValue =
          valueObj?.valueString ??
          (valueObj?.valueNumber != null ? String(valueObj.valueNumber) : undefined) ??
          (valueObj?.valueBoolean != null ? String(valueObj.valueBoolean) : undefined) ??
          (valueObj?.valueDate ? String(valueObj.valueDate) : undefined);

        if (displayValue == null || displayValue.trim() === "") return null;

        return { attribute, displayValue };
      })
      .filter((row): row is { attribute: Attribute; displayValue: string } => row !== null);

    return rows.map((row, index) => {
      const { attribute, displayValue } = row;
      const isLastRow = isLastSection && index === rows.length - 1;
      const isFirstRow = roundTopCorners && index === 0;

      return (
        <TableRow
          key={attribute.id}
          className={`${index % 2 !== 0 ? "bg-white" : "bg-[#f5f5f5]"}`}
        >
          <TableCell
            className={`font-bold w-1/3 ${isFirstRow ? "rounded-tl-lg" : ""} ${isLastRow ? "rounded-bl-lg" : ""}`}
          >
            {attribute.displayName || attribute.name}
          </TableCell>
          <TableCell className={`${isFirstRow ? "rounded-tr-lg" : ""} ${isLastRow ? "rounded-br-lg" : ""}`}>
            {displayValue}
          </TableCell>
        </TableRow>
      );
    });
  };

  const hasProductAttributes = category.attributes?.product && category.attributes.product.length > 0;
  const hasVariantAttributes = category.attributes?.variant && category.attributes.variant.length > 0 && selectedVariant && selectedVariant.attributeValues && selectedVariant.attributeValues.length > 0;
  const hasReferenceAttributes = category.attributes?.reference && category.attributes.reference.length > 0;
  const hasApplicationAttributes = category.attributes?.application && category.attributes.application.length > 0;

  return (
    <>
      {selectedProduct && (
        <Card className="border-none rounded-lg overflow-hidden">
          <CardHeader className="bg-[#20314f] text-white text-[15px] rounded-t-lg p-3 px-4 uppercase">
            <CardTitle className="text-lg">Características</CardTitle>
          </CardHeader>
          <section>
            <Table className="border-separate border-spacing-0">
              <TableBody>
                {selectedVariant && selectedVariant.sku && (
                  <TableRow className="bg-[#f5f5f5]">
                    <TableCell className="font-bold w-1/3">SKU Variante</TableCell>
                    <TableCell>{selectedVariant.sku}</TableCell>
                  </TableRow>
                )}
                {hasProductAttributes && (() => {
                  const productAttrs = filterDetailAttributes(category.attributes!.product) ?? [];
                  const hasMoreSections = hasVariantAttributes || hasReferenceAttributes || hasApplicationAttributes;
                  const isFirstSection = !selectedProduct.sku && !(selectedVariant?.sku);
                  return renderAttributes(
                    productAttrs,
                    selectedProduct.attributeValues,
                    !hasMoreSections,
                    isFirstSection
                  );
                })()}
              </TableBody>
            </Table>
          </section>
        </Card>
      )}

      {hasVariantAttributes && selectedVariant && (
        <Card className="mt-4 border-none shadow-md">
          <CardHeader className="bg-[#444] text-white text-[15px] rounded-t-lg p-3 px-4 uppercase">
            <CardTitle className="text-lg">Atributos de Variante</CardTitle>
          </CardHeader>
          <section>
            <Table>
              <TableBody>
                {renderAttributes(
                  category.attributes!.variant!,
                  selectedVariant.attributeValues || []
                )}
              </TableBody>
            </Table>
          </section>
        </Card>
      )}

      {hasReferenceAttributes && reference && reference.attributeValues && reference.attributeValues.length > 0 && (
        <Card className="mt-4 border-none shadow-md">
          <CardHeader className="bg-[#444] text-white text-[15px] rounded-t-lg p-3 px-4 uppercase">
            <CardTitle className="text-lg">Atributos de Referencia</CardTitle>
          </CardHeader>
          <section>
            <Table>
              <TableBody>
                {/* Display direct reference fields first */}
                {reference.referenceBrand && (
                  <TableRow className="bg-white">
                    <TableCell className="font-bold w-1/3">{REFERENCE_FIELD_LABELS.referenceBrand}</TableCell>
                    <TableCell>{reference.referenceBrand}</TableCell>
                  </TableRow>
                )}
                <TableRow className={reference.referenceBrand ? 'bg-[#f5f5f5]' : 'bg-white'}>
                  <TableCell className="font-bold w-1/3">{REFERENCE_FIELD_LABELS.referenceNumber}</TableCell>
                  <TableCell>{reference.referenceNumber}</TableCell>
                </TableRow>
                {reference.typeOfPart && (
                  <TableRow className="bg-white">
                    <TableCell className="font-bold w-1/3">{REFERENCE_FIELD_LABELS.typeOfPart}</TableCell>
                    <TableCell>{reference.typeOfPart}</TableCell>
                  </TableRow>
                )}
                {reference.type && (
                  <TableRow className={reference.typeOfPart ? 'bg-[#f5f5f5]' : 'bg-white'}>
                    <TableCell className="font-bold w-1/3">{REFERENCE_FIELD_LABELS.referenceType}</TableCell>
                    <TableCell>{reference.type}</TableCell>
                  </TableRow>
                )}
                {reference.description && (
                  <TableRow className={reference.type ? 'bg-white' : 'bg-[#f5f5f5]'}>
                    <TableCell className="font-bold w-1/3">{REFERENCE_FIELD_LABELS.description}:</TableCell>
                    <TableCell>{reference.description}</TableCell>
                  </TableRow>
                )}
                {/* Display custom reference attributes */}
                {renderAttributes(
                  category.attributes!.reference!,
                  reference.attributeValues || []
                )}
              </TableBody>
            </Table>
          </section>
        </Card>
      )}

      {hasApplicationAttributes && applications && applications.length > 0 && (
        <Card className="mt-4 border-none shadow-md">
          <CardHeader className="bg-[#444] text-white text-[15px] rounded-t-lg p-3 px-4 uppercase">
            <CardTitle className="text-lg">Aplicaciones</CardTitle>
          </CardHeader>
          <section>
            {applications.map((application, appIndex) => (
              <div key={application.id} className={appIndex > 0 ? "mt-4 border-t pt-4" : ""}>
                <Table>
                  <TableBody>
                    {application.origin && (
                      <TableRow className="bg-white">
                        <TableCell className="font-bold w-1/3">Origen:</TableCell>
                        <TableCell>{application.origin}</TableCell>
                      </TableRow>
                    )}
                    {renderAttributes(
                      category.attributes!.application!,
                      application.attributeValues || []
                    )}
                  </TableBody>
                </Table>
              </div>
            ))}
          </section>
        </Card>
      )}
    </>
  );
};
