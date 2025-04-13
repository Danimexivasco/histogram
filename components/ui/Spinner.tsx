import { SpinnerDotted } from "spinners-react";

export default function Spinner() {
  return (
    <SpinnerDotted
      size={50}
      thickness={100}
      speed={100}
      color="rgba(158, 19, 22, 1)"
    />
  );
}