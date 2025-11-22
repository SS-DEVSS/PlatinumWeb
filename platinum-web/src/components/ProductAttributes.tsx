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
  const renderAttributes = (attributes: Attribute[] | undefined, values: AttributeValue[], isLastSection: boolean = false) => {
    if (!attributes || attributes.length === 0) return null;

    return attributes.map((attribute, index) => {
      const valueObj = values.find((val) => val.idAttribute === attribute.id);
      const displayValue =
        valueObj?.valueString ||
        valueObj?.valueNumber?.toString() ||
        valueObj?.valueBoolean?.toString() ||
        valueObj?.valueDate?.toString() ||
        "No value";

      const isLastRow = isLastSection && index === attributes.length - 1;

      return (
        <TableRow
          key={attribute.id}
          className={`${index % 2 !== 0
            ? "bg-white"
            : "bg-[#f5f5f5]"
            }`}
        >
          <TableCell className={`font-bold w-1/3 ${isLastRow ? 'rounded-bl-lg' : ''}`}>{attribute.displayName || attribute.name}</TableCell>
          <TableCell className={isLastRow ? 'rounded-br-lg' : ''}>{displayValue}</TableCell>
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
        <Card className="border-none shadow-md rounded-lg overflow-hidden">
          <CardHeader className="bg-[#333333] text-white text-[15px] rounded-t-lg p-3 px-4 uppercase">
            <CardTitle className="text-lg">Características</CardTitle>
          </CardHeader>
          <section>
            <Table className="border-separate border-spacing-0">
              <TableBody>
                <TableRow className="bg-white">
                  <TableCell className="font-bold w-1/3 rounded-tl-lg">Nombre</TableCell>
                  <TableCell className="rounded-tr-lg">{selectedProduct.name}</TableCell>
                </TableRow>
                {selectedProduct.sku && (
                  <TableRow className="bg-[#f5f5f5]">
                    <TableCell className="font-bold w-1/3">SKU</TableCell>
                    <TableCell>{selectedProduct.sku}</TableCell>
                  </TableRow>
                )}
                {selectedVariant && selectedVariant.sku && (
                  <TableRow className="bg-[#f5f5f5]">
                    <TableCell className="font-bold w-1/3">SKU Variante</TableCell>
                    <TableCell>{selectedVariant.sku}</TableCell>
                  </TableRow>
                )}
                {selectedProduct.description && (
                  <TableRow className={selectedProduct.sku ? "bg-white" : "bg-[#f5f5f5]"}>
                    <TableCell className="font-bold w-1/3">Descripción</TableCell>
                    <TableCell>{selectedProduct.description}</TableCell>
                  </TableRow>
                )}
                {hasProductAttributes && (() => {
                  const productAttrs = category.attributes!.product!;
                  const hasMoreSections = hasVariantAttributes || hasReferenceAttributes || hasApplicationAttributes;
                  return renderAttributes(productAttrs, selectedProduct.attributeValues, !hasMoreSections);
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
                    <TableCell className="font-bold w-1/3">Marca de Referencia</TableCell>
                    <TableCell>{reference.referenceBrand}</TableCell>
                  </TableRow>
                )}
                <TableRow className={reference.referenceBrand ? 'bg-[#f5f5f5]' : 'bg-white'}>
                  <TableCell className="font-bold w-1/3">Número de Referencia</TableCell>
                  <TableCell>{reference.referenceNumber}</TableCell>
                </TableRow>
                {reference.typeOfPart && (
                  <TableRow className="bg-white">
                    <TableCell className="font-bold w-1/3">Tipo de Parte</TableCell>
                    <TableCell>{reference.typeOfPart}</TableCell>
                  </TableRow>
                )}
                {reference.type && (
                  <TableRow className={reference.typeOfPart ? 'bg-[#f5f5f5]' : 'bg-white'}>
                    <TableCell className="font-bold w-1/3">Tipo</TableCell>
                    <TableCell>{reference.type}</TableCell>
                  </TableRow>
                )}
                {reference.description && (
                  <TableRow className={reference.type ? 'bg-white' : 'bg-[#f5f5f5]'}>
                    <TableCell className="font-bold w-1/3">Descripción:</TableCell>
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
