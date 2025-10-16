"use client";
import MainLayout from "@/app/components/Layout/Layout";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Building, Users, Award, Globe, Heart, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/app/content/authContent";

const countryList = [
  { code: "US", value: "USD", label: "English (United States)", symbol: "$" },
  { code: "DE", value: "EUR", label: "Germany (Deutschland)", symbol: "€" },
];

export default function AboutUsPage() {
  const { auth, countryCode } = useAuth();
  const isGerman = countryCode === "DE";

  // =============================
  // Static Content (EN / DE)
  // =============================
  const content = {
    title: isGerman ? "Über uns - Darloo" : "About Us - Darloo",
    storyTitle: isGerman ? "Unsere Geschichte" : "Our Story",
    storyPara1: isGerman
      ? "Gegründet im Jahr 2025 begann Darloo E-Commerce als kleines Familienunternehmen mit der Leidenschaft, qualitativ hochwertige Produkte zu erschwinglichen Preisen anzubieten. Was als bescheidener Online-Shop begann, hat sich inzwischen zu einer der vertrauenswürdigsten E-Commerce-Plattformen der Region entwickelt."
      : "Founded in 2025, Darloo E-commerce began as a small family business with a passion for delivering quality products at affordable prices. What started as a modest online store has now grown into one of the region's most trusted e-commerce platforms.",
    storyPara2: isGerman
      ? "Unsere Reise wurde durch unser Engagement für Kundenzufriedenheit, Produktqualität und kontinuierliche Innovation geprägt. Im Laufe der Jahre haben wir unser Produktsortiment erweitert, unsere Dienstleistungen verbessert und eine Gemeinschaft treuer Kunden aufgebaut, die uns für ihre Einkaufserlebnisse vertrauen."
      : "Our journey has been defined by our commitment to customer satisfaction, product quality, and continuous innovation. Through the years, we've expanded our product range, improved our services, and built a community of loyal customers who trust us for their shopping needs.",

    missionVisionTitle: isGerman
      ? "Unsere Mission & Vision"
      : "Our Mission & Vision",
    missionTitle: isGerman ? "Unsere Mission" : "Our Mission",
    missionDesc: isGerman
      ? "Wir bieten ein außergewöhnliches Einkaufserlebnis, indem wir hochwertige Produkte, wettbewerbsfähige Preise und exzellenten Kundenservice anbieten. Unser Ziel ist es, Online-Shopping für alle zugänglich, bequem und angenehm zu gestalten."
      : "To provide an exceptional shopping experience by offering high-quality products, competitive prices, and outstanding customer service. We strive to make online shopping accessible, convenient, and enjoyable for everyone.",
    visionTitle: isGerman ? "Unsere Vision" : "Our Vision",
    visionDesc: isGerman
      ? "Wir möchten die führende E-Commerce-Plattform werden, die für Zuverlässigkeit, Innovation und Kundenorientierung bekannt ist. Unser Ziel ist es, unsere Reichweite weltweit auszubauen und dennoch den persönlichen Touch beizubehalten, der uns von großen Konzernen unterscheidet."
      : "To become the leading e-commerce platform known for reliability, innovation, and customer-centricity. We aim to expand our reach globally while maintaining the personalized touch that sets us apart from larger corporations.",

    valuesTitle: isGerman ? "Unsere Grundwerte" : "Our Core Values",
    values: [
      {
        icon: <Users className="h-8 w-8 text-[#C6080A]" />,
        title: isGerman ? "Kunde zuerst" : "Customer First",
        description: isGerman
          ? "Wir stellen die Bedürfnisse und das Feedback unserer Kunden in den Mittelpunkt all unseres Handelns."
          : "We prioritize our customers' needs and feedback in everything we do.",
      },
      {
        icon: <Award className="h-8 w-8 text-[#C6080A]" />,
        title: isGerman ? "Qualität" : "Quality",
        description: isGerman
          ? "Wir machen keine Kompromisse bei der Qualität der Produkte und Dienstleistungen, die wir anbieten."
          : "We never compromise on the quality of products and services we offer.",
      },
      {
        icon: <Building className="h-8 w-8 text-[#C6080A]" />,
        title: isGerman ? "Integrität" : "Integrity",
        description: isGerman
          ? "Wir führen unser Geschäft mit Ehrlichkeit, Transparenz und ethischen Grundsätzen."
          : "We conduct our business with honesty, transparency, and ethical practices.",
      },
      {
        icon: <TrendingUp className="h-8 w-8 text-[#C6080A]" />,
        title: isGerman ? "Innovation" : "Innovation",
        description: isGerman
          ? "Wir entwickeln uns ständig weiter, um den sich ändernden Marktanforderungen gerecht zu werden."
          : "We continuously evolve and adapt to meet changing market demands.",
      },
      {
        icon: <Heart className="h-8 w-8 text-[#C6080A]" />,
        title: isGerman ? "Leidenschaft" : "Passion",
        description: isGerman
          ? "Wir lieben, was wir tun, und das spiegelt sich in unserer Arbeit wider."
          : "We are passionate about what we do and it reflects in our work.",
      },
      {
        icon: <Globe className="h-8 w-8 text-[#C6080A]" />,
        title: isGerman ? "Nachhaltigkeit" : "Sustainability",
        description: isGerman
          ? "Wir setzen uns für umweltbewusstes und nachhaltiges Wirtschaften ein."
          : "We are committed to environmentally responsible business practices.",
      },
    ],

    offerTitle: isGerman
      ? "Exklusive Angebote nur für Sie ✨"
      : "Exclusive Offers Just for You ✨",
    ctaTitle: isGerman
      ? "Treten Sie der Darloo-Familie bei"
      : "Join the Darloo Family",
    ctaDesc: isGerman
      ? "Egal, ob Sie Kunde, Partner oder Teil unseres Teams werden möchten – wir freuen uns, mit Ihnen in Kontakt zu treten. Entdecken Sie noch heute den Darloo-Unterschied."
      : "Whether you're a customer, partner, or looking to join our team, we'd love to connect with you. Discover the Darloo difference today.",
    contactBtn: isGerman ? "Kontaktieren Sie uns" : "Contact Us",
    productsBtn: isGerman ? "Produkte" : "Products",
  };

  return (
    <MainLayout title={content.title}>
      <div className="min-h-screen bg-gray-50 z-10 relative">
        <div className="container mx-auto py-12 px-4 md:px-6">
          {/* Our Story */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-16">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                {content.storyTitle}
              </h2>
              <p className="text-gray-700 mb-4">{content.storyPara1}</p>
              <p className="text-gray-700">{content.storyPara2}</p>
            </div>
            <div className="relative h-64 md:h-80 rounded-lg overflow-hidden shadow-lg">
              <Image
                src="/3d-rendering-cartoon-shopping-cart (1).jpg?height=400&width=600"
                alt="Darloo E-commerce story"
                fill
                className="object-cover hover:scale-[1.1] transition-all duration-300 cursor-pointer"
              />
            </div>
          </div>

          {/* Mission & Vision */}
          <div className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
              {content.missionVisionTitle}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="border-t-4 border-t-[#C6080A]">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold mb-3">
                    {content.missionTitle}
                  </h3>
                  <p className="text-gray-700">{content.missionDesc}</p>
                </CardContent>
              </Card>
              <Card className="border-t-4 border-t-[#C6080A]">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold mb-3">
                    {content.visionTitle}
                  </h3>
                  <p className="text-gray-700">{content.visionDesc}</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Core Values */}
          <div className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
              {content.valuesTitle}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {content.values.map((value, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6 flex flex-col items-center text-center">
                    <div className="mb-4 p-3 bg-red-50 rounded-full">
                      {value.icon}
                    </div>
                    <h3 className="text-lg font-bold mb-2">{value.title}</h3>
                    <p className="text-gray-700">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Team Section */}
          <div className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
              {content.offerTitle}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
              {[
                {
                  name: "Sarah Khan",
                  position: "Chief Operations Officer",
                  image:
                    "/3d-black-friday-celebration.jpg?height=400&width=400",
                },
                {
                  name: "Michael Chen",
                  position: "Chief Technology Officer",
                  image:
                    "/3d-character-emerging-from-smartphone (1).jpg?height=400&width=400",
                },
                {
                  name: "Priya Sharma",
                  position: "Chief Marketing Officer",
                  image: "/online-shopping-sale-app.jpg?height=400&width=400",
                },
              ].map((member, index) => (
                <div
                  key={index}
                  className="overflow-hidden transition-shadow rounded-lg hover:shadow-lg shadow-red-200"
                >
                  <div className="relative h-64">
                    <Image
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      fill
                      className="object-cover transform transition-transform duration-500 group-hover:scale-[1.2] cursor-pointer"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-r from-[#C6080A] to-[#ff4b4e] rounded-lg p-8 text-white text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              {content.ctaTitle}
            </h2>
            <p className="mb-6 max-w-2xl mx-auto">{content.ctaDesc}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={`/profile/${auth?.user?._id}?tab=support`}
                className="bg-white text-[#C6080A] px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors"
              >
                {content.contactBtn}
              </Link>
              <Link
                href="/products"
                className="bg-transparent border border-white px-6 py-3 rounded-md font-medium hover:bg-white/10 transition-colors"
              >
                {content.productsBtn}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
