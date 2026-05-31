import PlatinumLayout from "../../Layouts/PlatinumLayout";

function Privacidad() {
  return (
    <PlatinumLayout>
      <main className="px-6 lg:px-10 xl:px-20 py-10 max-w-4xl mx-auto">

        {/* Header estilo carta */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10 pb-6 border-b border-gray-200">
          <div>
            <h1 className="uppercase tracking-wide">
              Aviso de Privacidad Integral
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Platinum Drive Line Mexico S. de R.L. de C.V.
            </p>
          </div>
          <img
            src="/LOGOPlatinum.png"
            alt="Platinum Driveline"
            className="w-40 object-contain"
          />
        </div>

        <section className="space-y-7 text-gray-700 leading-relaxed text-[15px]">

          <div>
            <h2 className="text-base font-bold text-gray-900 mb-2">Identidad y Domicilio del Responsable</h2>
            <p>
              Platinum Drive Line Mexico S. de R.L. de C.V. (en adelante "La Empresa"), con domicilio en
              Acceso C, número exterior 310, interior 4, C.P. 76100, Santiago de Querétaro, Querétaro, es el
              responsable del uso y protección de sus datos personales.
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-gray-900 mb-2">Finalidades del Tratamiento de Datos</h2>
            <p className="mb-3">La Empresa recaba y utiliza sus datos personales para los siguientes fines:</p>
            <ul className="space-y-2">
              <li>
                <span className="font-semibold">De carácter laboral:</span> Gestión de reclutamiento, selección, contratación, nómina, cumplimiento de obligaciones fiscales y laborales, y administración del expediente del empleado.
              </li>
              <li>
                <span className="font-semibold">De carácter comercial:</span> Gestión de ventas, logística de exportación, contacto con clientes, proveedores y cumplimiento de obligaciones contractuales.
              </li>
              <li>
                <span className="font-semibold">De seguridad:</span> Mantener la seguridad de las instalaciones y control de acceso.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-base font-bold text-gray-900 mb-2">Datos Personales Recabados</h2>
            <p className="mb-3">Para llevar a cabo las finalidades descritas, se pueden recabar los siguientes datos:</p>
            <ul className="list-disc ml-6 space-y-1">
              <li>Datos de identificación (nombre, dirección, CURP, RFC, INE).</li>
              <li>Datos de contacto (teléfono, correo electrónico).</li>
              <li>Datos laborales y académicos (historial profesional, estudios).</li>
              <li>Datos patrimoniales o financieros (necesarios para el pago de nómina o transacciones comerciales).</li>
            </ul>
          </div>

          <div>
            <h2 className="text-base font-bold text-gray-900 mb-2">Transferencia de Datos</h2>
            <p>
              La Empresa puede compartir sus datos personales con terceros (como instituciones gubernamentales,
              bancos, aseguradoras o aliados logísticos internacionales) únicamente cuando sea estrictamente
              necesario para cumplir con los fines antes mencionados o por requerimiento legal, garantizando
              siempre que los terceros receptores asuman las mismas obligaciones de confidencialidad.
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-gray-900 mb-2">Derechos ARCO (Acceso, Rectificación, Cancelación y Oposición)</h2>
            <p className="mb-3">
              Usted tiene derecho a conocer qué datos personales tenemos, para qué los utilizamos y las
              condiciones del uso que les damos (Acceso). Asimismo, es su derecho solicitar la corrección de su
              información personal si está desactualizada o es inexacta (Rectificación); que la eliminemos de
              nuestros registros (Cancelación), así como oponerse al uso de sus datos para fines específicos (Oposición).
            </p>
            <p>
              Para ejercer estos derechos, deberá enviar una solicitud al correo electrónico:{" "}
              <a href="mailto:admin2@platinumdriveline.mx" className="text-blue-600 underline">
                admin2@platinumdriveline.mx
              </a>{" "}
              con el asunto <span className="font-semibold">"Solicitud de Derechos ARCO"</span>, adjuntando identificación oficial vigente.
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-gray-900 mb-2">Cambios al Aviso de Privacidad</h2>
            <p>
              El presente aviso puede sufrir modificaciones derivadas de nuevos requerimientos legales o
              necesidades de la empresa. Cualquier cambio será publicado en nuestro sitio web o comunicado
              a través de nuestros medios oficiales de contacto.
            </p>
          </div>

        </section>

        <p className="text-xs text-gray-400 mt-12 pt-6 border-t border-gray-100">
          © {new Date().getFullYear()} Platinum Drive Line Mexico S. de R.L. de C.V. — Todos los derechos reservados.
        </p>
      </main>
    </PlatinumLayout>
  );
}

export default Privacidad;
