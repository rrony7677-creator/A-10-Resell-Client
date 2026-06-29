"use client";

import Image from "next/image";
import Link from "next/link";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { motion } from "motion/react";

const slides = [
  {
    title: "Buy & Sell Pre-Owned Products with Confidence",
    description:
      "Discover quality second-hand products at unbeatable prices. Sell what you no longer need and earn money safely on ResellHub.",
    image: "/asset/banner1.jpg",
    primaryBtn: "Explore Products",
    primaryLink: "/products",
    secondaryBtn: "Start Selling",
    secondaryLink: "/dashboard/seller/add-product",
  },
  {
    title: "Turn Your Unused Items into Cash",
    description:
      "List products in minutes, connect with genuine buyers, and enjoy a trusted marketplace built for everyone.",
    image: "/asset/banner2.jpg",
    primaryBtn: "Sell Now",
    primaryLink: "/dashboard/add-product",
    secondaryBtn: "Learn More",
    secondaryLink: "/about",
  },
  {
    title: "Shop Smart. Save More.",
    description:
      "Find electronics, furniture, fashion, vehicles and much more from verified sellers across the country.",
    image: "/asset/banner3.jpg",
    primaryBtn: "Browse Categories",
    primaryLink: "/categories",
    secondaryBtn: "Contact Us",
    secondaryLink: "/contact",
  },
];

export default function Banner() {
  return (
    <section className="w-full">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{
          delay: 4500,
          disableOnInteraction: false,
        }}
        loop
        className="h-[500px] md:h-162.5"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative h-125 md:h-162.5 w-full">
              {/* Background Image */}

              <Image
                src={slide.image}
                alt={slide.title}
                fill
                priority={index === 0}
                className="object-cover"
              />

              {/* Overlay */}

              <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/60 to-black/30" />

              {/* Content */}

              <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-6">
                <div className="max-w-2xl">
                  
                  {/* Animated Badge */}
                  <motion.span
                    className="inline-block rounded-full border border-cyan-400/30 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-300"
                    animate={{ x: [0, 60, 0] }} // Loop movement sequence: start -> right 15px -> back
                    transition={{
                      duration: 3,          // Time taken for a full animation sequence
                      repeat: Infinity,     // Forces infinite looping
                      ease: "easeInOut",    // Smooth starting and ending velocity curves
                    }}
                  >
                    Trusted Marketplace
                  </motion.span>

                  <h1 className="mt-6 text-4xl font-extrabold leading-tight text-white md:text-6xl">
                    {slide.title}
                  </h1>

                  <p className="mt-6 text-lg leading-8 text-gray-200">
                    {slide.description}
                  </p>

                  <div className="mt-10 flex flex-wrap gap-4">
                    <Link
                      href={slide.primaryLink}
                      className="rounded-lg bg-blue-600 px-7 py-3 font-semibold text-white transition hover:bg-blue-700"
                    >
                      {slide.primaryBtn}
                    </Link>

                    <Link
                      href={slide.secondaryLink}
                      className="rounded-lg border border-white/30 bg-white/10 px-7 py-3 font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
                    >
                      {slide.secondaryBtn}
                    </Link>
                  </div>

                  {/* Statistics */}

                  <div className="mt-12 grid grid-cols-3 gap-6 text-white">
                    <div>
                      <h2 className="text-3xl font-bold text-cyan-400">15K+</h2>
                      <p className="mt-1 text-sm text-gray-300">Products</p>
                    </div>

                    <div>
                      <h2 className="text-3xl font-bold text-cyan-400">8K+</h2>
                      <p className="mt-1 text-sm text-gray-300">Sellers</p>
                    </div>

                    <div>
                      <h2 className="text-3xl font-bold text-cyan-400">99%</h2>
                      <p className="mt-1 text-sm text-gray-300">Happy Buyers</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}