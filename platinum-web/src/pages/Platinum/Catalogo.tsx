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
import { useProducts } from "../../hooks/useProducts";

type CatalogoProps = {};

const Catalogo = ({}: CatalogoProps) => {
  const { categories } = useCategories();
  const { products } = useProducts();

  const [form, setForm] = useState({
    filtro: "Vehiculo",
    categoria: categories.length > 0 ? categories[0] : null,
    vehiculo: {},
    referencia: "",
  });

  useEffect(() => {
    if (categories.length > 0 && !form.categoria) {
      setForm((prevForm) => ({
        ...prevForm,
        categoria: categories[0],
      }));
    }
  }, [categories, form.categoria]);

  const handleReference = (e: any) => {
    setForm((prevform) => ({
      ...prevform,
      referencia: e.target.value,
    }));
  };

  const handleCategoryChange = (value: string) => {
    const selectedCategory = categories.find(
      (category) => category.id === value
    );
    if (selectedCategory) {
      setForm((prevForm) => ({
        ...prevForm,
        categoria: selectedCategory,
      }));
    }
  };

  return (
    <PlatinumLayout>
      <section className="bg-hero-catalog bg-cover pl-20 pb-14">
        <h2 className="font-bold text-4xl pt-36 pb-20 text-white">
          Catálogo Electrónico Platinum
        </h2>
        <div className="flex gap-10">
          <div className="flex flex-col">
            <Label className="font-semibold text-base mb-4 text-white">
              Marca:
            </Label>
            <div className="flex gap-5 bg-white text-black rounded-lg h-full items-center px-6">
              <img className="w-20" src="/LOGOPlatinum.png" />
              <p>Platinum Driveline</p>
            </div>
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
                    filtro: "Vehiculo",
                  }))
                }
                className={
                  form.filtro === "Vehiculo"
                    ? "bg-gris_oscuro text-white hover:bg-gris_oscuro hover:text-white"
                    : "text-black"
                }
              >
                Vehículo
              </Button>
              <Button
                size={"lg"}
                variant={"ghost"}
                onClick={() =>
                  setForm((prevForm) => ({
                    ...prevForm,
                    filtro: "Referencia",
                  }))
                }
                className={
                  form.filtro === "Referencia"
                    ? "bg-gris_oscuro text-white hover:bg-gris_oscuro hover:text-white"
                    : "text-black"
                }
              >
                Referencia
              </Button>
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
                      src={form.categoria.image}
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
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>
      <main className="px-20 py-8 bg-[#E4E4E4]">
        {form.filtro === "Vehiculo" ? (
          <FilterSection categories={categories} />
        ) : (
          <div className="flex gap-3 w-[40%]">
            <Input
              value={form.referencia}
              onChange={handleReference}
              placeholder="Ingresa un número de referencia"
            />
            <Button
              disabled={form.referencia === ""}
              className="bg-gris_oscuro"
            >
              Mostrar Resultados
            </Button>
          </div>
        )}
        <ProductsTable data={products} />
      </main>
    </PlatinumLayout>
  );
};

export default Catalogo;
