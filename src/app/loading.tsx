export default function Loading() {
  return (
    <div className="absolute top-0 left-0 inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[var(--primary-gray)] to-[var(--deep-purple)]">
      <div className="relative">
        {/* Outer ring */}
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-[var(--steel-blue)]/20"></div>
        {/* Inner spinning gradient */}
        <div className="absolute top-0 left-0 animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-[var(--accent-mint)] border-r-[var(--primary-purple)]"></div>
      </div>
      <div className="mt-4 text-center">
        <h2 className="font-display font-bold text-xl bg-gradient-to-r from-[var(--accent-mint)] to-[var(--primary-purple)] bg-clip-text text-transparent">
          Dockly
        </h2>
        <p className="text-[var(--primary-white)]/80 text-sm mt-1">
          Loading...
        </p>
      </div>
      <p className="sr-only">Loading...</p>
    </div>
  );
}
