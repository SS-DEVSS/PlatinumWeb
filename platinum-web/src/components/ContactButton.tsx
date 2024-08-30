import { Link } from "react-router-dom";

const ContactButton = () => {
  return (
    <Link to="https://wa.me/4461385347">
      <section className="bg-[#d87e2e] flex items-center gap-4 rounded-3xl sm:rounded-lg p-3 px-4 fixed bottom-2 right-2 md:bottom-3 md:right-3 z-50 hover:scale-105">
        <img alt="marca" src="/icons/whatsappWhite.png" />
        <h3 className="hidden sm:block hover:underline transition-all text-white font-bold">
          Acude al Soporte Técnico
        </h3>
      </section>
    </Link>
  );
};

export default ContactButton;
