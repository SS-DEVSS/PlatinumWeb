import BoletinCard from "../../components/BoletinCardDelphi";
import CardDelphiProduct from "../../components/CardDelphiProduct";
import CardDownload from "../../components/CardDownload";

function DelphiPage() {
  return (
    <main>
      <section className="bg-azul_delphi p-6 xl:px-40 mb-20 pb-16 pt-10">
        <a href="/">
          <button className="flex border rounded-full px-6 py-2 gap-3">
            <img
              src="/icons/left-arrow.png"
              width={24}
              height={24}
              alt="Icon regresar"
            />
            <p className="text-white">Regresar</p>
          </button>
        </a>
        <img
          src="/LOGODelphi.png"
          alt="Logo Delphi"
          width={200}
          height={200}
          className="mt-8"
        />
        <article className="flex flex-col md:flex-row bg-white rounded-2xl rounded-t-2xl mt-7">
          <section className="bg-[#e5e2e2] rounded-t-2xl md:rounded-r-none md:rounded-l-2xl basis-2/6 flex flex-col items-center justify-center">
            <img
              src="/images/cajas/CajaDelphi.png"
              alt="Kit"
              width={400}
              height={400}
            />
          </section>
          <p className="basis-4/6 text-justify p-8 lg:p-16 leading-10 flex flex-col items-center justify-center">
            Con presencia en más de 150 países y una red global de más de 2750
            centros de servicio, Delphi proporciona soluciones integrales con
            especificaciones OE. Con una amplia cartera que incluye sistemas de
            combustible de gasolina, sistemas de combustible diesel, soluciones
            de mantenimiento, gestión de motores y Electrónica del vehículo,
            respaldada por equipos de prueba y diagnóstico de nivel OE,
            capacitación y asistencia técnica. información, Delphi permite a los
            talleres dar servicio y reparar vehículos correctamente desde la
            primera vez.
          </p>
        </article>
      </section>
      <section className="px-6 lg:px-12 xl:px-40">
        <h1>Accede a Nuestro Contenido</h1>
        <section className="mt-28 flex flex-col sm:flex-row justify-center gap-28 sm:gap-4 md:gap-8 lg:gap-6 xl:gap-10">
          <CardDownload
            title={"Catálogo Electrónico"}
            content={
              "Explora el catálogo electrónico de Delphi para encontrar la mejor selección de componentes de suspensión. Delphi ofrece soluciones innovadoras y de alta calidad disponibles globalmente."
            }
            type={"web"}
            href={
              "https://www.delphiautoparts.com/es/cat%C3%A1logo-de-piezas?make=&model=&engine=&year=&vehicle=&product="
            }
            page={"delphi"}
          />
          <CardDownload
            title={"Catálogo en PDF"}
            content={
              "Descarga el catálogo en PDF de Delphi. Tendrás acceso a información detallada sobre nuestros componentes de suspensión y sus aplicaciones."
            }
            type={"web"}
            href={
              "https://drive.google.com/file/d/1iG1frUd0cIGODVk8fQUhOvi4NEwxWLKH/view?usp=sharing"
            }
            page={"delphi"}
          />
        </section>
        <section className="bg-[#F4F4F4] mt-10 mb-10 lg:mb-20 p-4 md:p-10 text-center rounded-2xl shadow">
          <h3 className="text-3xl py-3 lg:py-5">Nuestros Boletines</h3>
          <section className="flex flex-col sm:flex-row justify-center gap-4 md:gap-8 mt-3 lg:mt-6">
            <BoletinCard
              img={"delphi/BoletinDelphi1.jpg"}
              title={"Diagnóstico de fallos"}
              href={"BoletinDelphi1.jpg"}
            />
            <BoletinCard
              img={"delphi/BoletinDelphi2.jpg"}
              title={"Módulos De Combustible"}
              href={"/download/BoletinDelphi2.pdf"}
            />
          </section>
        </section>
      </section>
      <section className="bg-azul_delphi px-5 lg:px-16 xl:px-28">
        <h1 className="text-center py-16 text-white text-[32px] font-medium">
          Suspensión
        </h1>
        <article className="flex flex-col-reverse md:flex-row bg-white rounded-2xl rounded-t-2xl shadow">
          <section className="basis-4/6 flex flex-col justify-center text-justify p-6 lg:p-16 leading-10">
            <p>
              Como parte integral de su conducción, manejo y seguridad, el
              sistema de dirección de un vehículo debe estar a la altura del
              trabajo. ¡Nos aseguramos de que así sea! ¿Cómo? Aplicando nuestra
              experiencia en OE a nuestra cartera de direcciones del mercado de
              repuestos. Es por eso que todas nuestras piezas se someten a
              rigurosas pruebas de dimensiones, materiales, durabilidad y
              rendimiento, lo que ayuda a garantizar que funcionen como el
              equipo original. Es también por eso que ofrecemos capacitación
              experta y soporte técnico. Brindándole todo lo que necesita para
              reparar sistemas de dirección de manera segura, eficiente y
              rentable.
            </p>
          </section>
          <section className="bg-[#e5e2e2] rounded-b-none rounded-t-2xl md:rounded-r-2xl md:rounded-l-none basis-2/6 flex flex-col items-center justify-center">
            <img
              src="/delphi/grupalSuspension.png"
              alt="Kit"
              width={400}
              height={400}
            />
          </section>
        </article>
        <h2 className="text-center py-16 text-white text-[32px] font-medium">
          Nuestros Productos
        </h2>
        <section className="flex flex-col flex-wrap sm:flex-row justify-center gap-6 pb-28">
          <CardDelphiProduct
            image={"rotulaBrazo"}
            title={"Rotulas y Brazos Pitman"}
          />
          <CardDelphiProduct
            image={"horquillasTornillos"}
            title={"Horquillas y tornillos estabilizadores"}
          />
          <CardDelphiProduct
            image={"terminales"}
            title={"Terminales  de direccion, externas e internas"}
          />
          <CardDelphiProduct
            image={"barraEstabilizadora"}
            title={"Tirantes de barra estabilizadora"}
          />
          <CardDelphiProduct image={"buje"} title={"Bujes de horquillas"} />
        </section>
      </section>
    </main>
  );
}

export default DelphiPage;
