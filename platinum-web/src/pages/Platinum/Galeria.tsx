import ContactButton from "../../components/ContactButton";
import GaleriaVideo from "../../components/GaleriaVideo";
import GalleryImage from "../../components/GalleryImage";
import { GaleriaImagenes, GaleriaVideos } from "../../data/galeria";
import PlatinumLayout from "../../Layouts/PlatinumLayout";

function Galeria() {
  return (
    <PlatinumLayout>
      <main className="flex flex-col items-center">
        <h1 className="py-6 lg:py-9">Videos</h1>

        <section className="flex flex-wrap justify-evenly mb-5 px-4 gap-2 mx-auto w-full">
          {GaleriaVideos.map((video) => (
            <GaleriaVideo key={video} link={video} />
          ))}
        </section>

        <h1 className="py-6">Imágenes</h1>

        <section className="flex flex-wrap justify-evenly mb-5 px-4 gap-2 mx-auto w-full">
          {GaleriaImagenes.map((imagen) => (
            <GalleryImage key={imagen} image={imagen} />
          ))}
        </section>
        <ContactButton />
      </main>
    </PlatinumLayout>
  );
}

export default Galeria;
