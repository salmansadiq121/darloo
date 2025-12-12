// Server component layout for generateStaticParams
// This must be a server component (no "use client")

// Generate static params for static export
// For static export, return placeholder - actual product IDs handled client-side
export async function generateStaticParams() {
  // Return placeholder for static export - client-side handles actual product IDs
  return [{ id: "product" }];
}

// Layout component - just passes through to the page
export default function ProductDetailLayout({ children }) {
  return children;
}

