import PlatinumLayout from "../../Layouts/PlatinumLayout";
import { useNavigate, useParams } from "react-router-dom";
import { MoveLeft, Share2, Download } from "lucide-react";
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
import ApplicationsTable from "../../components/ApplicationsTable";
import { useEffect, useState } from "react";
import { useProducts } from "../../hooks/useProducts";
import { Item } from "../../models/item";
import { Component } from "../../models/component";
import { Image as ProductImage } from "../../models/image";
import { useItemContext } from "../../context/Item-context";
import { Category } from "../../models/category";
import { useCategories } from "../../hooks/useCategories";
import { TechnicalSheet } from "../../models/techincalSheet";
import { ProductAttributes } from "../../components/ProductAttributes";
import { useToast } from "../../hooks/use-toast";
import SkeletonProductDetails from "../../skeletons/SkeletonProductDetails";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Reference } from "../../models/reference";

const ProductDetail = () => {
  const navigate = useNavigate();
  const { itemId } = useParams();

  const { type, setType } = useItemContext();
  const { getProductById, loading } = useProducts();
  const { getCategoryById } = useCategories();
  const { toast } = useToast();

  const [category, setCategory] = useState<Category | null>(null);
  const [item, setItem] = useState<Item | null>(null);
  const [selectedReference, setSelectedReference] = useState<Reference | null>(null);
  const [isReferenceDialogOpen, setIsReferenceDialogOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      if (itemId) {
        const data = await getProductById(itemId);
        setItem(data);
        // Set type from product data
        if (data.type) {
          setType(data.type);
          localStorage.setItem("type", data.type);
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

  // Components are now directly on the product, no need for complex fetching

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      variant: "success",
      description: "El enlace ha sido copiado exitosamente.",
    });
  };

  return (
    <PlatinumLayout>
      {loading ? (
        <SkeletonProductDetails />
      ) : (
        <div className="bg-[#E4E4E4] px-6 xl:px-20 py-8">
          {/* Top Section: Header Actions */}
          <div className="flex justify-between items-center mb-6">
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

          {/* Main Content: Image on Left, Details on Right */}
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 mb-8">
            {/* Left Section: Image */}
            <section className="w-full lg:w-1/3">
              {item?.variants && item.variants.length > 0 && item.variants[0].images && item.variants[0].images.length > 0 ? (
                <Card className="w-full">
                  <Carousel className="w-full">
                    <CarouselContent>
                      {item.variants[0].images.map((image: ProductImage, index: number) => (
                        <CarouselItem key={index}>
                          <div className="p-1">
                            <Card className="border-none shadow-none">
                              <CardContent className="flex aspect-square items-center justify-center p-6">
                                {image.url ? (
                                  <img src={image.url} alt={item.name} className="max-w-full max-h-full object-contain" />
                                ) : (
                                  <div className="flex flex-col items-center justify-center text-gray-400">
                                    <svg className="w-16 h-16 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <p className="text-sm">Sin imagen</p>
                                  </div>
                                )}
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
              ) : (
                <Card className="w-full">
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <svg className="w-16 h-16 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-sm">Sin imagen disponible</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </section>

            {/* Right Section: Product Info and Characteristics */}
            <section className="w-full lg:w-2/3 flex flex-col gap-4">
              {/* Product Info: Numero de Parte, Category, Referencias */}
              <div className="space-y-4 mb-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold text-md">Número de Parte</p>
                    <h4 className="text-3xl font-semibold text-naranja py-1">
                      {item?.sku || item?.name}
                    </h4>
                  </div>
                  <div className="bg-black text-white font-semibold rounded-full px-8 h-10 flex flex-col justify-center">
                    {item?.category.name}
                  </div>
                </div>

                <div>
                  <p className="font-bold mb-2 text-md">Referencias</p>
                  <div className="flex flex-wrap gap-2">
                    {item?.references && item.references.length > 0 ? (
                      item.references.map((reference, index) => {
                        if (typeof reference === 'string') {
                          return (
                            <div
                              key={`ref-string-${index}`}
                              className="bg-gris_oscuro text-white rounded-full px-8 py-1"
                            >
                              {reference}
                            </div>
                          );
                        }
                        return (
                          <button
                            key={reference.id || `ref-${index}`}
                            className="bg-gris_oscuro text-white rounded-full px-8 py-1 hover:bg-gris_oscuro/80 cursor-pointer transition-colors"
                            onClick={() => {
                              setSelectedReference(reference);
                              setIsReferenceDialogOpen(true);
                            }}
                          >
                            {reference.referenceNumber}
                          </button>
                        );
                      })
                    ) : (
                      <p className="text-gray-500 text-sm">No hay referencias disponibles</p>
                    )}
                  </div>
                </div>
              </div>

              <Dialog open={isReferenceDialogOpen} onOpenChange={setIsReferenceDialogOpen}>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Información de Referencia</DialogTitle>
                  </DialogHeader>
                  {selectedReference && (
                    <div className="space-y-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="font-semibold text-sm text-gray-600">Número de Referencia:</p>
                          <p className="text-base">{selectedReference.referenceNumber}</p>
                        </div>
                        {selectedReference.referenceBrand && (
                          <div>
                            <p className="font-semibold text-sm text-gray-600">Marca de Referencia:</p>
                            <p className="text-base">{selectedReference.referenceBrand}</p>
                          </div>
                        )}
                        {selectedReference.typeOfPart && (
                          <div>
                            <p className="font-semibold text-sm text-gray-600">Tipo de Parte:</p>
                            <p className="text-base">{selectedReference.typeOfPart}</p>
                          </div>
                        )}
                        {selectedReference.type && (
                          <div>
                            <p className="font-semibold text-sm text-gray-600">Tipo:</p>
                            <p className="text-base">{selectedReference.type}</p>
                          </div>
                        )}
                        {selectedReference.sku && (
                          <div>
                            <p className="font-semibold text-sm text-gray-600">SKU:</p>
                            <p className="text-base">{selectedReference.sku}</p>
                          </div>
                        )}
                      </div>
                      {selectedReference.description && (
                        <div>
                          <p className="font-semibold text-sm text-gray-600">Descripción:</p>
                          <p className="text-base">{selectedReference.description}</p>
                        </div>
                      )}
                      {selectedReference.attributeValues && selectedReference.attributeValues.length > 0 && category && (
                        <div>
                          <p className="font-semibold text-sm text-gray-600 mb-2">Atributos Adicionales:</p>
                          <div className="space-y-2">
                            {selectedReference.attributeValues.map((attrValue) => {
                              const attribute = category.attributes?.reference?.find(
                                (attr) => attr.id === attrValue.idAttribute
                              );
                              if (!attribute) return null;
                              const displayValue =
                                attrValue.valueString ||
                                attrValue.valueNumber?.toString() ||
                                attrValue.valueBoolean?.toString() ||
                                attrValue.valueDate?.toString() ||
                                "N/A";
                              return (
                                <div key={attrValue.id} className="flex gap-2">
                                  <span className="font-medium">{attribute.name}:</span>
                                  <span>{displayValue}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </DialogContent>
              </Dialog>

              {/* Characteristics Section */}
              {type === "KIT" ? (
                <Tabs defaultValue="componentes" className="mb-4">
                  <TabsList className="grid grid-cols-1 w-full">
                    <TabsTrigger value="componentes">Componentes</TabsTrigger>
                  </TabsList>
                  <TabsContent value="componentes">
                    {item?.components && item.components.length > 0 ? (
                      <Card className="border-none shadow-md">
                        <CardHeader className="bg-[#333333] text-white text-[15px] rounded-t-lg p-3 px-4 uppercase">
                          <CardTitle className="text-lg">Componentes del Kit</CardTitle>
                        </CardHeader>
                        <section>
                          {item.components.map((component: Component, index: number) => (
                            <div
                              key={component.id}
                              className={`flex gap-3 py-3 px-4 ${index % 2 === 0 ? "bg-white" : "bg-[#f5f5f5]"
                                } last:rounded-b-lg`}
                            >
                              <p className="font-bold">Componente:</p>
                              <p>{component.name}</p>
                            </div>
                          ))}
                        </section>
                      </Card>
                    ) : (
                      <Card className="border-none shadow-md">
                        <CardContent className="p-4">
                          <p className="text-gray-500">Este kit no tiene componentes asignados.</p>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>
                </Tabs>
              ) : null}

              {/* Product Characteristics - Always visible, no tabs */}
              {category && item && (
                <ProductAttributes
                  selectedProduct={item}
                  selectedVariant={item.variants && item.variants.length > 0 ? item.variants[0] : null}
                  category={category}
                  reference={item.references && item.references.length > 0 ? item.references[0] : undefined}
                  applications={[]}
                />
              )}

              {/* Display notes from first variant if available */}
              {item?.variants && item.variants.length > 0 && item.variants[0].notes && item.variants[0].notes.length > 0 && (
                <Card className="mt-4 border-none shadow-md">
                  <CardHeader className="bg-[#444] text-white text-[15px] rounded-t-lg p-3 px-4 uppercase">
                    <CardTitle className="text-lg">Notas</CardTitle>
                  </CardHeader>
                  <section>
                    {item.variants[0].notes.map((note, index) => (
                      <div key={index}>
                        <div
                          className={`${index % 2 === 0 ? "bg-white" : "bg-[#f5f5f5]"
                            } px-4 flex gap-3 py-3 last:rounded-b-lg`}
                        >
                          <p>{note.note}</p>
                        </div>
                      </div>
                    ))}
                  </section>
                </Card>
              )}

              {/* Display technical sheets from first variant if available */}
              {item?.variants && item.variants.length > 0 && item.variants[0].technicalSheets && item.variants[0].technicalSheets.length > 0 && (
                <Card className="mt-4 border-none shadow-md">
                  <CardHeader className="bg-[#444] text-white text-[15px] rounded-t-lg p-3 px-4 uppercase">
                    <CardTitle className="text-lg">Documentos</CardTitle>
                  </CardHeader>
                  <section className="flex flex-wrap gap-3 p-4">
                    {item.variants[0].technicalSheets.map(
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
            </section>
          </div>

          {/* Bottom Section: Full Width Compatibilities Table */}
          <section className="w-full mt-8">
            <h3 className="text-lg font-bold mb-4">Compatibilidades</h3>
            <ApplicationsTable
              category={category}
              applications={item?.applications || []}
            />
          </section>
        </div>
      )}
    </PlatinumLayout>
  );
};

export default ProductDetail;
