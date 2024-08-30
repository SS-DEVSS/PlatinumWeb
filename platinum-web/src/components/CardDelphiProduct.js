import Image from "next/image";

const CardDelphiProduct = ({ image, title }) => {
  return (
    <main className="bg-white rounded-2xl w-full sm:w-[48%] md:w-[31%] flex flex-col items-center">
      <section className="bg-[#F4F4F4] m-4 mb-0 rounded-2xl flex-grow flex items-center justify-center">
        <Image
          quality={60}
          src={`/delphi/${image}.png`}
          alt="Kit"
          width={500}
          height={540}
          className="rounded-2xl max-h-[300px] object-contain"
        />
      </section>
      <p className="text-center font-medium py-7 px-4 lg:px-8 text-lg lg:text-2xl flex-grow">
        {title}
      </p>
    </main>
  );
};

export default CardDelphiProduct;
