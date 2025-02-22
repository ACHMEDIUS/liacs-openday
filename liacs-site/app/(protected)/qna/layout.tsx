import ProtectedClientLayout from "../client-layout";

export default function QnaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedClientLayout>{children}</ProtectedClientLayout>;
}
