import { useEffect, useState } from "react";
import ContactButton from "../../components/ContactButton";
import { Separator } from "../../components/ui/separator";
import PlatinumLayout from "../../Layouts/PlatinumLayout";

export default function Contacto() {
  const [state, setState] = useState("");
  const [alert, setAlert] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    email: "",
    telefono: "",
    mensaje: "",
  });

  async function handleOnSubmit(e: any) {
    e.preventDefault();

    setState("loading");

    await fetch("/api/send", {
      method: "POST",
      body: JSON.stringify(formData),
    });

    setState("ready");

    setFormData({
      firstName: "",
      email: "",
      telefono: "",
      mensaje: "",
    });

    setAlert(true);
  }

  useEffect(() => {
    setTimeout(() => {
      setAlert(false);
    }, 2000);
  }, [alert]);

  function handleInputChange(e: any) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  return (
    <PlatinumLayout>
      <main className="flex flex-col items-center">
        <h1 className="hidden md:block py-6 lg:py-9">
          Llene el formulario de Contacto
        </h1>
        <section className="md:flex w-full justify-between gap-4 px-5 md:px-10">
          <section className="lg:w-1/3 bg-gris_oscuro border rounded-xl p-8 mb-10 md:mb-32 mt-6 md:mt-0 text-white">
            <h2 className="font-bold text-2xl md:text-3xl">
              Información de Contacto
            </h2>
            <p className="my-5 font-semibold text-lg">Soporte Técnico:</p>
            <div className="flex items-center space-x-3">
              <img
                src="/icons/whatsappnaranja.png"
                alt="Kit"
                width={30}
                height={30}
              />
              <p className="font-base text-lg">446 138 5347</p>
            </div>
            <div className="flex items-center space-x-3 mt-5">
              <img
                src="/icons/emailNaranja.png"
                alt="Kit"
                width={30}
                height={30}
              />
              <p className="font-b text-base text">
                soporte@platinumdriveline.mx
              </p>
            </div>
            <Separator className="border border-slate-200 mt-5" />
            <p className="my-5 font-semibold text-lg">Ventas:</p>
            <div className="flex items-center space-x-3">
              <img
                src="/icons/whatsappnaranja.png"
                alt="Kit"
                width={30}
                height={30}
              />
              <p className="font-base text-lg">442 345 5370</p>
            </div>
            <div className="flex items-cenaseter space-x-3 mt-5">
              <img
                src="/icons/emailNaranja.png"
                alt="Kit"
                width={30}
                height={30}
              />
              <p className="font-b text-base">ventas@platinumdriveline.mx</p>
            </div>
            <Separator className="border border-slate-200 mt-5" />
            <p className="my-5 font-semibold text-lg">Ubicación:</p>
            <div className="flex items-center space-x-3">
              <img src="/icons/location.png" alt="Kit" width={30} height={30} />
              <p className="font-base text-base">Santiago de Querétaro</p>
            </div>
          </section>
          <h2 className="md:hidden text-center font-medium text-3xl py-0 pb-8 px-4 lg:py-8 text-black">
            Llene el formulario de Contacto
          </h2>
          <form
            className="px-2 w-full lg:w-4/6 pb-12"
            onSubmit={handleOnSubmit}
          >
            {alert && (
              <section className="bg-[#E7FFEC] border border-[#ACD2BC] text-[#06842E] py-4 rounded-2xl px-10 mb-8 flex flex-col sm:flex-row gap-3 md:gap-6 items-center text-center">
                <img
                  src="/icons/correct.png"
                  width={24}
                  height={24}
                  alt="Icon regresar"
                />
                <p>
                  <span className="font-bold">Exito!</span> Tu mensaje ha sido
                  enviado exitosamente.
                </p>
              </section>
            )}
            <fieldset className="flex flex-col ">
              <label
                htmlFor="firstName"
                className="font-semibold uppercase text-black"
              >
                Nombre
              </label>
              <input
                className="border border-gray-400 p-3 rounded-[10px] outline-none mt-[10px] mb-[20px]"
                type="text"
                placeholder="Tu Nombre"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />

              <label
                htmlFor="email"
                className="font-semibold uppercase text-black"
              >
                E-mail
              </label>
              <input
                className="border border-gray-400 p-3 rounded-[10px] outline-none mt-[10px] mb-[20px]"
                type="email"
                placeholder="Tu Email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />

              <label
                htmlFor="telefono"
                className="font-semibold uppercase text-black"
              >
                Teléfono
              </label>
              <input
                className="border border-gray-400 p-3 rounded-[10px] outline-none mt-[10px] mb-[20px]"
                type="tel"
                placeholder="Tu Teléfono"
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleInputChange}
                required
              />

              <label
                htmlFor="mensaje"
                className="font-semibold uppercase text-black"
              >
                Mensaje:
              </label>
              <textarea
                className="border border-gray-400 p-3 rounded-[10px] outline-none mt-[15px] mb-[25px] h-[210px]"
                id="mensaje"
                name="mensaje"
                placeholder="Ingresa tu mensaje..."
                value={formData.mensaje}
                onChange={handleInputChange}
                required
              ></textarea>
            </fieldset>
            <div>
              <input
                type="submit"
                value="Enviar"
                className="bg-naranja font-medium py-4 px-20 rounded-full text-white"
                disabled={state === "loading"}
              />
            </div>
          </form>
        </section>
        <ContactButton />
      </main>
    </PlatinumLayout>
  );
}
