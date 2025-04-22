import { useEffect, useRef, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Swiper, SwiperRef, SwiperSlide, useSwiper } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import { Post } from "@/schema/post";
import { Button } from "./ui/Button";
import Media from "./Media";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

type NavigationButtonProps = {
  isVisible: boolean;
};

function SlidePrevButton({ isVisible }: NavigationButtonProps) {
  const swiper = useSwiper();

  return isVisible && (
    <Button
      className="absolute top-1/2 -translate-y-1/2 left-2 md:left-4 w-6 h-6 md:w-10 md:h-10 rounded-full z-50 opacity-85"
      variant={"spartan"}
      onClick={() => swiper.slidePrev()}
    >
      <ChevronLeftIcon strokeWidth={3} />
    </Button>
  );
}

function SlideNextButton({ isVisible }: NavigationButtonProps) {
  const swiper = useSwiper();

  return isVisible && (
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
  const swiperRef = useRef<SwiperRef | null>(null);
  const [isPrevVisible, setIsPrevVisible] = useState(true);
  const [isNextVisible, setIsNextVisible] = useState(true);

  const handleSlideChange = () => {
    const swiper = swiperRef.current?.swiper;
    const isFirstSlide = swiper?.activeIndex === 0;
    const isLastSlide = swiper?.slides && swiper.slides.length - 1 === swiper.activeIndex;

    setIsPrevVisible(!isFirstSlide);
    setIsNextVisible(!isLastSlide);
  };

  useEffect(() => {
    const swiper = swiperRef.current?.swiper;
    swiper?.on("slideChange", handleSlideChange);
    handleSlideChange();

    return () => {
      swiper?.off("slideChange", handleSlideChange);
    };
  }, []);

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
      <SlidePrevButton isVisible={isPrevVisible} />
      <SlideNextButton isVisible={isNextVisible} />
    </Swiper>
  );
}