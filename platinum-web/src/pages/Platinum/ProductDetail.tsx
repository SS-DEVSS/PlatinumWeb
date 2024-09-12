import PlatinumLayout from "../../Layouts/PlatinumLayout";
import { useNavigate, useParams } from "react-router-dom";
import { MoveLeft, Share2, Download } from "lucide-react";
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "../../components/ui/accordion";
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
import { Separator } from "../../components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import ProductsTable from "../../components/ProductsTable";
import { useEffect, useState } from "react";
import { useProducts } from "../../hooks/useProducts";
import { Item } from "../../models/item";
import { Reference } from "../../models/reference";
import { useItemContext } from "../../context/Item-context";

const ProductDetail = () => {
  const { type } = useItemContext();
  const { getProductById, getKitById } = useProducts();

  const navigate = useNavigate();
  let { itemId } = useParams();

  const [item, setItem] = useState<Item | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (itemId) {
        if (type === "kit") {
          const data = await getKitById(itemId);
          setItem(data);
          console.log("kit", data);
        } else {
          const data = await getProductById(itemId);
          setItem(data);
          console.log("product", data);
        }
      }
    };
    fetchData();
  }, []);

  // const mappedKitProductsVariant = kit.kitVariants.flatMap((variant) =>
  //   variant.productVariants
  //     .map((productMatch) => {
  //       const matchingProduct = product?.variants?.find(
  //         (proMatch) => proMatch.id === productMatch.id
  //       );
  //       return matchingProduct ? { matchingProduct } : null;
  //     })
  //     .filter((item) => item !== null)
  // );

  // const mappedCategoryAttributes = category.categoryAttributes.map(
  //   (catAttr: Attribute) => {
  //     const matchingProductAttr = product?.attributes?.find(
  //       (prodAttr) => prodAttr.idCategoryAttribute === catAttr.id
  //     );
  //     return {
  //       name: catAttr.name,
  //       value:
  //         matchingProductAttr?.valueString ||
  //         matchingProductAttr?.valueNumber ||
  //         matchingProductAttr?.valueBoolean ||
  //         matchingProductAttr?.valueDate ||
  //         "N/A",
  //     };
  //   }
  // );

  // const mappedVariants = product.productVariants.map((variant) => {
  //   const variantAttributes = category.variantAttributes.map((varAttr) => {
  //     const matchingVarAttr = variant.variantAttributes.find(
  //       (prodVarAttr) => prodVarAttr.idVariantAttribute === varAttr.id
  //     );
  //     return {
  //       name: varAttr.name,
  //       value:
  //         matchingVarAttr?.valueString ||
  //         matchingVarAttr?.valueNumber ||
  //         matchingVarAttr?.valueBoolean ||
  //         matchingVarAttr?.valueDate ||
  //         "N/A",
  //     };
  //   });

  //   return {
  //     ...variant,
  //     attributes: variantAttributes,
  //   };
  // });

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
          <Card className="px-16">
            <Carousel className="w-full">
              <CarouselContent>
                {Array.from({ length: 3 }).map((_, index) => (
                  <CarouselItem key={index}>
                    <div className="p-1">
                      <Card className="border-none">
                        <CardContent className="flex aspect-square items-center justify-center p-6">
                          <span className="text-4xl font-semibold">
                            {index + 1}
                          </span>
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
        </section>

        <section className="basis-1/2">
          <Tabs defaultValue="details">
            <TabsList className="grid grid-cols-3 w-full 2xl:w-[60%]">
              <TabsTrigger value="details">Detalles</TabsTrigger>
              <TabsTrigger value="compatibilidades">
                Compatibilidades
              </TabsTrigger>
              <TabsTrigger value="componentes">Componentes</TabsTrigger>
            </TabsList>
            <TabsContent value="details">
              <Card className="border-none shadow-md">
                <CardHeader className="bg-[#333333] text-white text-[15px] rounded-t-lg p-3 px-4 uppercase">
                  <CardTitle className="text-lg">Características</CardTitle>
                </CardHeader>
                <section>
                  {/* {mappedCategoryAttributes.map((attr, index) => (
                    <>
                      <div
                        key={index}
                        className={`${
                          index % 2 === 0 ? "bg-white" : "bg-[#d7d7d7]"
                        } px-4 flex gap-3 py-3 last:rounded-b-lg`}
                      >
                        <p className="font-bold">{attr.name}:</p>
                        <p>{attr.value}</p>
                      </div>
                      {index !== mappedCategoryAttributes.length - 1 && (
                        <Separator />
                      )}
                    </>
                  ))} */}
                </section>
              </Card>

              {/* {mappedVariants.map((variant) => (
                <Card key={variant.id} className="mt-4 border-none shadow-md">
                  <CardHeader className="bg-[#444] text-white text-[15px] rounded-t-lg p-3 px-4 uppercase">
                    <CardTitle className="text-lg">Atributos</CardTitle>
                  </CardHeader>
                  <section>
                    {variant.attributes.map(
                      (attr: Attribute, index: number) => (
                        <>
                          <div
                            key={index}
                            className={`${
                              index % 2 === 0 ? "bg-white" : "bg-[#d7d7d7]"
                            } px-4 flex gap-3 py-3 last:rounded-b-lg`}
                          >
                            <p className="font-bold">{attr.name}:</p>
                            <p>{attr.value}</p>
                          </div>
                          {index !== variant.attributes.length - 1 && (
                            <Separator />
                          )}
                        </>
                      )
                    )}
                  </section>
                </Card>
              ))} */}
              {/*
              {item?.notes && (
                <Card className="mt-4 border-none shadow-md">
                  <CardHeader className="bg-[#444] text-white text-[15px] rounded-t-lg p-3 px-4 uppercase">
                    <CardTitle className="text-lg">Notas</CardTitle>
                  </CardHeader>
                  <section>
                    {item.notes.map((note, index) => (
                      <div key={index}>
                        <div
                          className={`${
                            index % 2 === 0 ? "bg-white" : "bg-[#d7d7d7]"
                          } px-4 flex gap-3 py-3 last:rounded-b-lg`}
                        >
                          <p>{note.value}</p>
                        </div>
                        {index !== item.notes.length - 1 && <Separator />}
                      </div>
                    ))}
                  </section>
                </Card>
              )} */}

              {/* {product?.tecnicalSheet && (
                <Card className="mt-4 border-none shadow-md">
                  <CardHeader className="bg-[#444] text-white text-[15px] rounded-t-lg p-3 px-4 uppercase">
                    <CardTitle className="text-lg">Documentos</CardTitle>
                  </CardHeader>
                  <section className="flex flex-wrap gap-3 p-4">
                    {product.tecnicalSheet.map((sheet:Document, index:number) => (
                      <div
                        key={index}
                        className="rounded-lg text-white px-5 py-3 bg-black flex gap-3 hover:cursor-pointer"
                      >
                        <Download className="w-5" />
                        {sheet.title}
                      </div>
                    ))}
                  </section>
                </Card>
              )} */}
            </TabsContent>
            <TabsContent value="compatibilidades">
              <ProductsTable data={null} />
            </TabsContent>
            {/* <TabsContent value="componentes">
              {mappedKitProductsVariant.map((component) => (
                <Accordion
                  type="single"
                  collapsible
                  className="w-full rounded-lg bg-white mb-2"
                >
                  <AccordionItem value="item-1">
                    <AccordionTrigger>
                      <p>{component?.matchingProduct.name}</p>
                    </AccordionTrigger>
                    <AccordionContent>
                      {component?.matchingProduct.variantAttributes.map(
                        (attribute:Attribute) => attribute.id
                      )}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ))}
            </TabsContent> */}
          </Tabs>
        </section>
      </div>
    </PlatinumLayout>
  );
};

export default ProductDetail;
