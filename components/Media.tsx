import { useRef, useState } from "react";
import Image from "next/image";
import { Post } from "@/schema/post";
import { isImage, isMedia, isVideo } from "@/lib/utils/mediaCheck";
import useVideoPlayOnScroll from "@/hooks/useVideoPlayOnScroll";
import PlayButton from "./PlayButton";
import MuteButton from "./MuteButton";

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
        <MuteButton
          videoUrl={videoUrl}
          muted={mutedMap[videoUrl] !== false}
          handleMuted={handleMuted}
        />
        <PlayButton
          videoUrl={videoUrl}
          paused={pausedMap[videoUrl]}
          handlePlayState={handlePlayState}
        />
      </div>
    );
  };
};