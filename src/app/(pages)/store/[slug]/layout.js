export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;

  if (!slug) {
    return {
      title: "Store - Ayoob Shop",
      description: "Browse products from our sellers",
    };
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/seller/store/${slug}`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      return {
        title: "Store - Ayoob Shop",
        description: "Browse products from our sellers",
      };
    }

    const data = await res.json();

    if (data?.success && data?.seller) {
      const seller = data.seller;
      return {
        title: `${seller.storeName} - Official Store`,
        description: seller.storeDescription || `Shop the best products from ${seller.storeName}. Quality products, fast delivery, and excellent customer service.`,
        keywords: `${seller.storeName}, online store, shop, products, ${seller.storeAddress?.city || ""}, ${seller.storeAddress?.country || ""}`,
        openGraph: {
          title: `${seller.storeName} - Official Store`,
          description: seller.storeDescription || `Shop the best products from ${seller.storeName}`,
          images: [seller.storeBanner || seller.storeLogo || "/og-image.jpg"],
          type: "website",
        },
        twitter: {
          card: "summary_large_image",
          title: `${seller.storeName} - Official Store`,
          description: seller.storeDescription || `Shop the best products from ${seller.storeName}`,
          images: [seller.storeBanner || seller.storeLogo || "/og-image.jpg"],
        },
      };
    }
  } catch (error) {
    console.error("Error fetching store metadata:", error);
  }

  return {
    title: "Store - Ayoob Shop",
    description: "Browse products from our sellers",
  };
}

export default function StoreLayout({ children }) {
  return children;
}
