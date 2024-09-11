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
import { Separator } from "../../components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import ProductsTable from "../../components/ProductsTable";
import { useEffect } from "react";
import { useProducts } from "../../hooks/useProducts";

const ProductDetail = () => {
  const { getProductById } = useProducts();
  const navigate = useNavigate();
  let { productId } = useParams();

  console.log(productId);

  useEffect(() => {
    if (productId) {
      getProductById(productId);
    }
  }, []);

  // console.log(productId);

  const category = {
    id: "d406c4aa-9932-407d-aee6-b8eff8f26b45",
    name: "Engines",
    categoryAttributes: [
      {
        id: "b7e6217d-623b-4caa-bd01-ba170cebe9c3",
        name: "Material",
        required: true,
        type: "string",
      },
    ],
    variantAttributes: [
      {
        id: "2d85835e-b098-44e9-80e3-1bd79d68721e",
        name: "Model",
        required: true,
        type: "string",
      },
      {
        id: "3ce97fdf-d1d1-4c68-aa8c-334375d6a4d3",
        name: "Year",
        required: true,
        type: "number",
      },
    ],
  };

  const product = {
    id: "cc90d152-37d9-4e0a-b58c-7827f141a5fc",
    name: "GM09-215CVL-02",
    notes: [
      "No notes to add for this product",
      "No notes to add for this product",
    ],
    tecnicalSheet: [
      {
        id: "asdasd",
        title: "Boletín Corsa A1, A2, A3",
        documentUrl: "asdasd",
      },
      {
        id: "asdasd",
        title: "Boletín Corsa A1, A2, A3",
        documentUrl: "asdasd",
      },
    ],
    category: {
      id: "d406c4aa-9932-407d-aee6-b8eff8f26b45",
      name: "Engines",
    },
    references: ["21983", "23749", "78234", "78291"],
    productCategoryAttributes: [
      {
        id: "29f20faa-7c04-4010-9660-e77d3aa16e52",
        valueString: "Stainless Steel",
        valueNumber: null,
        valueBoolean: null,
        valueDate: null,
        idCategoryAttribute: "b7e6217d-623b-4caa-bd01-ba170cebe9c3",
      },
    ],
    productVariants: [
      {
        id: "2a944034-f979-44e1-bcf1-cba86715447a",
        name: "ENGINE001",
        sku: "ENG001",
        price: 123,
        stockQuantity: 5,
        variantAttributes: [
          {
            id: "dbb60405-6a40-4c09-9994-f9997acf0bff",
            valueString: "Mazda 2",
            valueNumber: null,
            valueBoolean: null,
            valueDate: null,
            idVariantAttribute: "2d85835e-b098-44e9-80e3-1bd79d68721e",
          },
          {
            id: "2bb9dfc1-4571-4d83-984a-ea813b85fbf7",
            valueString: null,
            valueNumber: 2024,
            valueBoolean: null,
            valueDate: null,
            idVariantAttribute: "3ce97fdf-d1d1-4c68-aa8c-334375d6a4d3",
          },
        ],
      },
      {
        id: "66687cab-1add-4405-8ce1-f25c569422ae",
        name: "ENGINE002",
        sku: "ENG002",
        price: 123,
        stockQuantity: 5,
        variantAttributes: [
          {
            id: "6e596844-4f70-4521-800b-e9e12309a59c",
            valueString: "Mazda 3",
            valueNumber: null,
            valueBoolean: null,
            valueDate: null,
            idVariantAttribute: "2d85835e-b098-44e9-80e3-1bd79d68721e",
          },
          {
            id: "e4e6fc1a-c543-4c8f-b1cc-22629aaa9728",
            valueString: null,
            valueNumber: 2024,
            valueBoolean: null,
            valueDate: null,
            idVariantAttribute: "3ce97fdf-d1d1-4c68-aa8c-334375d6a4d3",
          },
        ],
      },
    ],
  };

  const kit = {
    name: "Mazda Engine Kit",
    notes: "No notes to add for this kit",
    category: {
      id: "d406c4aa-9932-407d-aee6-b8eff8f26b45",
      name: "Engines",
    },
    references: ["78291", "78234", "23749", "21983"],
    kitCategoryAttributes: [
      {
        id: "16d523e0-dfbc-4859-9ae6-34b97f08ee2c",
        valueString: "Stainless Steel",
        valueNumber: null,
        valueBoolean: null,
        valueDate: null,
        idCategoryAttribute: "b7e6217d-623b-4caa-bd01-ba170cebe9c3",
      },
    ],
    kitVariants: [
      {
        id: "5aaae828-bedd-4234-adcb-e18e6d6ff0c2",
        name: "ENGINE001",
        sku: "ENG001",
        price: 123,
        stockQuantity: 5,
        variantAttributes: [
          {
            id: "051938a5-d14c-46ac-a288-6eb17bf70b68",
            valueString: null,
            valueNumber: 2024,
            valueBoolean: null,
            valueDate: null,
          },
          {
            id: "658b9ddc-0a44-4885-994c-c961a8ec1af5",
            valueString: "Mazda 2",
            valueNumber: null,
            valueBoolean: null,
            valueDate: null,
          },
        ],
        productVariants: [
          {
            id: "2a944034-f979-44e1-bcf1-cba86715447a",
            name: "ENGINE001",
            sku: "ENG001",
          },
        ],
      },
      {
        id: "4aa579af-f09d-4f2f-81d8-07fec659e7ba",
        name: "ENGINE002",
        sku: "ENG002",
        price: 123,
        stockQuantity: 5,
        variantAttributes: [
          {
            id: "7fe217fb-f3ba-43df-b8bd-17c372bfcf1e",
            valueString: null,
            valueNumber: 2024,
            valueBoolean: null,
            valueDate: null,
          },
          {
            id: "f21caf4b-3f36-47d2-b450-83da72d30aad",
            valueString: "Mazda 3",
            valueNumber: null,
            valueBoolean: null,
            valueDate: null,
          },
        ],
        productVariants: [
          {
            id: "66687cab-1add-4405-8ce1-f25c569422ae",
            name: "ENGINE002",
            sku: "ENG002",
          },
        ],
      },
    ],
  };

  const mappedKitProductsVariant = kit.kitVariants.flatMap((variant) =>
    variant.productVariants
      .map((productMatch) => {
        const matchingProduct = product.productVariants.find(
          (proMatch) => proMatch.id === productMatch.id
        );
        return matchingProduct ? { matchingProduct } : null;
      })
      .filter((item) => item !== null)
  );

  const mappedCategoryAttributes = category.categoryAttributes.map(
    (catAttr) => {
      const matchingProductAttr = product.productCategoryAttributes.find(
        (prodAttr) => prodAttr.idCategoryAttribute === catAttr.id
      );
      return {
        name: catAttr.name,
        value:
          matchingProductAttr?.valueString ||
          matchingProductAttr?.valueNumber ||
          matchingProductAttr?.valueBoolean ||
          matchingProductAttr?.valueDate ||
          "N/A",
      };
    }
  );

  const mappedVariants = product.productVariants.map((variant) => {
    const variantAttributes = category.variantAttributes.map((varAttr) => {
      const matchingVarAttr = variant.variantAttributes.find(
        (prodVarAttr) => prodVarAttr.idVariantAttribute === varAttr.id
      );
      return {
        name: varAttr.name,
        value:
          matchingVarAttr?.valueString ||
          matchingVarAttr?.valueNumber ||
          matchingVarAttr?.valueBoolean ||
          matchingVarAttr?.valueDate ||
          "N/A",
      };
    });

    return {
      ...variant,
      attributes: variantAttributes,
    };
  });

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

  console.log(mappedKitProductsVariant);

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
                {product.name}
              </h4>
            </div>
            <div className="bg-black text-white font-semibold rounded-full px-8 h-10 flex flex-col justify-center">
              {product.category.name}
            </div>
          </section>
          <p className="font-bold">Referencias:</p>
          <div className="flex flex-wrap gap-2 py-4">
            {product.references.map((reference) => (
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
                  {mappedCategoryAttributes.map((attr, index) => (
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
                  ))}
                </section>
              </Card>

              {mappedVariants.map((variant) => (
                <Card key={variant.id} className="mt-4 border-none shadow-md">
                  <CardHeader className="bg-[#444] text-white text-[15px] rounded-t-lg p-3 px-4 uppercase">
                    <CardTitle className="text-lg">Atributos</CardTitle>
                  </CardHeader>
                  <section>
                    {variant.attributes.map((attr, index) => (
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
                    ))}
                  </section>
                </Card>
              ))}

              {product.notes && (
                <Card className="mt-4 border-none shadow-md">
                  <CardHeader className="bg-[#444] text-white text-[15px] rounded-t-lg p-3 px-4 uppercase">
                    <CardTitle className="text-lg">Notas</CardTitle>
                  </CardHeader>
                  <section>
                    {product.notes.map((note, index) => (
                      <div key={index}>
                        <div
                          className={`${
                            index % 2 === 0 ? "bg-white" : "bg-[#d7d7d7]"
                          } px-4 flex gap-3 py-3 last:rounded-b-lg`}
                        >
                          <p>{note}</p>
                        </div>
                        {index !== product.notes.length - 1 && <Separator />}
                      </div>
                    ))}
                  </section>
                </Card>
              )}
              {product.tecnicalSheet && (
                <Card className="mt-4 border-none shadow-md">
                  <CardHeader className="bg-[#444] text-white text-[15px] rounded-t-lg p-3 px-4 uppercase">
                    <CardTitle className="text-lg">Documentos</CardTitle>
                  </CardHeader>
                  <section className="flex flex-wrap gap-3 p-4">
                    {product.tecnicalSheet.map((sheet, index) => (
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
              )}
            </TabsContent>
            <TabsContent value="compatibilidades">
              <ProductsTable data={null} />
            </TabsContent>
            <TabsContent value="componentes">
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
                        (attribute) => attribute.id
                      )}
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
