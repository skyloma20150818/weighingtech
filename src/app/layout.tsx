import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const alibabaPuHuiTi = localFont({
  src: [
    {
      path: "../../public/fonts/AlibabaPuHuiTi-2-55-Regular.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/AlibabaPuHuiTi-3-45-Light.woff",
      weight: "300",
      style: "normal",
    },
  ],
  variable: "--font-alibaba",
  display: "swap",
});

export const metadata: Metadata = {
  title: "唯英科技",
  description: "唯英科技产品展示",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh" suppressHydrationWarning>
      <body className={`${alibabaPuHuiTi.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
