import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import ContactButton from "../../components/ContactButton";
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

  async function handleOnSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("loading");
    await fetch("/api/send", {
      method: "POST",
      body: JSON.stringify(formData),
    });
    setState("ready");
    setFormData({ firstName: "", email: "", telefono: "", mensaje: "" });
    setAlert(true);
  }

  useEffect(() => {
    setTimeout(() => setAlert(false), 2000);
  }, [alert]);

  function handleInputChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const inputClass =
    "border border-gray-200 bg-[#F5F6F8] p-3 rounded-xl outline-none mt-2 mb-5 focus:border-naranja focus:bg-white transition-colors";
  const labelClass =
    "text-sm font-semibold text-gray-700 uppercase tracking-wide";

  return (
    <PlatinumLayout>
      <main className="flex flex-col items-center px-5 md:px-10 pt-6 md:pt-0">
        <h1 className="hidden md:block py-6 lg:py-9">
          Llene el formulario de Contacto
        </h1>

        <section className="md:flex w-full justify-between gap-4">
          {/* Info card */}
          <section className="lg:w-1/3 bg-gris_oscuro rounded-2xl p-8 mb-10 md:mb-0 text-white flex-shrink-0 flex flex-col justify-between">
            <h2 className="font-semibold text-2xl mb-6">
              Información de Contacto
            </h2>

            <p className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-4">
              Soporte Técnico
            </p>
            <a
              href="https://wa.me/4461385347"
              target="_blank"
              className="flex items-center gap-3 mb-3 hover:opacity-80 transition-opacity"
            >
              <img
                src="/icons/whatsappnaranja.png"
                alt="whatsapp"
                width={22}
                height={22}
              />
              <p className="text-base">446 138 5347</p>
            </a>
            <a
              href="mailto:soporte@platinumdriveline.mx"
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <img
                src="/icons/emailNaranja.png"
                alt="email"
                width={22}
                height={22}
              />
              <p className="text-sm">soporte@platinumdriveline.mx</p>
            </a>

            <div className="border-t border-white/10 my-6" />

            <p className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-4">
              Ventas
            </p>
            <a
              href="https://wa.me/4423455370"
              target="_blank"
              className="flex items-center gap-3 mb-3 hover:opacity-80 transition-opacity"
            >
              <img
                src="/icons/whatsappnaranja.png"
                alt="whatsapp"
                width={22}
                height={22}
              />
              <p className="text-base">442 345 5370</p>
            </a>
            <a
              href="mailto:ventas@platinumdriveline.mx"
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <img
                src="/icons/emailNaranja.png"
                alt="email"
                width={22}
                height={22}
              />
              <p className="text-sm">ventas@platinumdriveline.mx</p>
            </a>

            <div className="border-t border-white/10 my-6" />

            <p className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-4">
              Ubicación
            </p>
            <div className="flex items-center gap-3">
              <img
                src="/icons/location.png"
                alt="location"
                width={22}
                height={22}
              />
              <p className="text-base">Santiago de Querétaro</p>
            </div>
          </section>

          {/* Form */}
          <div className="w-full lg:w-4/6">
            <h2 className="md:hidden text-center font-medium text-3xl pb-8 px-4 text-black">
              Llene el formulario de Contacto
            </h2>

            {alert && (
              <div className="bg-[#E7FFEC] border border-[#ACD2BC] text-[#06842E] py-4 rounded-xl px-6 mb-6 flex items-center gap-3">
                <img src="/icons/correct.png" width={20} height={20} alt="ok" />
                <p>
                  <span className="font-bold">¡Éxito!</span> Tu mensaje ha sido
                  enviado.
                </p>
              </div>
            )}

            <form onSubmit={handleOnSubmit} className="flex flex-col">
              <label htmlFor="firstName" className={labelClass}>
                Nombre
              </label>
              <input
                className={inputClass}
                type="text"
                placeholder="Tu nombre"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />

              <label htmlFor="email" className={labelClass}>
                E-mail
              </label>
              <input
                className={inputClass}
                type="email"
                placeholder="Tu email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />

              <label htmlFor="telefono" className={labelClass}>
                Teléfono
              </label>
              <input
                className={inputClass}
                type="tel"
                placeholder="Tu teléfono"
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleInputChange}
                required
              />

              <label htmlFor="mensaje" className={labelClass}>
                Mensaje
              </label>
              <textarea
                className={`${inputClass} h-[200px] resize-none`}
                id="mensaje"
                name="mensaje"
                placeholder="Ingresa tu mensaje..."
                value={formData.mensaje}
                onChange={handleInputChange}
                required
              />

              <div className="flex justify-end">
                <input
                  type="submit"
                  value={state === "loading" ? "Enviando..." : "Enviar mensaje"}
                  className="bg-naranja hover:bg-orange-500 transition-colors font-medium py-3 px-10 rounded-full text-white cursor-pointer"
                  disabled={state === "loading"}
                />
              </div>
            </form>
          </div>
        </section>
      </main>
      <div className="pb-16" />
      <ContactButton />
    </PlatinumLayout>
  );
}
