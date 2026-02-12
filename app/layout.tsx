import "@/app/ui/global.css"
import { interFont } from "./ui/fonts";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${interFont.className} antialiased`}>{children}</body>
    </html>
  );
}
