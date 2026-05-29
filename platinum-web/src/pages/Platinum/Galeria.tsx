import ContactButton from "../../components/ContactButton";
import GaleriaVideo from "../../components/GaleriaVideo";
import GalleryImage from "../../components/GalleryImage";
import { GaleriaImagenes, GaleriaVideos } from "../../data/galeria";
import PlatinumLayout from "../../Layouts/PlatinumLayout";

function Galeria() {
  return (
    <PlatinumLayout>
      <main className="px-6 lg:px-16 xl:px-24 py-12 bg-[#F5F6F8]">
        <h1 className="py-0 pb-8">Videos</h1>
        <section className="flex flex-wrap justify-evenly mb-10 gap-4 w-full">
          {GaleriaVideos.map((video) => (
            <GaleriaVideo key={video} link={video} />
          ))}
        </section>

        <h1 className="pb-8">Imágenes</h1>
        <section className="flex flex-wrap justify-evenly mb-10 gap-4 w-full">
          {GaleriaImagenes.map((imagen) => (
            <GalleryImage key={imagen} image={imagen} />
          ))}
        </section>
      </main>
      <ContactButton />
    </PlatinumLayout>
  );
}

export default Galeria;
