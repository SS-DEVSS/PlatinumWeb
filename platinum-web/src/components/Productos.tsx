function Productos() {
  return (
    <main>
      <h1 className="mb-10">Nuestros Productos</h1>

      <section className="bg-[#F4F4F4] flex flex-col items-center text-center mt-6">
        <a href="/Productos/Kit">
          <h2 className="text-[35px] font-medium mt-9">Kits + CSC</h2>
          <p className="text-naranja font-regular text-lg mt-4 hover:underline">
            Mas información
          </p>
          <section className="flex flex-col md:flex-row items-center justify-center gap-12 mb-20 mt-8 px-8">
            <img
              className="w-[420px]"
              src="/images/componentes/FD05-1.png"
              alt="Kit"
            />
            <article className="flex justify-center">
              <img
                className="w-[280px]"
                src="/images/componentes/SFC511PL.png"
                alt="Boletin #1"
              />
            </article>
          </section>
        </a>
      </section>

      <h1 className="my-12 p-0">Nuestros Componentes</h1>

      <section className="flex flex-col md:flex-row justify-between gap-6">
        <article className="bg-[#F4F4F4] basis-1/2 flex flex-col items-center text-center py-2">
          <a href="/Productos/Plato">
            <h2 className="text-[35px] font-medium mt-9">Plato</h2>
            <p className="text-naranja font-regular text-lg mt-1 mb-5 hover:underline">
              Mas información
            </p>
            <img
              src="/images/componentes/VW03-2.png"
              alt="Boletin #1"
              className="mb-12 w-[360px]"
            />
          </a>
        </article>

        <article className="bg-[#F4F4F4] basis-1/2 flex flex-col items-center text-center py-2">
          <a href="/Productos/Disco">
            <h2 className="text-[35px] font-medium mt-9">Disco</h2>
            <p className="text-naranja font-regular text-lg mt-1 mb-5 hover:underline">
              Mas información
            </p>
            <img
              src="/images/componentes/NS73-3.png"
              alt="Kit NS73-3"
              className="mb-12 w-[360px]"
            />
          </a>
        </article>
      </section>
    </main>
  );
}

export default Productos;
