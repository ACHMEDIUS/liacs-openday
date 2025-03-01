"use client";
import Wheel, { WheelOption } from "../../../components/WheelOfFortune/Wheel";

const options: WheelOption[] = [
  { label: "Niks", odds: 35 },
  { label: "Opnieuw", odds: 35 },
  { label: "Pen", odds: 10 },
  { label: "Beker", odds: 10 },
  { label: "T-Shirt", odds: 10 },
];

export default function WheelPage() {
  return (
    <section>
      <Wheel options={options} wheelSize={65} />
    </section>
  );
}
