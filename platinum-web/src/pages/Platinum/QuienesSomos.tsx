import { Link } from "react-router-dom";
import ContactButton from "../../components/ContactButton";
import PlatinumLayout from "../../Layouts/PlatinumLayout";

function QuienesSomos() {
  return (
    <PlatinumLayout>
      <main className="px-6 lg:px-10 xl:px-20">
        <h1 className="py-6 lg:py-12">Conoce Sobre Nosotros</h1>

        <section className="flex flex-col xl:flex-row gap-8 xl:gap-14">
          <section className="mx-auto w-full sm:w-2/3 md:w-1/2 xl:basis-2/5">
            <iframe
              height="315"
              src="https://www.youtube.com/embed/imRvb8pWkDQ"
              className="w-full"
            ></iframe>
          </section>

          <section className="basis-3/6 xl:basis-3/5 text-justify">
            <p>
              Platinum Driveline, Inc. fue fundado en 2012 por Bob Insalaco,
              anterior Gerente General de AMS Automotive y Art Lottes III, Ex
              Presidente de Carquest Auto Parts. Su amplio conocimiento en la
              industria automotriz, combinado con una profunda experiencia, es
              respaldado por un equipo dedicado de profesionales en el mercado.
            </p>
            <br />
            <p>
              Enero de 2018, Platinum Driveline, Inc. decide establecerse en
              México con el fin de distribuir su gama de productos, que incluye
              Volantes Motrices, Kits de Embrague, Sistemas hidráulicos de
              Embrague y su línea de Embragues para Servicio Pesado. ¿La meta?
              Ofrecer al mercado mexicano una amplia gama de números de parte,
              de primera calidad y con precios competitivos, así como excelencia
              en el servicio al cliente.
            </p>
            <br />
            <p>
              Platinum Driveline, Inc. distribuye una gran variedad de productos
              a través de todo Norte América y son elaborados por los
              fabricantes más renombrados en la Industria Automotriz, los Juegos
              de Embrague son ensamblados en nuestro almacén de San Luis,
              Missouri en los Estados Unidos.{" "}
              <Link to="https://www.platinumdriveline.com" target="_blank">
                <span className="text-naranja">
                  (Haz click para ver la pagina de Estados Unidos)
                </span>
              </Link>
            </p>
            <br />
            <p>
              Además de productos de alta calidad, también nos dedicamos a
              ofrecer un Servicio Personalizado, mientras continuamos
              desarrollando mejoras en nuestras operaciones. Nos esforzamos con
              el fin de poder proveer a nuestros clientes el producto correcto,
              con el mejor precio y en un tiempo oportuno.
            </p>
          </section>
        </section>

        <h1 className="py-10 md:mt-12 md:mb-10">Mas Sobre Nosotros</h1>
        <article className="flex flex-col items-center basis-1/3 bg-[#f4f4f4] border  rounded-lg px-8 mb-6 py-10">
          <img className="w-24" src="/icons/service.png" alt="opportunity" />
          <h3 className="text-center text-[30px] font-medium my-8">Servicio</h3>
          <p className="flex-grow text-center leading-10">
            Contamos con cobertura total en el territorio nacional, nuestro
            personal está capacitado para ofrecer servicio personalizado y de
            tele mercadeo. Nos distinguimos por generar alianzas con nuestros
            distribuidores, tener excelentes niveles de inventario, adecuarnos a
            las necesidades del cliente y asegurar la entrega de pedidos con
            prontitud.
          </p>
        </article>
        <section className="flex flex-col lg:flex-row lg:px-0 gap-8 lg:gap-6 text-justify items-stretch leading-8 mb-14">
          <article className="flex flex-col items-center basis-1/3 bg-[#f4f4f4] border  rounded-lg px-8 py-10">
            <img
              className="w-24"
              src="/icons/philosophy.png"
              alt="philosophy"
            />
            <h3 className="text-center text-[30px] font-medium my-8">
              Filosofía
            </h3>
            <p className="flex-grow text-center leading-10">
              Comprometernos a ofrecer lo mejor de nosotros a través de altos
              principios de ética y respeto con nuestros colaboradores,
              proveedores, clientes y medio ambiente.
            </p>
          </article>

          <article className="flex flex-col items-center basis-1/3 bg-[#f4f4f4] border rounded-lg px-8 py-10">
            <img className="w-24" src="/icons/target.png" alt="target" />
            <h3 className="text-center text-[30px] font-medium my-8">Misión</h3>
            <p className="flex-grow text-center leading-10">
              Satisfacer las necesidades de nuestros proveedores y clientes
              ofreciendo productos de calidad con precio justo y buen servicio
              para así crear una relación permanente.
            </p>
          </article>

          <article className="flex flex-col items-center basis-1/3 bg-[#f4f4f4] border  rounded-lg px-8 py-10">
            <img className="w-24" src="/icons/vision.png" alt="opportunity" />
            <h3 className="text-center text-[30px] font-medium my-8">Visión</h3>
            <p className="flex-grow text-center leading-10">
              Que el comprar productos de marca Platinum sea una experiencia de
              calidad para el cliente y su automóvil y posicionarnos como un
              proveedor de marca líder y confiable.
            </p>
          </article>
        </section>

        <ContactButton />
      </main>
    </PlatinumLayout>
  );
}

export default QuienesSomos;
