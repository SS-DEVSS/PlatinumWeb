import { Link } from "react-router-dom";

const ContactButton = () => {
  return (
    <Link to="https://wa.me/4461385347" target="_blank">
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-4 bg-naranja hover:bg-orange-500 transition-all shadow-2xl rounded-2xl px-7 py-5">
        <img alt="whatsapp" src="/icons/whatsappWhite.png" className="w-9 h-9" />
        <div className="hidden sm:flex flex-col">
          <span className="text-white font-bold text-lg leading-tight">Soporte Técnico</span>
          <span className="text-white/70 text-sm">Chatea con nosotros</span>
        </div>
      </div>
    </Link>
  );
};

export default ContactButton;
