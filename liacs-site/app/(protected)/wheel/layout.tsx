import ProtectedClientLayout from "../client-layout";

export default function WheelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedClientLayout>{children}</ProtectedClientLayout>;
}
