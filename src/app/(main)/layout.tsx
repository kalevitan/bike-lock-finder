import Header from "@/components/header/Header";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-10rem)] mt-20 px-6 md:px-12 md:py-16 overflow-y-auto">
        {children}
      </main>
      <footer className="text-center py-6 text-neutral-500 text-sm">
        © {currentYear} BikeLock Finder. All rights reserved.
      </footer>
    </>
  );
}