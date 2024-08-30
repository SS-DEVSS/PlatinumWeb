import Image from "next/image";

const GalleryImage = ({ image }) => {
  return (
    <article className="w-full sm:w-[48%] lg:w-[31%] mt-3 rounded-lg">
      <Image
        src={`/images/galeria/${image}`}
        width={700}
        height={500}
        alt="Foto Galeria"
        className="w-full h-[500px] object-cover rounded-lg"
      />
    </article>
  );
};

export default GalleryImage;
