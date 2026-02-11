import CardDownload from "./components/CardDownload";
import Carousel from "./components/Carousel/Carousel";
import ContactButton from "./components/ContactButton";
import Marcas from "./components/Marcas";
import PlatinumLayout from "./Layouts/PlatinumLayout";
import FeaturedProductsSection from "./components/FeaturedProductsSection";

function page() {
  return (

    <PlatinumLayout>
      <Carousel />
      <Marcas />

      <FeaturedProductsSection />

      <section className="px-6 lg:px-10 xl:px-40 bg-gris_ligero mt-20 py-12">
        <h1 className="text-white">Accede a Nuestro Contenido</h1>
        <section className="mt-28 flex flex-col md:flex-row justify-center gap-24 md:gap-8 lg:gap-6 xl:gap-10">
          <CardDownload
            page={"platinum"}
            title={"Catálogo Electrónico"}
            content={
              "Accede al catálogo electrónico de Platinum Driveline para explorar nuestra amplia gama de componentes de clutch. Descubre productos de alta calidad y tecnología avanzada."
            }
            type={"web"}
            href={"https://catalogoplatinumdriveline.com"}
          />
          <CardDownload
            page={"platinum"}
            title={"Catálogo Ligero"}
            content={
              "Consulta el catálogo de vehículos ligeros de Platinum Driveline. Encuentra componentes diseñados para ofrecer el mejor rendimiento y durabilidad en automóviles ligeros."
            }
            type={"web"}
            href={
              "https://drive.google.com/file/d/1VALiPiPlFG4SzS6s9B8Z4U9d5ZjGhgHf/view?usp=sharing"
            }
          />
        </section>
        <section className="mt-28 flex flex-col md:flex-row justify-center gap-24 sm:gap-4 md:gap-8 lg:gap-6 xl:gap-10">
          <CardDownload
            page={"platinum"}
            title={"Catálogo Diesel"}
            content={
              "Explora el catálogo de productos diesel de Platinum Driveline. Nuestra selección incluye componentes robustos y fiables, ideales para vehículos diesel."
            }
            type={"download"}
            href={"/download/CatalogHD.pdf"}
          />
        </section>
      </section>

      <ContactButton />
    </PlatinumLayout>

  );
}

export default page;
