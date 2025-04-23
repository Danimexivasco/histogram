import { Volume2Icon, VolumeOffIcon } from "lucide-react";
import { Button } from "./ui/Button";

type MuteButtonProps = {
  videoUrl: string;
  muted: boolean;
  handleMuted: (_videoUrl: string) => void;
};

export default function MuteButton({ videoUrl, muted, handleMuted }: MuteButtonProps) {
  return (
    <Button
      onClick={() => handleMuted(videoUrl)}
      className="absolute bottom-4 right-4 w-6 h-6 md:w-10 md:h-10 rounded-full z-30"
    >
      {muted ? <VolumeOffIcon /> : <Volume2Icon />}
    </Button>
  );
}
