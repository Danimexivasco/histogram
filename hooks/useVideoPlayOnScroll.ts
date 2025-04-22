import { useEffect } from "react";

type UseVideoPlayOnScrollProps = {
  videoElements: HTMLVideoElement[];
  threshold?: number;
  playVideo: (_video: HTMLVideoElement, _videoUrl: string) => void;
  pauseVideo: (_video: HTMLVideoElement, _videoUrl: string) => void;
};

const useVideoPlayOnScroll = ({ videoElements, threshold = 0.75, playVideo, pauseVideo }: UseVideoPlayOnScrollProps) => {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const video = entry.target as HTMLVideoElement;
        const videoUrl = video.currentSrc;

        if (entry.isIntersecting) {
          playVideo(video, videoUrl);
        } else {
          pauseVideo(video, videoUrl);
        }
      });
    }, {
      threshold: threshold
    });

    videoElements.forEach((video) => observer.observe(video));

    return () => {

      observer.disconnect();
    };
  }, [videoElements, threshold]);
};

export default useVideoPlayOnScroll;
