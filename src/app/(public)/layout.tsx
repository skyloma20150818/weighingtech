import ClientLayout from "../../components/ClientLayout";
import { LanguageProvider } from "../../components/LanguageContext";
import { getContact, getConsult } from "../../lib/data-fetcher";

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [contact, consult] = await Promise.all([
    getContact(),
    getConsult()
  ]);

  return (
    <LanguageProvider>
      <ClientLayout contact={contact} consult={consult}>
        {children}
      </ClientLayout>
    </LanguageProvider>
  );
}
