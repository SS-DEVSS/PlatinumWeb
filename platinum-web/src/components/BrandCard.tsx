type BrandCardProps = {
  image: string;
  text: string;
  brand: string;
  link: string;
  text_button: string;
};

const BrandCard = ({
  image,
  text,
  brand,
  link,
  text_button,
}: BrandCardProps) => {
  const getColor = () => {
    switch (text) {
      case "Suspensión":
        return "azul_delphi";
      case "Pastilla de Freno":
        return "azul_pastillas";
      case "Sistema de Embrague":
        return "naranja";
      default:
        "";
    }
  };
  const getColorHover = () => {
    switch (text) {
      case "Pastilla de Freno":
        return "bg-red-500";
      case "Componente Embrague":
        return "bg-orange-400";
      case "Suspensión":
        return "bg-blue-500";
      default:
        "";
    }
  };

  return (
    <article className="border border-slate-300 rounded-lg shadow flex flex-col flex-grow 2xl:mb-20">
      <div className="w-full bg-white">
        <img
          alt="marca"
          className="h-[300px] p-4 mx-auto my-3 rounded-t-lg"
          src={`/images/cajas/${image}.png`}
        />
      </div>
      <section className="px-10 py-6 border-t-2 bg-slate-200 flex flex-col flex-grow">
        <p className="text-black text-4xl my-4 flex-grow">{text}</p>
        <p className={`font-bold text-${getColor()}`}>{brand}</p>
        <a href={`/${link}`}>
          <button
            className={`rounded-lg bg-${getColor()} w-full py-4 mt-8 text-white hover:${getColorHover()}`}
          >
            {text_button}
          </button>
        </a>
      </section>
    </article>
  );
};

export default BrandCard;
