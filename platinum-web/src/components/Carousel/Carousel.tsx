import { useEffect, useMemo, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import "./styles.css";
import { fetchBanners } from "../../services/banners.api";
import { Banner } from "../../models/banner";

const FALLBACK_IMAGES = ["BANNER_1.jpg", "BANNER_2.jpg", "BANNER_3.jpg", "BANNER_4.jpg"];

/** Primer banner local: se muestra al instante mientras llega la API */
const HERO_PLACEHOLDER: Banner = {
  id: "hero-placeholder",
  desktopUrl: "/images/carrousel/BANNER_1.jpg",
  mobileUrl: "/images/carrousel/BANNER_1.jpg",
  altText: "Banner promocional Platinum Driveline",
};

function BannerSlide({
  banner,
  eager,
}: {
  banner: Banner;
  eager?: boolean;
}) {
  const alt =
    (banner.altText && banner.altText.trim()) ||
    (banner.title && banner.title.trim()) ||
    "Banner promocional Platinum Driveline";

  return (
    <SwiperSlide>
      <picture>
        <source media="(max-width: 767px)" srcSet={banner.mobileUrl} />
        <img
          src={banner.desktopUrl}
          alt={alt}
          className="h-auto w-full"
          loading={eager ? "eager" : "lazy"}
          fetchPriority={eager ? "high" : undefined}
        />
      </picture>
    </SwiperSlide>
  );
}

export default function Carousel() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    fetchBanners(1, 50, controller.signal)
      .then(({ banners: list }) => {
        const next = (list ?? [])
          .slice()
          .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
        if (next.length === 0) {
          setUseFallback(true);
          setBanners([]);
        } else {
          setUseFallback(false);
          setBanners(next);
        }
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        console.error("[Carousel] Error loading banners:", err);
        setUseFallback(true);
        setBanners([]);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, []);

  const slides = useMemo(() => {
    if (loading) return [HERO_PLACEHOLDER];
    if (!useFallback && banners.length > 0) return banners;
    return FALLBACK_IMAGES.map((file, index) => ({
      id: `fallback-${index}`,
      desktopUrl: `/images/carrousel/${file}`,
      mobileUrl: `/images/carrousel/${file}`,
      altText: "Banner promocional Platinum Driveline",
    }));
  }, [loading, useFallback, banners]);

  const slideCount = slides.length;
  const enableCarouselMotion = !loading && slideCount > 1;
  const swiperKey = loading
    ? "placeholder"
    : useFallback
      ? "fallback"
      : `api-${slides.map((s) => s.id).join("-")}`;

  return (
    <div className="w-full overflow-hidden">
    <Swiper
      key={swiperKey}
      slidesPerView={1}
      spaceBetween={0}
      centeredSlides={false}
      loop={enableCarouselMotion}
      watchSlidesProgress={enableCarouselMotion}
      autoplay={
        enableCarouselMotion
          ? {
              delay: 4500,
              disableOnInteraction: false,
            }
          : false
      }
      pagination={{
        clickable: true,
      }}
      navigation={enableCarouselMotion}
      modules={[Autoplay, Pagination, Navigation]}
      className="mySwiper"
    >
      {slides.map((banner, index) => (
        <BannerSlide
          key={banner.id}
          banner={banner}
          eager={loading && index === 0}
        />
      ))}
    </Swiper>
    </div>
  );
}
