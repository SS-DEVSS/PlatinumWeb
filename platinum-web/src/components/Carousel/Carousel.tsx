import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import "./styles.css";
import { fetchBanners } from "../../services/banners.api";
import { Banner } from "../../models/banner";

const FALLBACK_IMAGES = ["BANNER_1.jpg"];

const HERO_PLACEHOLDER_SRC = "/images/carrousel/BANNER_1.jpg";

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

  if (loading) {
    return (
      <img
        src={HERO_PLACEHOLDER_SRC}
        alt="Banner promocional Platinum Driveline"
        className="block w-full"
        loading="eager"
        fetchPriority="high"
      />
    );
  }

  const slidesFromApi = !useFallback && banners.length > 0;
  const slideCount = slidesFromApi ? banners.length : FALLBACK_IMAGES.length;
  const enableCarouselMotion = slideCount > 1;

  return (
    <Swiper
      className="mySwiper"
      modules={[Autoplay, Pagination, Navigation]}
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
      pagination={{ clickable: true }}
      navigation={enableCarouselMotion}
      breakpoints={{
        768: {
          spaceBetween: 30,
          centeredSlides: true,
        },
      }}
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
                  <img
                    src={banner.desktopUrl}
                    alt={alt}
                    className="block w-full"
                    loading="lazy"
                  />
                </picture>
              </SwiperSlide>
            );
          })
        : FALLBACK_IMAGES.map((image) => (
            <SwiperSlide key={image}>
              <img
                src={`/images/carrousel/${image}`}
                alt="Banner promocional Platinum Driveline"
                className="block w-full"
                loading="lazy"
              />
            </SwiperSlide>
          ))}
    </Swiper>
  );
}
