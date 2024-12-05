import PlatinumLayout from "../../Layouts/PlatinumLayout";
import { useNavigate, useParams } from "react-router-dom";
import { MoveLeft, Share2, Download } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../components/ui/accordion";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardTitle,
  CardHeader,
} from "../../components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../components/ui/carousel";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import ProductsTable from "../../components/ProductsTable";
import { useEffect, useState } from "react";
import { useProducts } from "../../hooks/useProducts";
import { AttributeValue, Item, KitItem, Variant } from "../../models/item";
import { useItemContext } from "../../context/Item-context";
import { Attribute, Category } from "../../models/category";
import { useCategories } from "../../hooks/useCategories";
import { TechnicalSheet } from "../../models/techincalSheet";
import { ProductAttributes } from "../../components/ProductAttributes";

const ProductDetail = () => {
  const navigate = useNavigate();
  let { itemId } = useParams();

  const { type } = useItemContext();
  const { getProductById } = useProducts();
  const { getCategoryById } = useCategories();

  const [category, setCategory] = useState<Category | null>(null);
  const [item, setItem] = useState<Item | null>(null);
  const [itemVariant, setItemVariant] = useState<Variant | null>(null);
  const [mappedProductComponents, setMappedProductComponents] = useState<
    Array<any>
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      if (itemId) {
        const data = await getProductById(itemId);
        setItem(data);
        if (data.variants && data.variants.length > 0) {
          setItemVariant(data.variants[0]);
        }
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (item) {
      const fetchCategory = async () => {
        const data = await getCategoryById(item?.category.id);
        setCategory(data);
      };
      fetchCategory();
    }
  }, [item]);

  useEffect(() => {
    if (!itemVariant?.kitItems) return;

    const fetchMappedKitItems = async () => {
      try {
        const mappedComponents = await Promise.all(
          itemVariant.kitItems!.map(async (kitItem: KitItem) => {
            const parentProduct: Item = await getProductById(kitItem.idProduct);
            if (!parentProduct) {
              console.log(
                `Parent product not found for kit item ${kitItem.id}`
              );
              return null;
            }

            const categoryParentProduct: Category | undefined =
              await getCategoryById(parentProduct.category.id);

            if (
              !categoryParentProduct ||
              !categoryParentProduct.attributes?.variant
            ) {
              console.log(
                `Category or attributes missing for product ${parentProduct.id}`
              );
              return null;
            }

            const mappedAttributes =
              categoryParentProduct.attributes.product?.map(
                (attribute: Attribute) => {
                  const matchingAttributeValue =
                    parentProduct.attributeValues.find(
                      (attrValue: AttributeValue) =>
                        attrValue.idAttribute === attribute.id
                    );

                  return {
                    attributeName: attribute.name,
                    attributeValue:
                      matchingAttributeValue?.valueString ??
                      matchingAttributeValue?.valueNumber ??
                      matchingAttributeValue?.valueBoolean ??
                      matchingAttributeValue?.valueDate ??
                      "N/A",
                  };
                }
              );

            const matchingProduct = parentProduct.variants?.find(
              (variant: Variant) => variant.id === kitItem.id
            );

            const mappedAttributesVariant =
              categoryParentProduct.attributes.variant.map(
                (attribute: Attribute) => {
                  const matchingAttributeVariantValue =
                    matchingProduct?.attributeValues.find(
                      (attributeValue: AttributeValue) =>
                        attributeValue.idAttribute === attribute.id
                    );
                  return {
                    attributeName: attribute.name,
                    attributeValue:
                      matchingAttributeVariantValue?.valueString ||
                      matchingAttributeVariantValue?.valueNumber ||
                      matchingAttributeVariantValue?.valueBoolean ||
                      matchingAttributeVariantValue?.valueDate,
                  };
                }
              );

            return {
              kitItemName: kitItem.name,
              kitItemSku: kitItem.sku,
              kitItemPrice: kitItem.price,
              attributes: [mappedAttributes, mappedAttributesVariant],
            };
          })
        );

        setMappedProductComponents(mappedComponents.filter(Boolean));
        console.log(mappedComponents);
      } catch (error) {
        console.error("Error fetching kit items", error);
      }
    };

    fetchMappedKitItems();
  }, [itemVariant]);

  // console.log(itemVariant?.id);
  // console.log(mappedProductComponents);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(
      () => {
        alert("Page link copied to clipboard!");
      },
      (err) => {
        console.error("Failed to copy the link: ", err);
      }
    );
  };

  return (
    <PlatinumLayout>
      <div className="bg-[#E4E4E4] px-6 xl:px-20 py-8 flex flex-col md:flex-row gap-4 lg:gap-12">
        <section className="basis-1/2">
          <div className="flex justify-between items-center">
            <Button
              onClick={() => navigate(`/Catalogo`)}
              variant={"ghost"}
              className="flex gap-3 border border-black rounded-full py-2 px-7"
            >
              <MoveLeft />
              <p>Regresar</p>
            </Button>
            <Button
              variant={"ghost"}
              onClick={handleCopyLink}
              className="flex gap-4 hover:underline hover:cursor-pointer"
            >
              <Share2 className="rotate-180 fill-black" />
              <p>Compartir aplicación</p>
            </Button>
          </div>
          <section className="flex justify-between mt-6">
            <div>
              <p className="font-bold">Número de Parte</p>
              <h4 className="text-xl font-semibold text-naranja py-2">
                {item?.name}
              </h4>
            </div>
            <div className="bg-black text-white font-semibold rounded-full px-8 h-10 flex flex-col justify-center">
              {item?.category.name}
            </div>
          </section>
          <p className="font-bold">Referencias:</p>
          <div className="flex flex-wrap gap-2 py-4">
            {item?.references.map((reference: any) => (
              <div
                key={reference}
                className="bg-gris_oscuro text-white rounded-full px-8 py-1"
              >
                {reference}
              </div>
            ))}
          </div>
          {itemVariant?.images.length! > 0 && (
            <Card className="px-16">
              <Carousel className="w-full">
                <CarouselContent>
                  {itemVariant?.images.map((image, index) => (
                    <CarouselItem key={index}>
                      <div className="p-1">
                        <Card className="border-none shadow-none">
                          <CardContent className="flex aspect-square items-center justify-center p-6">
                            <img src={image.url} />
                          </CardContent>
                        </Card>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </Card>
          )}
        </section>

        <section className="basis-1/2">
          <Tabs defaultValue="details">
            <TabsList
              className={`${
                type === "KIT" ? "grid-cols-3" : "grid-cols-2"
              } grid w-full 2xl:w-[60%]`}
            >
              <TabsTrigger value="details">Detalles</TabsTrigger>
              <TabsTrigger value="compatibilidades">
                Compatibilidades
              </TabsTrigger>
              {type === "KIT" && (
                <TabsTrigger value="componentes">Componentes</TabsTrigger>
              )}
            </TabsList>
            <TabsContent value="details">
              {category && item && itemVariant && (
                <ProductAttributes
                  selectedProduct={item}
                  selectedVariant={itemVariant}
                  category={category}
                />
              )}

              {itemVariant?.notes && (
                <Card className="mt-4 border-none shadow-md">
                  <CardHeader className="bg-[#444] text-white text-[15px] rounded-t-lg p-3 px-4 uppercase">
                    <CardTitle className="text-lg">Notas</CardTitle>
                  </CardHeader>
                  <section>
                    {itemVariant.notes.map((note, index) => (
                      <div key={index}>
                        <div
                          className={`${
                            index % 2 === 0 ? "bg-white" : "bg-[#f5f5f5]"
                          } px-4 flex gap-3 py-3 last:rounded-b-lg`}
                        >
                          <p>{note.note}</p>
                        </div>
                      </div>
                    ))}
                  </section>
                </Card>
              )}

              {itemVariant?.technicalSheets && (
                <Card className="mt-4 border-none shadow-md">
                  <CardHeader className="bg-[#444] text-white text-[15px] rounded-t-lg p-3 px-4 uppercase">
                    <CardTitle className="text-lg">Documentos</CardTitle>
                  </CardHeader>
                  <section className="flex flex-wrap gap-3 p-4">
                    {itemVariant.technicalSheets.map(
                      (sheet: TechnicalSheet) => (
                        <a
                          href={sheet.url}
                          key={sheet.id}
                          target="_blank"
                          download
                        >
                          <div className="rounded-lg text-white px-5 py-3 bg-black flex gap-3 hover:cursor-pointer">
                            <Download className="w-5" />
                            {sheet.title}
                          </div>
                        </a>
                      )
                    )}
                  </section>
                </Card>
              )}
            </TabsContent>
            <TabsContent value="compatibilidades">
              <ProductsTable
                category={category}
                data={item?.variants}
                itemVariant={itemVariant}
                setItemVariant={setItemVariant}
              />
            </TabsContent>
            <TabsContent value="componentes">
              {itemVariant?.kitItems?.map((component) => (
                <Accordion
                  type="single"
                  collapsible
                  className="w-full rounded-lg bg-white mb-2"
                >
                  <AccordionItem value="item-1">
                    <AccordionTrigger>
                      <p>{component?.name}</p>
                    </AccordionTrigger>
                    <AccordionContent className="pb-0">
                      {mappedProductComponents?.map((component) => {
                        return component.attributes.map((attributeArray: any) =>
                          attributeArray.map(
                            (attribute: any, index: number) => (
                              <div
                                key={index}
                                className={`flex gap-3 py-3 ${
                                  component.attributes.indexOf(attribute) %
                                    2 ===
                                  0
                                    ? "bg-white"
                                    : "bg-[#f5f5f5]"
                                } px-4 last:rounded-b-lg`}
                              >
                                <p className="font-bold">
                                  {attribute.attributeName}:
                                </p>
                                <p>{attribute.attributeValue}</p>
                              </div>
                            )
                          )
                        );
                      })}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ))}
            </TabsContent>
          </Tabs>
        </section>
      </div>
    </PlatinumLayout>
  );
};

export default ProductDetail;
