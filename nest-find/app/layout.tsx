
import type { Metadata } from "next";
import { Geist, Cal_Sans, Afacad } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import { getServerUser } from "@/lib/auth.server";
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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialUser = await getServerUser();

  return (
    <html lang="en">
      <body className={`${calsans.variable} ${afacad.variable}`}>
        <AuthProvider initialUser={initialUser}>{children}</AuthProvider>
      </body>
    </html>
  );
}