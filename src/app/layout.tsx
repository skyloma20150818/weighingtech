import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "../components/ClientLayout";
import { LanguageProvider } from "../components/LanguageContext";
import { getContact, getConsult } from "../lib/data-fetcher";

export const metadata: Metadata = {
  title: "唯英科技",
  description: "唯英科技产品展示",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [contact, consult] = await Promise.all([
    getContact(),
    getConsult()
  ]);

  return (
    <html lang="zh">
      <body>
        <LanguageProvider>
          <ClientLayout contact={contact} consult={consult}>
            {children}
          </ClientLayout>
        </LanguageProvider>
      </body>
    </html>
  );
}
