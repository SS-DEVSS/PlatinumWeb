const GalleryImage = ({ image }: { image: string }) => {
  // Acepta una URL completa (del backend) o un nombre de archivo local (fallback estático).
  const src = /^https?:\/\//.test(image) ? image : `/images/galeria/${image}`;

  return (
    <article className="w-full sm:w-[48%] lg:w-[31%]">
      <img
        src={src}
        alt="Foto Galería"
        className="w-full h-[280px] object-cover rounded-2xl"
        loading="lazy"
      />
    </article>
  );
};

export default GalleryImage;
