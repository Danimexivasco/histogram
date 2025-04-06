import { SpinnerDotted } from "spinners-react";

export default function Spinner() {
  return (
    <SpinnerDotted
      size={50}
      thickness={100}
      speed={100}
      color="rgba(172, 57, 59, 1)"
    />
  );
}