import { Link } from "react-router-dom";
import ContactButton from "../../components/ContactButton";
import PlatinumLayout from "../../Layouts/PlatinumLayout";

function QuienesSomos() {
  return (
    <PlatinumLayout>
      <section className="bg-gris_oscuro px-6 lg:px-16 xl:px-24 py-12">
        <h1 className="mb-10 text-white">Conoce Sobre Nosotros</h1>

        <div className="flex flex-col xl:flex-row gap-10 xl:gap-16 mb-4">
          <div className="w-full sm:w-2/3 md:w-1/2 xl:w-2/5 mx-auto xl:mx-0 flex-shrink-0">
            <iframe
              src="https://www.youtube.com/embed/imRvb8pWkDQ"
              className="w-full rounded-xl"
              height="280"
              allowFullScreen
            />
          </div>
          <div className="xl:w-3/5 space-y-4 text-slate-300 leading-relaxed text-[15px]">
            <p>
              Platinum Driveline, Inc. fue fundado en 2012 por Bob Insalaco, anterior Gerente General de AMS Automotive
              y Art Lottes III, Ex Presidente de Carquest Auto Parts. Su amplio conocimiento en la industria automotriz,
              combinado con una profunda experiencia, es respaldado por un equipo dedicado de profesionales en el mercado.
            </p>
            <p>
              Enero de 2018, Platinum Driveline, Inc. decide establecerse en México con el fin de distribuir su gama de
              productos, que incluye Volantes Motrices, Kits de Embrague, Sistemas hidráulicos de Embrague y su línea de
              Embragues para Servicio Pesado.
            </p>
            <p>
              Platinum Driveline distribuye a través de todo Norte América con productos elaborados por los fabricantes
              más renombrados en la industria automotriz.{" "}
              <Link to="https://www.platinumdriveline.com" target="_blank" className="text-naranja hover:underline">
                Ver sitio en Estados Unidos →
              </Link>
            </p>
            <p>
              Además de productos de alta calidad, nos dedicamos a ofrecer un Servicio Personalizado, esforzándonos
              para proveer a nuestros clientes el producto correcto, con el mejor precio y en un tiempo oportuno.
            </p>
          </div>
        </div>
      </section>

      <main className="px-6 lg:px-16 xl:px-24 py-16 bg-white">
        <h2 className="text-4xl font-bold text-gray-900 mb-10 text-center">Más Sobre Nosotros</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-14">
          {[
            { icon: "/icons/service.png", title: "Servicio", body: "Contamos con cobertura total en el territorio nacional. Nuestro personal está capacitado para ofrecer servicio personalizado, excelentes niveles de inventario y entrega de pedidos con prontitud." },
            { icon: "/icons/philosophy.png", title: "Filosofía", body: "Comprometernos a ofrecer lo mejor de nosotros a través de altos principios de ética y respeto con nuestros colaboradores, proveedores, clientes y medio ambiente." },
            { icon: "/icons/target.png", title: "Misión", body: "Satisfacer las necesidades de nuestros proveedores y clientes ofreciendo productos de calidad con precio justo y buen servicio para crear una relación permanente." },
            { icon: "/icons/vision.png", title: "Visión", body: "Posicionarnos como un proveedor de marca líder y confiable, donde comprar Platinum sea una experiencia de calidad para el cliente y su automóvil." },
          ].map((v) => (
            <article key={v.title} className="flex gap-6 items-start bg-[#F5F6F8] rounded-2xl px-8 py-8 border border-slate-200">
              <img src={v.icon} alt={v.title} className="w-14 h-14 object-contain flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{v.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{v.body}</p>
              </div>
            </article>
          ))}
        </div>

      </main>
      <ContactButton />

    </PlatinumLayout>
  );
}

export default QuienesSomos;
