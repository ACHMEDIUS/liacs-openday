import ProtectedClientLayout from "../client-layout";

export default function InteractiveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedClientLayout>{children}</ProtectedClientLayout>;
}
