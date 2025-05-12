export default function Loading() {
  return (
    <div className="absolute top-0 left-0 inset-0 flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[var(--primary-purple)]"></div>
      <p className="sr-only">Loading...</p>
    </div>
  );
}