"use client";

export default function LoadingSpinner() {
  return (
    <section className="flex items-center justify-center w-full h-screen bg-white">
      {/* Spinner */}
      <section
        className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-leiden border-t-transparent"
        role="status"
        aria-label="Loading..."
      />
    </section>
  );
}
