"use client";

import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import "./styles.css";

const images = ["BANNER_1.jpg", "BANNER_2.jpg", "BANNER_3.jpg", "BANNER_4.jpg"];

export default function App() {
  return (
    <>
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
        {images.map((image) => (
          <SwiperSlide key={image}>
            <img
              quality={60}
              src={`/images/carrousel/${image}`}
              alt="email"
              className="bg-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
}
