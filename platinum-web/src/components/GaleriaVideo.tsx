const GaleriaVideo = ({ link }: { link: string }) => {
  return (
    <article className="w-full sm:w-[48%] lg:w-[31%]">
      <iframe
        className="w-full h-[280px] rounded-2xl"
        src={link}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </article>
  );
};

export default GaleriaVideo;
