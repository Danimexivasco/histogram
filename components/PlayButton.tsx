import { AnimatePresence, motion } from "framer-motion";
import { PlayIcon } from "lucide-react";
import { Button } from "./ui/Button";

type PlayButtonProsp = {
  videoUrl: string;
  paused: boolean;
  handlePlayState: (_videoUrl: string) => void
};

const MotionButton = motion.create(Button);

export default function PlayButton({ videoUrl, paused = false, handlePlayState }: PlayButtonProsp) {
  if (paused) {
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
}