// Server component layout for generateStaticParams
// This must be a server component (no "use client")

// Generate static params for static export
// Since tokens are unpredictable, we provide a placeholder
// Client-side routing will handle actual token values
export async function generateStaticParams() {
  // Return placeholder for static export - client-side handles actual tokens
  return [{ id: "token" }];
}

// Layout component - just passes through to the page
export default function UpdatePasswordLayout({ children }) {
  return children;
}

