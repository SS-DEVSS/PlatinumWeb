import PlatinumLayout from "../../Layouts/PlatinumLayout";
import { MoveLeft, Share2 } from "lucide-react";
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
import { useNavigate } from "react-router-dom";

const ProductDetail = () => {
  const navigate = useNavigate();

  const category = {
    id: "d406c4aa-9932-407d-aee6-b8eff8f26b45",
    name: "Engines",
    description: "",
    imgUrl: "https://myimage.com/1",
    brands: [
      {
        name: "Platinum Driveline",
        id: "b512a2eb-f326-4b78-8d9e-17d60de5955c",
        logoImgUrl: "https://www.platinumdriveline.mx/LOGOPlatinum.png",
      },
    ],
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
    name: "Mazda Engine",
    description: "My product descriptionn here",
    notes: "No notes to add for this product",
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
    ],
  };

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

  return (
    <PlatinumLayout>
      <div className="bg-[#E4E4E4] px-20 py-8 flex gap-12">
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
            <div className="flex gap-4 hover:underline hover:cursor-pointer">
              <Share2 className="rotate-180 fill-black" />
              <p>Compartir aplicación</p>
            </div>
          </div>
          <section className="flex justify-between mt-6">
            <div>
              <p className="font-bold">Número de Parte</p>
              <h4 className="text-xl font-semibold text-naranja py-2">
                GM09-215CVL-02
              </h4>
            </div>
            <div className="bg-black text-white font-semibold rounded-full px-8 h-10 flex flex-col justify-center">
              {product.category.name}
            </div>
          </section>
          <p className="font-bold">Referencias:</p>
          <div className="flex gap-2 py-4">
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
          <Card>
            <CardHeader className="bg-[#333333] text-white text-[15px] rounded-t-lg p-3 px-4 uppercase">
              <CardTitle className="text-lg">Características</CardTitle>
            </CardHeader>
            <section>
              {mappedCategoryAttributes.map((attr, index) => (
                <>
                  <div key={index} className="px-4 flex gap-3 py-3">
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
            <Card key={variant.id} className="mt-4">
              <CardHeader className="bg-[#444] text-white text-[15px] rounded-t-lg p-3 px-4 uppercase">
                <CardTitle className="text-lg">Attributes</CardTitle>
              </CardHeader>
              <section>
                {variant.attributes.map((attr, index) => (
                  <>
                    <div key={index} className="px-4 flex gap-3 py-3">
                      <p className="font-bold">{attr.name}:</p>
                      <p>{attr.value}</p>
                    </div>
                    {index !== variant.attributes.length - 1 && <Separator />}
                  </>
                ))}
              </section>
            </Card>
          ))}
        </section>
      </div>
    </PlatinumLayout>
  );
};

export default ProductDetail;
