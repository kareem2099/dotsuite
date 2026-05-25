// Banned page has its own isolated layout — no header, no footer, no nav.
// The page itself handles everything.
export default function BannedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
