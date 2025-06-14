import RequireVerification from "@/components/auth/RequireVerification";
import Header from "@/components/header/Header";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentYear = new Date().getFullYear();

  return (
    <RequireVerification>
      <div className="flex flex-col h-screen">
        <Header />
        <main className="flex-1 mt-20 px-8 md:px-12 md:py-16 overflow-y-auto">
          {children}
        </main>
        <footer className="text-center py-6 text-neutral-500 text-sm">
          © {currentYear} BikeLock Finder. All rights reserved.
        </footer>
      </div>
    </RequireVerification>
  );
}
