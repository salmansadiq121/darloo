// Server component layout for generateStaticParams
// This must be a server component (no "use client")

// Generate static params for static export
// For static export, return placeholder - actual product IDs handled client-side
export async function generateStaticParams() {
  // Return placeholder for static export - client-side handles actual product IDs
  // The key must match the dynamic segment name [id]
  return [{ id: "product" }];
}

// Allow dynamic params at runtime (client-side will handle other IDs)
export const dynamicParams = true;

// Layout component - just passes through to the page
export default function ProductDetailLayout({ children }) {
  return children;
}
