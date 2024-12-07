import { Attribute, Category } from "../models/category";
import { Item, Variant } from "../models/item";
import { Card, CardHeader, CardTitle } from "./ui/card";

interface ProductAttributesProps {
  selectedProduct: Item;
  selectedVariant: Variant;
  category: Category;
}

export const ProductAttributes = ({
  selectedProduct,
  selectedVariant,
  category,
}: ProductAttributesProps) => {
  const renderAttributes = (attributes: Attribute[], values: any[]) => {
    return attributes.map((attribute) => {
      const valueObj = values.find((val) => val.idAttribute === attribute.id);
      const displayValue =
        valueObj?.valueString ||
        valueObj?.valueNumber ||
        valueObj?.valueBoolean ||
        valueObj?.valueDate ||
        "No value";

      return (
        <div
          key={attribute.id}
          className={`flex gap-3 py-3 ${
            attributes.indexOf(attribute) % 2 === 0
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
              <p>{selectedVariant.name}</p>
            </div>
            <div
              className={`flex gap-3 py-3 px-4 bg-[#f5f5f5] last:rounded-b-lg`}
            >
              <p className="font-bold">SKU:</p>
              <p>{selectedVariant.sku}</p>
            </div>
            {renderAttributes(
              category.attributes!.product!,
              selectedProduct.attributeValues
            )}
          </section>
        </Card>
      )}

      {selectedVariant?.attributeValues.length! > 0 && (
        <Card className="mt-4 border-none shadow-md">
          <CardHeader className="bg-[#444] text-white text-[15px] rounded-t-lg p-3 px-4 uppercase">
            <CardTitle className="text-lg">Atributos</CardTitle>
          </CardHeader>
          <section>
            {renderAttributes(
              category.attributes!.variant!,
              selectedVariant?.attributeValues
            )}
          </section>
        </Card>
      )}
    </>
  );
};
