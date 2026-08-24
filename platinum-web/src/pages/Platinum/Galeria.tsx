import { useEffect, useState } from "react";
import ContactButton from "../../components/ContactButton";
import GaleriaVideo from "../../components/GaleriaVideo";
import GalleryImage from "../../components/GalleryImage";
import { GaleriaImagenes, GaleriaVideos } from "../../data/galeria";
import { fetchGalleryImages } from "../../services/gallery.api";
import PlatinumLayout from "../../Layouts/PlatinumLayout";

function Galeria() {
  // Arranca con las imágenes estáticas como fallback; se reemplazan por las del
  // backend (personalizables desde el admin) cuando cargan. Si el backend está
  // vacío o caído, se mantienen las estáticas para que el sitio no se vea roto.
  const [images, setImages] = useState<string[]>(GaleriaImagenes);

  useEffect(() => {
    const controller = new AbortController();

    fetchGalleryImages(1, 100, controller.signal)
      .then(({ images: list }) => {
        const urls = (list ?? [])
          .slice()
          .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
          .map((img) => img.imageUrl)
          .filter(Boolean);
        if (urls.length > 0) setImages(urls);
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        console.error("[Galeria] Error loading gallery images:", err);
      });

    return () => controller.abort();
  }, []);

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
          {images.map((imagen) => (
            <GalleryImage key={imagen} image={imagen} />
          ))}
        </section>
      </main>
      <ContactButton />
    </PlatinumLayout>
  );
}

export default Galeria;
