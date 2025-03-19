import PlatinumLayout from "../../Layouts/PlatinumLayout";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Button } from "../../components/ui/button";
import { useState, useEffect } from "react";
import { useCategories } from "../../hooks/useCategories";
import { useBrands } from "../../hooks/useBrands";
import FilterSection from "../../components/FilterSection";
import { Input } from "../../components/ui/input";
import ProductsTable from "../../components/ProductsTable";
import SkeletonCatalog from "../../skeletons/SkeletonCatalog";
import SkeletonProductsTable from "../../skeletons/SkeletonProductsTable";
import { Category } from "../../models/category";
import { Alert, AlertDescription } from "../../components/ui/Alert";
import { AlertCircle } from "lucide-react";

type formState = {
  filtroTipo: "NumParte" | "Vehiculo" | "Referencia";
  filtro: {
    referencia: string;
    numParte: string;
    vehiculo: {
      selectedFilters?: Array<{ attributeId: string, value: string }>;
    };
  };
  categoria: Category | null;
  marca: string | null;
};

const Catalogo = () => {
  const { loading: loadingBrands, brands: brandsMap, error: brandsError } = useBrands();
  const {
    loading: loadingCategories,
    category,
    getCategoryById,
    error: categoriesError
  } = useCategories();

  // Convert brandsMap to array for rendering
  const brands = Object.values(brandsMap || {});

  // Adding loading state for products table
  const [loadingProducts, setLoadingProducts] = useState<boolean>(false);
  // Track if initial load has happened
  const [initialLoad, setInitialLoad] = useState<boolean>(false);
  // Add state to track product loading errors
  const [productsError, setProductsError] = useState<string | null>(null);

  // State to track available categories based on selected brand
  const [availableCategories, setAvailableCategories] = useState<Category[]>([]);

  const [form, setForm] = useState<formState>({
    filtroTipo: "NumParte",
    filtro: {
      referencia: "",
      numParte: "",
      vehiculo: {
        selectedFilters: []
      },
    },
    categoria: null,
    marca: null,
  });

  // Handle initial brand selection
  useEffect(() => {
    if (brands && brands.length > 0 && !form.marca) {
      // Select first brand by default
      const firstBrand = brands[1];
      setForm(prevForm => ({
        ...prevForm,
        marca: firstBrand.id
      }));

      // Set available categories for the first brand
      setAvailableCategories(firstBrand.categories || []);

      // If brand has categories, select the first one
      if (firstBrand.categories && firstBrand.categories.length > 0) {
        setForm(prevForm => ({
          ...prevForm,
          categoria: firstBrand.categories[0],
        }));
      }
    }
  }, [brands]);

  // Update available categories when brand changes
  useEffect(() => {
    if (!brands || brands.length === 0 || !form.marca) return;

    const selectedBrand = brandsMap[form.marca];
    if (selectedBrand) {
      setAvailableCategories(selectedBrand.categories || []);

      // If brand has categories, select the first one
      if (selectedBrand.categories && selectedBrand.categories.length > 0) {
        setForm(prevForm => ({
          ...prevForm,
          categoria: selectedBrand.categories[0],
          // Reset vehicle filters when changing brand
          filtro: {
            ...prevForm.filtro,
            vehiculo: {
              selectedFilters: []
            }
          }
        }));
      } else {
        // If brand has no categories, clear category selection
        setForm(prevForm => ({
          ...prevForm,
          categoria: null
        }));
      }
    }
  }, [form.marca, brandsMap]);

  // Fetch category data when selected category changes
  useEffect(() => {
    if (!form.categoria) return;

    setProductsError(null);
    setLoadingProducts(true);

    getCategoryById(form.categoria.id)
      .then(() => {
        setInitialLoad(true);
      })
      .catch((err) => {
        setProductsError(`Error al cargar productos: ${err.message || 'Ocurrió un error inesperado'}`);
      })
      .finally(() => {
        setTimeout(() => {
          setLoadingProducts(false);
        }, 800);
      });
  }, [form.categoria]);

  // MODIFIED: Only trigger loading for vehicle filters that require server-side processing
  useEffect(() => {
    if (initialLoad && form.filtroTipo === "Vehiculo" &&
      form.filtro.vehiculo.selectedFilters?.length > 0) {
      setProductsError(null);
      setLoadingProducts(true);

      // Your API call or data processing here

      setTimeout(() => {
        setLoadingProducts(false);
      }, 800); // Simulate loading time
    }
  }, [form.filtroTipo, form.filtro.vehiculo.selectedFilters, initialLoad]);

  const handleBrandChange = (brandId: string) => {
    if (form.marca === brandId) return;

    setForm(prevForm => ({
      ...prevForm,
      marca: brandId,
      // Reset filters when changing brand
      filtro: {
        numParte: "",
        referencia: "",
        vehiculo: {
          selectedFilters: []
        }
      }
    }));
  };

  const handleCategoryChange = (categoryId: string) => {
    const selectedCategory = availableCategories.find(
      (category) => category.id === categoryId
    );

    if (selectedCategory && (!form.categoria || form.categoria.id !== categoryId)) {
      setForm((prevForm) => ({
        ...prevForm,
        categoria: selectedCategory,
        filtro: {
          ...prevForm.filtro,
          // Clear vehicle filters when category changes
          vehiculo: {
            selectedFilters: []
          }
        }
      }));

      // Explicitly trigger loading and fetch for category change
      setProductsError(null);
      setLoadingProducts(true);

      getCategoryById(categoryId)
        .catch((err) => {
          setProductsError(`Error al cargar categoría: ${err.message || 'Ocurrió un error inesperado'}`);
        })
        .finally(() => {
          setTimeout(() => {
            setLoadingProducts(false);
          }, 800);
        });
    }
  };

  const handleReference = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setForm((prevform) => ({
      ...prevform,
      filtro: {
        ...prevform.filtro,
        numParte: "",
        referencia: value,
      },
    }));
  };

  const handleNumParte = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setForm((prevform) => ({
      ...prevform,
      filtro: {
        ...prevform.filtro,
        numParte: value,
        referencia: "",
      },
    }));
  };

  const handleVehicleFilterChange = (filters: Array<{ attributeId: string, value: string }>) => {
    setForm((prevform) => ({
      ...prevform,
      filtro: {
        ...prevform.filtro,
        vehiculo: {
          ...prevform.filtro.vehiculo,
          selectedFilters: filters
        }
      },
    }));
  };

  const getFilterComponent = () => {
    switch (form.filtroTipo) {
      case "NumParte":
        return (
          <div className="flex gap-3 w-[30%]">
            <Input
              value={form.filtro.numParte}
              onChange={handleNumParte}
              placeholder="Ingresa un número de parte"
              className="pl-5 py-7"
            />
          </div>
        );
      case "Referencia":
        return (
          <div className="flex gap-3 w-[30%]">
            <Input
              value={form.filtro.referencia}
              onChange={handleReference}
              placeholder="Ingresa un número de referencia"
              className="pl-5 py-7"
            />
          </div>
        );
      case "Vehiculo":
        return (
          <FilterSection
            category={category}
            filtroInfo={form.filtro}
            onFilterChange={handleVehicleFilterChange}
          />
        );
    }
  };

  // Find the current selected brand object
  const selectedBrand = form.marca ? brandsMap[form.marca] : null;

  // Determine if we have any errors to display
  const hasError = brandsError || categoriesError || productsError;
  const errorMessage = brandsError || categoriesError || productsError;

  return (
    <PlatinumLayout>
      {/* Error Alert */}
      {hasError && (
        <Alert variant="destructive" className="mx-20 mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {errorMessage}
          </AlertDescription>
        </Alert>
      )}

      {loadingCategories || loadingBrands ? (
        <SkeletonCatalog />
      ) : (
        <>
          <section className="bg-hero-catalog bg-cover pl-20 pb-14">
            <h2 className="font-bold text-4xl pt-36 pb-20 text-white">
              Catálogo Electrónico Platinum
            </h2>
            <div className="flex gap-10">
              <div className="flex flex-col">
                <Label className="font-semibold text-base mb-4 text-white">
                  Marca:
                </Label>
                <Select onValueChange={handleBrandChange} value={form.marca || ''}>
                  <SelectTrigger className="h-[52px] w-[250px]">
                    {selectedBrand ? (
                      <div className="flex items-center">
                        <img
                          className="w-16"
                          src={selectedBrand.logoImgUrl}
                          alt={selectedBrand.name}
                        />
                        <span className="ml-2 mx-4">{selectedBrand.name}</span>
                      </div>
                    ) : (
                      <SelectValue placeholder="Seleccionar Marca" />
                    )}
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Marcas</SelectLabel>
                      {brands?.map((brand) => (
                        <SelectItem key={brand.id} value={brand.id}>
                          <div className="flex items-center">
                            <img
                              className="w-8 h-8 mr-2 object-contain"
                              src={brand.logoImgUrl}
                              alt={brand.name}
                            />
                            {brand.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col">
                <Label className="font-semibold text-base mb-4 text-white">
                  Categoría:
                </Label>
                <Select
                  onValueChange={handleCategoryChange}
                  value={form.categoria?.id || ''}
                  disabled={availableCategories.length === 0}
                >
                  <SelectTrigger className="h-[52px] w-[250px]">
                    {form.categoria ? (
                      <div className="flex items-center">
                        <img
                          className="w-12"
                          src={form.categoria.imgUrl}
                          alt={form.categoria.name}
                        />
                        <span className="ml-2 mx-4">{form.categoria.name}</span>
                      </div>
                    ) : (
                      <SelectValue placeholder="Seleccionar Categoría" />
                    )}
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Categorías</SelectLabel>
                      {availableCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          <div className="flex items-center">
                            <img
                              className="w-8 h-8 mr-2 object-contain"
                              src={category.imgUrl}
                              alt={category.name}
                            />
                            {category.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col">
                <Label className="font-semibold text-base mb-4 text-white">
                  Filtrar Por:
                </Label>
                <div className="flex gap-2 rounded-lg bg-white p-2 items-center h-[52px]">
                  <Button
                    size={"lg"}
                    variant={"ghost"}
                    onClick={() =>
                      setForm((prevForm) => ({
                        ...prevForm,
                        filtroTipo: "NumParte",
                        filtro: {
                          ...prevForm.filtro,
                          referencia: "",
                          numParte: "",
                        },
                      }))
                    }
                    className={
                      form.filtroTipo === "NumParte"
                        ? "bg-gris_oscuro text-white hover:bg-gris_oscuro hover:text-white"
                        : "text-black"
                    }
                  >
                    Número de Parte
                  </Button>
                  <Button
                    size={"lg"}
                    variant={"ghost"}
                    onClick={() =>
                      setForm((prevForm) => ({
                        ...prevForm,
                        filtroTipo: "Referencia",
                        filtro: {
                          ...prevForm.filtro,
                          referencia: "",
                          numParte: "",
                        },
                      }))
                    }
                    className={
                      form.filtroTipo === "Referencia"
                        ? "bg-gris_oscuro text-white hover:bg-gris_oscuro hover:text-white"
                        : "text-black"
                    }
                  >
                    Referencia
                  </Button>
                  <Button
                    size={"lg"}
                    variant={"ghost"}
                    onClick={() =>
                      setForm((prevForm) => ({
                        ...prevForm,
                        filtroTipo: "Vehiculo",
                        filtro: {
                          ...prevForm.filtro,
                          referencia: "",
                          numParte: "",
                        },
                      }))
                    }
                    className={
                      form.filtroTipo === "Vehiculo"
                        ? "bg-gris_oscuro text-white hover:bg-gris_oscuro hover:text-white"
                        : "text-black"
                    }
                  >
                    Vehículo
                  </Button>
                </div>
              </div>
            </div>
            <section className="pt-8 flex gap-10 items-end"></section>
          </section>
          <section className="px-20 py-8 bg-[#E4E4E4]">
            {getFilterComponent()}
            {loadingProducts ? (
              <SkeletonProductsTable />
            ) : (
              <ProductsTable
                category={category}
                filtroInfo={form.filtro}
                filtroTipo={form.filtroTipo}
              />
            )}
          </section>
        </>
      )}
    </PlatinumLayout>
  );
};

export default Catalogo;