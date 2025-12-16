export async function generateStaticParams() {
  return [{ id: "product" }];
}

export const dynamicParams = true;

// Layout component - just passes through to the page
export default function ProductDetailLayout({ children }) {
  return children;
}
