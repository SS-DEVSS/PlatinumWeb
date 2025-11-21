import { Attribute, Category } from "../models/category";
import { Item, Variant, AttributeValue } from "../models/item";
import { Reference } from "../models/reference";
import { Application } from "../models/application";
import { Card, CardHeader, CardTitle } from "./ui/card";

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
  const renderAttributes = (attributes: Attribute[] | undefined, values: AttributeValue[]) => {
    if (!attributes || attributes.length === 0) return null;

    return attributes.map((attribute) => {
      const valueObj = values.find((val) => val.idAttribute === attribute.id);
      const displayValue =
        valueObj?.valueString ||
        valueObj?.valueNumber?.toString() ||
        valueObj?.valueBoolean?.toString() ||
        valueObj?.valueDate?.toString() ||
        "No value";

      return (
        <div
          key={attribute.id}
          className={`flex gap-3 py-3 ${attributes.indexOf(attribute) % 2 === 0
            ? "bg-white"
            : "bg-[#f5f5f5]"
            } px-4 last:rounded-b-lg`}
        >
          <p className="font-bold">{attribute.name}:</p>
          <p>{displayValue}</p>
        </div>
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
        <Card className="border-none shadow-md">
          <CardHeader className="bg-[#333333] text-white text-[15px] rounded-t-lg p-3 px-4 uppercase">
            <CardTitle className="text-lg">Características</CardTitle>
          </CardHeader>
          <section>
            <div className={`flex gap-3 py-3 px-4 last:rounded-b-lg`}>
              <p className="font-bold">Nombre:</p>
              <p>{selectedProduct.name}</p>
            </div>
            {selectedVariant && (
              <div
                className={`flex gap-3 py-3 px-4 bg-[#f5f5f5] last:rounded-b-lg`}
              >
                <p className="font-bold">SKU:</p>
                <p>{selectedVariant.sku}</p>
              </div>
            )}
            {hasProductAttributes && renderAttributes(
              category.attributes!.product!,
              selectedProduct.attributeValues
            )}
          </section>
        </Card>
      )}

      {hasVariantAttributes && selectedVariant && (
        <Card className="mt-4 border-none shadow-md">
          <CardHeader className="bg-[#444] text-white text-[15px] rounded-t-lg p-3 px-4 uppercase">
            <CardTitle className="text-lg">Atributos de Variante</CardTitle>
          </CardHeader>
          <section>
            {renderAttributes(
              category.attributes!.variant!,
              selectedVariant.attributeValues || []
            )}
          </section>
        </Card>
      )}

      {hasReferenceAttributes && reference && reference.attributeValues && reference.attributeValues.length > 0 && (
        <Card className="mt-4 border-none shadow-md">
          <CardHeader className="bg-[#444] text-white text-[15px] rounded-t-lg p-3 px-4 uppercase">
            <CardTitle className="text-lg">Atributos de Referencia</CardTitle>
          </CardHeader>
          <section>
            {/* Display direct reference fields first */}
            {reference.referenceBrand && (
              <div className="flex gap-3 py-3 px-4 bg-white">
                <p className="font-bold">Marca de Referencia:</p>
                <p>{reference.referenceBrand}</p>
              </div>
            )}
            <div className={`flex gap-3 py-3 px-4 ${reference.referenceBrand ? 'bg-[#f5f5f5]' : 'bg-white'}`}>
              <p className="font-bold">Número de Referencia:</p>
              <p>{reference.referenceNumber}</p>
            </div>
            {reference.typeOfPart && (
              <div className="flex gap-3 py-3 px-4 bg-white">
                <p className="font-bold">Tipo de Parte:</p>
                <p>{reference.typeOfPart}</p>
              </div>
            )}
            {reference.type && (
              <div className={`flex gap-3 py-3 px-4 ${reference.typeOfPart ? 'bg-[#f5f5f5]' : 'bg-white'}`}>
                <p className="font-bold">Tipo:</p>
                <p>{reference.type}</p>
              </div>
            )}
            {reference.description && (
              <div className={`flex gap-3 py-3 px-4 ${reference.type ? 'bg-white' : 'bg-[#f5f5f5]'}`}>
                <p className="font-bold">Descripción:</p>
                <p>{reference.description}</p>
              </div>
            )}
            {/* Display custom reference attributes */}
            {renderAttributes(
              category.attributes!.reference!,
              reference.attributeValues || []
            )}
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
                {application.origin && (
                  <div className="flex gap-3 py-3 px-4 bg-white">
                    <p className="font-bold">Origen:</p>
                    <p>{application.origin}</p>
                  </div>
                )}
                {renderAttributes(
                  category.attributes!.application!,
                  application.attributeValues || []
                )}
              </div>
            ))}
          </section>
        </Card>
      )}
    </>
  );
};
