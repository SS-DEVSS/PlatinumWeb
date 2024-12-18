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
import FilterSection from "../../components/FilterSection";
import { Input } from "../../components/ui/input";
import ProductsTable from "../../components/ProductsTable";
import { useBrands } from "../../hooks/useBrands";
import SkeletonCatalog from "../../skeletons/SkeletonCatalog";
import { Category } from "../../models/category";

type formState = {
  filtroTipo: "NumParte" | "Vehiculo" | "Referencia";
  filtro: {
    referencia: string;
    numParte: string;
  };
  categoria: Category | null;
};

const Catalogo = () => {
  const {
    loading: loadingCategories,
    getCategoryById,
    category,
  } = useCategories();
  const { loading: loadingBrands, brands } = useBrands();

  const categories = brands?.categories || [];

  const [form, setForm] = useState<formState>({
    filtroTipo: "NumParte",
    filtro: {
      referencia: "",
      numParte: "",
    },
    categoria: categories.length > 0 ? categories[0] : null,
  });

  useEffect(() => {
    if (categories!.length > 0 && !form.categoria) {
      setForm((prevForm) => ({
        ...prevForm,
        categoria: categories![0],
      }));
    }

    if (form.categoria) {
      getCategoryById(form.categoria?.id);
    }
  }, [categories, form.categoria]);

  const handleReference = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setForm((prevform) => ({
      ...prevform,
      filtro: {
        numParte: "",
        referencia: value,
        vehiculo: {},
      },
    }));
  };

  const handleNumParte = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setForm((prevform) => ({
      ...prevform,
      filtro: {
        numParte: value,
        referencia: "",
        vehiculo: {},
      },
    }));
  };

  const handleCategoryChange = (value: string) => {
    const selectedCategory = categories!.find(
      (category) => category.id === value
    );
    if (selectedCategory) {
      setForm((prevForm) => ({
        ...prevForm,
        categoria: selectedCategory,
      }));
    }
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
        return <FilterSection category={category} filtroInfo={form.filtro} />;
    }
  };

  return (
    <PlatinumLayout>
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
                <div className="flex gap-5 bg-white text-black rounded-lg h-full items-center py-4 px-6">
                  <img
                    className="w-20"
                    src={brands?.logoImgUrl}
                    alt={`image`}
                  />
                  <p>{brands?.name}</p>
                </div>
              </div>
              <div className="flex flex-col">
                <Label className="font-semibold text-base mb-4 text-white">
                  Categoría:
                </Label>
                <Select onValueChange={handleCategoryChange}>
                  <SelectTrigger className="h-full">
                    {form.categoria ? (
                      <div className="flex items-center">
                        <img
                          className="w-20 max-h-10"
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
                      {categories?.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
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
                <div className="flex gap-2 rounded-lg bg-white p-2 h-full items-center">
                  <Button
                    size={"lg"}
                    variant={"ghost"}
                    onClick={() =>
                      setForm((prevForm) => ({
                        ...prevForm,
                        filtroTipo: "NumParte",
                        filtro: {
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
            <ProductsTable category={category} filtroInfo={form.filtro} />
          </section>
        </>
      )}
    </PlatinumLayout>
  );
};

export default Catalogo;
