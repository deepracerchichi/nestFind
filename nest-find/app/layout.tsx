
import type { Metadata } from "next";
import { Geist, Cal_Sans, Afacad } from "next/font/google";
import "./globals.css";

const calsans = Cal_Sans({weight:"400", subsets: ["latin"], variable: "--font-calsans"});
const afacad = Afacad({subsets: ["latin"], variable: "--font-afacad"});

export const metadata: Metadata = {
  title: "nestFind",
  description: "Your app description",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${calsans.variable} ${afacad.variable}`}>
        {children}
      </body>
    </html>
  );
}