const GalleryImage = ({ image }: { image: string }) => {
  return (
    <article className="w-full sm:w-[48%] lg:w-[31%]">
      <img
        src={`/images/galeria/${image}`}
        alt="Foto Galería"
        className="w-full h-[280px] object-cover rounded-2xl"
      />
    </article>
  );
};

export default GalleryImage;
