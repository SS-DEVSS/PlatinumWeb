import Image from "next/image";

function BoletinCardDelphi({ img, title, description }) {
  return (
    <main className="rounded-xl text-white bg-naranja border border-slate-300 w-full sm:w-[48%] lg:w-[31%] lg:min-h-[580px] mb-8">
      <a href={`/download/${img}`} download>
        <Image
          quality={100}
          src={`/download/${img}`}
          alt="Kit"
          width={1000}
          height={1000}
          className="border-b w-full rounded-t-xl"
        />
        <section className="px-5 py-4  rounded-b-xl">
          <h5 className="font-medium text-[24px]">{title}</h5>
          <p className="mt-4 mb-4 leading-7">{description}</p>
        </section>
      </a>
    </main>
  );
}

export default BoletinCardDelphi;
