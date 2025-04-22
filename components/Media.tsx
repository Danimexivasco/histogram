import { useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { PlayIcon, Volume2Icon, VolumeOffIcon } from "lucide-react";
import { Post } from "@/schema/post";
import { isImage, isMedia, isVideo } from "@/lib/utils/mediaCheck";
import useVideoPlayOnScroll from "@/hooks/useVideoPlayOnScroll";
import { Button } from "./ui/Button";

const MotionButton = motion.create(Button);

export default function Media({ media }: {media: Post["media"][number]}) {
  const format = media.split(".").pop();
  const videoRefs = useRef<HTMLVideoElement[]>([]);
  const [mutedMap, setMutedMap] = useState<Record<string, boolean>>({});
  const [pausedMap, setPausedMap] = useState<Record<string, boolean>>({});

  const playVideo = (video: HTMLVideoElement, videoUrl: string) => {
    video?.play();
    setPausedMap((prev) => {
      const updated = {
        ...prev
      };
      delete updated[videoUrl];
      return updated;
    });
  };

  const pauseVideo = (video: HTMLVideoElement, videoUrl: string) => {
    video?.pause();
    setPausedMap((prev) => ({
      ...prev,
      [videoUrl]: video?.paused ?? false
    }));
  };

  useVideoPlayOnScroll({
    videoElements: videoRefs.current,
    playVideo,
    pauseVideo
  });

  const getVideoElement = (videoUrl: string) => {
    return videoRefs.current.find((video) => video.currentSrc.includes(videoUrl));
  };

  const handlePlayState = (videoUrl: string) => {
    const video = getVideoElement(videoUrl);

    if (!video) return null;

    return video?.paused ? playVideo(video, videoUrl) : pauseVideo(video, videoUrl);
  };

  const handleMuted = (videoUrl: string) => {
    const video = getVideoElement(videoUrl);

    if (video) {
      const mutedState = !video.muted;

      video.muted = mutedState;

      setMutedMap((prev) => ({
        ...prev,
        [videoUrl]: mutedState
      }));
    }
  };

  const MuteButton = ({ videoUrl }: { videoUrl: string }) => {
    return (
      <Button
        onClick={() => handleMuted(videoUrl)}
        className="absolute bottom-4 right-4 w-6 h-6 md:w-10 md:h-10 rounded-full z-30"
      >
        {mutedMap[videoUrl] !== false ? <VolumeOffIcon /> : <Volume2Icon />}
      </Button>
    );
  };

  const PlayButton = ({ videoUrl }: { videoUrl: string }) => {
    if (pausedMap[videoUrl]) {
      return (
        <Button
          onClick={() => handlePlayState(videoUrl)}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-85 rounded-full w-24 h-24"
        >
          <PlayIcon className="!w-10 !h-10 drop-shadow-xl" />
        </Button>
      );
    }

    return (
      <AnimatePresence>
        <MotionButton
          key="play-icon"
          initial={{
            scale:   1,
            opacity: 1
          }}
          animate={{
            scale:   1.5,
            opacity: 0
          }}
          exit={{
            opacity: 0
          }}
          transition={{
            duration: 0.6,
            ease:     "easeOut"
          }}
          onClick={() => handlePlayState(videoUrl)}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-85 rounded-full w-24 h-24 cursor-none"
        >
          <PlayIcon className="!w-10 !h-10 drop-shadow-xl" />
        </MotionButton>
      </AnimatePresence>
    );
  };

  if (!isMedia({
    format
  })) return null;

  if (isImage({
    format
  })) return <Image
    src={media}
    alt="Post"
    width={500}
    height={500}
    unoptimized={format === "gif"}
    className="w-full h-full object-cover"
  />;

  if(isVideo({
    format
  })) {
    const videoUrl = media;

    return (
      <div className="relative w-full h-full">
        <video
          ref={(el) => {
            if (el && !videoRefs.current.includes(el)) {
              videoRefs.current.push(el);
            }
          }}
          autoPlay
          muted
          loop
          className="relative w-full h-full object-contain bg-black"
          onClick={() => handlePlayState(videoUrl)}
        >
          <source
            src={videoUrl}
            type={`video/${format}`}
          />
        </video>
        <MuteButton videoUrl={videoUrl} />
        <PlayButton videoUrl={videoUrl} />
      </div>
    );
  };
};