import { useRef } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import { Post } from "@/schema/post";
import { Button } from "./ui/Button";
import Media from "./Media";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

function SlidePrevButton() {
  const swiper = useSwiper();

  return (
    <Button
      className="absolute top-1/2 -translate-y-1/2 left-2 md:left-4 w-6 h-6 md:w-10 md:h-10 rounded-full z-50 opacity-85"
      variant={"spartan"}
      onClick={() => swiper.slidePrev()}
    >
      <ChevronLeftIcon strokeWidth={3} />
    </Button>
  );
}

function SlideNextButton() {
  const swiper = useSwiper();

  return (
    <Button
      className="absolute top-1/2 -translate-y-1/2 right-2 md:right-4 w-6 h-6 md:w-10 md:h-10 rounded-full z-50 opacity-85"
      variant={"spartan"}
      onClick={() => swiper.slideNext()}
    >
      <ChevronRightIcon strokeWidth={3} />
    </Button>
  );
}

export default function Carousel({ mediaItems }: {mediaItems: Post["media"]}) {
  const swiperRef = useRef(null);

  return mediaItems && (
    <Swiper
      centeredSlides={true}
      slidesPerView={1}
      touchRatio={1}
      threshold={0}
      speed={300}
      shortSwipes={true}
      simulateTouch={true}
      longSwipes={false}
      className="relative w-full h-full"
      modules={[Pagination, Navigation]}
      pagination={{
        clickable: true
      }}
      ref={swiperRef}

    >
      {mediaItems?.map((media, idx) => (
        <SwiperSlide
          key={idx}
          className="w-full h-full"
        >
          <Media media={media} />
        </SwiperSlide>
      ))}
      <SlidePrevButton />
      <SlideNextButton />
    </Swiper>
  );
}