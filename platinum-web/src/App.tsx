import CardDownload from "./components/CardDownload";
import CardProduct from "./components/CardProduct";
import Carousel from "./components/Carousel/Carousel";
import ContactButton from "./components/ContactButton";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Marcas from "./components/Marcas";

function page() {
  return (
    <main>
      <Header />
      <Carousel />
      <Marcas />

      <h1 className="py-6 lg:py-12">Nuevas Integraciones</h1>

      <section className="grid grid-cols-1 sm:grid-cols-2 nav:grid-cols-3 gap-5 px-6 sm:px-5 xl:px-24 2xl:px-40">
        <CardProduct
          image={"TY07.png"}
          title={"TY07-275HCE-01"}
          texto={[
            "Toyota Hiace",
            "V6, 3.5 LTS. 24 V",
            "GASOLINA 227 HP 2019-2023",
            "Con CSC",
          ]}
        />
        <CardProduct
          image={"MB00-03.png"}
          title={"MB00-240SPR-03"}
          texto={[
            "MERCEDES BENZ Sprinter",
            "L4. 2.1, 16 VALV.",
            "Con CSC",
            "240 MM | 26D",
          ]}
        />
        <CardProduct
          image={"HON03.png"}
          title={"HON03-200FIT-01"}
          texto={[
            "FIT L4 1.5 LTS. DOHC 130HP. 15-20",
            "CITY 11-19 SOHC 1.5",
            "FIT 09-19 SOHC 1.5",
            "FIT 4 CIL 1.5L 5 VEL 2009",
          ]}
        />
        <CardProduct
          image={"HIN04.png"}
          title={"HIN04-300414-01"}
          texto={[
            "414 - 614",
            "L4 4.0 Litros",
            "TURBO DIESEL",
            "5 VEL 2009 A 2019",
          ]}
        />
        <CardProduct
          image={"MB04.png"}
          title={"MB04-430OM460-01"}
          texto={[
            "MULTEGO OC 500",
            "OM457 L6 12L 428HP",
            "L6 12.8L 420HP",
            "MBGO21OM",
          ]}
        />
        <CardProduct
          image={"MB05.jpg"}
          title={"MB05-BUS457-01"}
          texto={[
            "AUTOBUS MB 447-457",
            "OM447",
            "OM457 Transmisión ZF S6105",
            "430 MM, 10D",
          ]}
        />
      </section>

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

      <Footer />
    </main>
  );
}

export default page;
