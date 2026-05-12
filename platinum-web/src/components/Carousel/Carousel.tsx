import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import "./styles.css";
import { fetchBanners } from "../../services/banners.api";
import { Banner } from "../../models/banner";

const FALLBACK_IMAGES = ["BANNER_1.jpg", "BANNER_2.jpg", "BANNER_3.jpg", "BANNER_4.jpg"];

export default function Carousel() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    fetchBanners(1, 50, controller.signal)
      .then(({ banners: list }) => {
        const next = (list ?? []).slice().sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
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

  const slidesFromApi = !useFallback && banners.length > 0;

  if (loading) {
    return (
      <div
        className="w-full bg-muted animate-pulse rounded-none"
        style={{ aspectRatio: "21 / 9", minHeight: "160px" }}
        aria-busy="true"
        aria-label="Cargando banners"
      />
    );
  }

  return (
    <Swiper
      spaceBetween={30}
      centeredSlides={true}
      autoplay={{
        delay: 4500,
        disableOnInteraction: false,
      }}
      pagination={{
        clickable: true,
      }}
      navigation={true}
      modules={[Autoplay, Pagination, Navigation]}
      className="mySwiper"
    >
      {slidesFromApi
        ? banners.map((banner) => {
            const alt =
              (banner.altText && banner.altText.trim()) ||
              (banner.title && banner.title.trim()) ||
              "Banner promocional Platinum Driveline";
            return (
              <SwiperSlide key={banner.id}>
                <picture>
                  <source media="(max-width: 767px)" srcSet={banner.mobileUrl} />
                  <img src={banner.desktopUrl} alt={alt} className="bg-cover" loading="lazy" />
                </picture>
              </SwiperSlide>
            );
          })
        : FALLBACK_IMAGES.map((image) => (
            <SwiperSlide key={image}>
              <img
                src={`/images/carrousel/${image}`}
                alt=""
                className="bg-cover"
                loading="lazy"
              />
            </SwiperSlide>
          ))}
    </Swiper>
  );
}
