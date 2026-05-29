type BoletinCardProps = {
  img: string;
  title: string;
  description: string;
};

function BoletinCardPlatinum({ img, title, description }: BoletinCardProps) {
  return (
    <a href={`/download/${img}`} download className="group mb-1">
      <div className="bg-naranja rounded-2xl overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col">
        <img
          src={`/download/${img}`}
          alt={title}
          className="w-full object-cover border-b border-slate-100"
        />
        <div className="px-5 py-5 flex flex-col flex-1">
          <h5 className="font-medium text-white text-lg mb-2">{title}</h5>
          <p className="text-white/80 text-sm leading-relaxed flex-1">{description}</p>
          <p className="text-white text-sm font-semibold mt-4 group-hover:underline">Descargar →</p>
        </div>
      </div>
    </a>
  );
}

export default BoletinCardPlatinum;
