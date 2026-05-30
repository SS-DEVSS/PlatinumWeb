type BrandCardProps = {
  image: string;
  text: string;
  brand: string;
  link: string;
  text_button: string;
};

const BrandCard = ({ image, text, brand, link, text_button }: BrandCardProps) => {
  const getAccent = () => {
    switch (text) {
      case "Pastillas de Freno":
      case "Pastilla de Freno":
        return { color: "text-red-500", bg: "bg-red-500 hover:bg-red-600" };
      case "Sistema de Embrague": return { color: "text-naranja", bg: "bg-naranja hover:bg-orange-500" };
      case "Suspensión": return { color: "text-azul_delphi", bg: "bg-azul_delphi hover:bg-blue-600" };
      default: return { color: "text-naranja", bg: "bg-naranja hover:bg-orange-500" };
    }
  };

  const accent = getAccent();

  return (
    <article className="flex flex-col flex-grow 2xl:mb-20 bg-white rounded-2xl overflow-hidden shadow-md border border-slate-100 transition-shadow hover:shadow-lg">
      <div className="w-full bg-slate-50 flex items-center justify-center px-6 pt-8 pb-4">
        <img
          alt={text}
          className="h-[260px] object-contain"
          src={`/images/cajas/${image}.png`}
        />
      </div>
      <section className="px-8 py-6 flex flex-col flex-grow border-t border-slate-100">
        <p className={`text-xs font-semibold uppercase tracking-widest ${accent.color} mb-2`}>{brand}</p>
        <p className="text-gray-900 text-2xl font-semibold flex-grow">{text}</p>
        <a href={`/${link}`} className="mt-6">
          <button className={`${accent.bg} w-full py-3 rounded-xl text-white font-medium text-sm transition-colors`}>
            {text_button}
          </button>
        </a>
      </section>
    </article>
  );
};

export default BrandCard;
