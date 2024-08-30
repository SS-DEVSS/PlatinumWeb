const GaleriaVideo = ({ link }) => {
  return (
    <article className="w-full sm:w-[48%] lg:w-[31%] mt-3">
      <iframe
        className="w-full h-[400px] object-cover rounded-lg"
        width="560"
        height="315"
        src={link}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </article>
  );
};

export default GaleriaVideo;
