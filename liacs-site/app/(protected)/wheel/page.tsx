"use client";
import Wheel, { WheelOption } from "../../../components/WheelOfFortune/Wheel";

const options: WheelOption[] = [
  { label: "Niks", odds: 35 },
  { label: "Opnieuw", odds: 35 },
  { label: "Sleutelhanger", odds: 8 },
  { label: "Notitie blok", odds: 5 },
  { label: "Kaarten", odds: 4 },
  { label: "Stickers", odds: 5 },
  { label: "Stress bal", odds: 13},
];

export default function WheelPage() {
  return (
    <section>
      <Wheel options={options} wheelSize={65} />
    </section>
  );
}
