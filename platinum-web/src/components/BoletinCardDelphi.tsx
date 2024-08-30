type BoletinCardDelphi = {
  img: string;
  title: string;
  href: string;
};

function BoletinCardDelphi({ img, title, href }: BoletinCardDelphi) {
  return (
    <a
      href={`${href}`}
      download
      className="bg-white rounded-xl flex flex-col items-center"
    >
      <section className="flex-shrink-0">
        <img
          src={`/${img}`}
          alt="Kit"
          width={550}
          height={400}
          className="w-full h-full rounded-t-xl object-contain border-b-2"
        />
      </section>
      <h5 className="p-4 lg:p-6 text-center flex-grow flex flex-col justify-center text-black">
        {title}
      </h5>
    </a>
  );
}

export default BoletinCardDelphi;
