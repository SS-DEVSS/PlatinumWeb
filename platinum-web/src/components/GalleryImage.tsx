const GalleryImage = ({ image }: { image: string }) => {
  return (
    <article className="w-full sm:w-[48%] lg:w-[31%] mt-3 rounded-lg">
      <img
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
