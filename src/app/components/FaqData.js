"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Search,
  ShoppingBag,
  CreditCard,
  Truck,
  Package,
  RefreshCw,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import MainLayout from "./Layout/Layout";
import Link from "next/link";
import { useAuth } from "../content/authContent";

export default function FAQData() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(false);
  const { auth } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");

  // FAQ categories and questions
  const faqCategories = [
    {
      id: "general",
      label: "General",
      icon: <HelpCircle className="h-4 w-4" />,
      questions: [
        {
          id: "what-is-ayoob",
          question: "What is Ayoob E-commerce?",
          answer:
            "Ayoob E-commerce is an online marketplace offering a wide range of products including electronics, fashion, home goods, and more. We pride ourselves on providing quality products, competitive prices, and excellent customer service.",
        },
        {
          id: "create-account",
          question: "How do I create an account?",
          answer:
            "To create an account, click on the 'Sign Up' button in the top right corner of our website. Fill in your details including name, email address, and password. You'll receive a verification email to confirm your account. Once verified, you can start shopping and enjoy the benefits of having an account with us.",
        },
        {
          id: "contact-customer-service",
          question: "How can I contact customer service?",
          answer:
            "You can contact our customer service team through multiple channels: Email us at support@ayoobecommerce.com, call us at +1 (555) 123-4567 during business hours (Monday-Friday, 9am-6pm EST), or use the live chat feature on our website for immediate assistance.",
        },
        {
          id: "countries-ship-to",
          question: "Which countries do you ship to?",
          answer:
            "We currently ship to over 50 countries worldwide including the United States, Canada, most European countries, Australia, and many Asian countries. You can check if we ship to your location during the checkout process or by visiting our Shipping Information page.",
        },
        {
          id: "newsletter-benefits",
          question: "What are the benefits of subscribing to your newsletter?",
          answer:
            "By subscribing to our newsletter, you'll receive exclusive offers, early access to sales, new product announcements, and personalized recommendations. Subscribers also get a 10% discount on their first purchase after signing up.",
        },
      ],
    },
    {
      id: "orders",
      label: "Orders",
      icon: <ShoppingBag className="h-4 w-4" />,
      questions: [
        {
          id: "track-order",
          question: "How can I track my order?",
          answer:
            "You can track your order by logging into your account and navigating to the 'Order History' section. Click on the specific order you want to track, and you'll find the tracking information there. Alternatively, you can use the tracking number provided in your shipping confirmation email on our website or the carrier's website.",
        },
        {
          id: "cancel-order",
          question: "Can I cancel my order?",
          answer:
            "Yes, you can cancel your order if it hasn't been processed for shipping yet. To cancel an order, log into your account, go to 'Order History', find the order you want to cancel, and click the 'Cancel Order' button. If the order has already been processed, you may need to return the item once it arrives.",
        },
        {
          id: "modify-order",
          question: "Can I modify my order after placing it?",
          answer:
            "Order modifications such as changing the shipping address, adding or removing items, or changing payment methods can only be made if the order hasn't been processed yet. Please contact our customer service team as soon as possible if you need to make changes to your order.",
        },
        {
          id: "order-confirmation",
          question: "I didn't receive an order confirmation. What should I do?",
          answer:
            "If you haven't received an order confirmation email within 24 hours of placing your order, please check your spam or junk folder first. If you still can't find it, log into your account to verify that the order was successfully placed. If you see the order in your history but didn't receive an email, contact our customer service team for assistance.",
        },
        {
          id: "guest-order-tracking",
          question: "How do I track my order if I checked out as a guest?",
          answer:
            "If you placed an order as a guest, you can track it using the order tracking number provided in your shipping confirmation email. Go to the 'Track Order' page on our website and enter your order number and the email address you used during checkout.",
        },
      ],
    },
    {
      id: "payments",
      label: "Payments",
      icon: <CreditCard className="h-4 w-4" />,
      questions: [
        {
          id: "payment-methods",
          question: "What payment methods do you accept?",
          answer:
            "We accept various payment methods including credit/debit cards (Visa, Mastercard, American Express, Discover), PayPal, Apple Pay, Google Pay, and bank transfers. In select regions, we also offer buy-now-pay-later options like Klarna and Afterpay.",
        },
        {
          id: "payment-security",
          question: "Is it safe to use my credit card on your website?",
          answer:
            "Yes, our website uses industry-standard SSL/TLS encryption to protect your payment information. We are PCI DSS compliant, which means we follow strict security standards to protect your credit card information. We never store your full credit card details on our servers.",
        },
        {
          id: "currency-conversion",
          question: "Do you charge in different currencies?",
          answer:
            "Yes, we support multiple currencies. You can select your preferred currency from the dropdown menu in the header of our website. Please note that if you pay in a currency different from your card's currency, your bank may apply conversion fees.",
        },
        {
          id: "payment-not-working",
          question: "What should I do if my payment isn't going through?",
          answer:
            "If your payment isn't going through, first check that your payment details are entered correctly. Ensure your card isn't expired and has sufficient funds. If you're still having issues, try using a different payment method or contact your bank to see if they're blocking the transaction. If problems persist, please contact our customer service team for assistance.",
        },
        {
          id: "invoice-receipt",
          question: "How can I get an invoice for my purchase?",
          answer:
            "An electronic invoice is automatically sent to your email address after your order is confirmed. You can also download a copy of your invoice by logging into your account, navigating to 'Order History', and selecting the specific order. If you need a special format or have specific requirements for your invoice, please contact our customer service team.",
        },
      ],
    },
    {
      id: "shipping",
      label: "Shipping",
      icon: <Truck className="h-4 w-4" />,
      questions: [
        {
          id: "shipping-time",
          question: "How long will it take to receive my order?",
          answer:
            "Shipping times vary depending on your location and the shipping method selected. Standard shipping typically takes 3-7 business days for domestic orders and 7-14 business days for international orders. Express shipping options are available at checkout for faster delivery. You can see the estimated delivery date for your specific location during the checkout process.",
        },
        {
          id: "shipping-cost",
          question: "How much does shipping cost?",
          answer:
            "Shipping costs are calculated based on your location, the weight and dimensions of the items, and your chosen shipping method. We offer free standard shipping on orders over $50 for domestic customers. You can see the exact shipping cost for your order during the checkout process before you complete your purchase.",
        },
        {
          id: "order-tracking",
          question: "How do I track my shipment?",
          answer:
            "Once your order ships, you'll receive a shipping confirmation email with a tracking number. You can use this number to track your package on our website under 'Track Order' or directly on the carrier's website. You can also find tracking information in your account under 'Order History'.",
        },
        {
          id: "international-shipping",
          question: "Do you ship internationally?",
          answer:
            "Yes, we ship to over 50 countries worldwide. International customers may be responsible for import duties, taxes, and customs clearance fees, which are not included in the order total. Delivery times for international orders typically range from 7-14 business days, depending on the destination and customs processing.",
        },
        {
          id: "shipping-address-change",
          question: "Can I change my shipping address after placing an order?",
          answer:
            "You can request a shipping address change if your order hasn't been processed for shipping yet. Please contact our customer service team immediately with your order number and the new shipping address. Once an order has been shipped, we cannot change the delivery address.",
        },
      ],
    },
    {
      id: "returns",
      label: "Returns",
      icon: <RefreshCw className="h-4 w-4" />,
      questions: [
        {
          id: "return-policy",
          question: "What is your return policy?",
          answer:
            "We offer a 30-day return policy for most items. Products must be in their original condition with tags attached and original packaging. Some items, such as personal care products and underwear, are not eligible for return due to hygiene reasons. Please visit our Returns & Refunds page for complete details.",
        },
        {
          id: "start-return",
          question: "How do I start a return?",
          answer:
            "To initiate a return, log into your account, go to 'Order History', find the order containing the item you want to return, and click 'Return Items'. Follow the instructions to generate a return label and receive return authorization. If you checked out as a guest, you can use the 'Return an Item' link in your order confirmation email.",
        },
        {
          id: "return-shipping-cost",
          question: "Who pays for return shipping?",
          answer:
            "For standard returns, customers are responsible for return shipping costs unless the return is due to our error (such as sending the wrong item or a defective product). We provide a prepaid return label for defective items or our errors. Return shipping fees are deducted from your refund amount if you use our return label for standard returns.",
        },
        {
          id: "refund-timeline",
          question: "How long does it take to process a refund?",
          answer:
            "Once we receive your returned item, it typically takes 3-5 business days to inspect and process the return. After approval, refunds are issued to your original payment method and may take an additional 5-10 business days to appear in your account, depending on your payment provider's processing times.",
        },
        {
          id: "exchange-process",
          question: "Can I exchange an item instead of returning it?",
          answer:
            "We don't process direct exchanges. Instead, we recommend returning the unwanted item for a refund and placing a new order for the item you want. This ensures you get the replacement item as quickly as possible, rather than waiting for the exchange process to complete.",
        },
      ],
    },
    {
      id: "products",
      label: "Products",
      icon: <Package className="h-4 w-4" />,
      questions: [
        {
          id: "product-quality",
          question: "How do you ensure product quality?",
          answer:
            "We work directly with manufacturers and authorized distributors to ensure all products meet our quality standards. Our quality control team inspects products regularly, and we continuously monitor customer feedback. All products come with the manufacturer's warranty, and we stand behind everything we sell with our satisfaction guarantee.",
        },
        {
          id: "product-authenticity",
          question: "Are your products authentic?",
          answer:
            "Yes, all products sold on Ayoob E-commerce are 100% authentic. We source our products directly from manufacturers or authorized distributors. We do not sell counterfeit or replica items. If you ever question the authenticity of a product you've received, please contact our customer service team immediately.",
        },
        {
          id: "size-guides",
          question: "Where can I find size guides for clothing and shoes?",
          answer:
            "Size guides can be found on individual product pages under the 'Size Guide' tab. We provide detailed measurements and conversion charts for different international sizing standards. If you're between sizes or have specific questions about fit, please contact our customer service team for assistance.",
        },
        {
          id: "product-availability",
          question: "What should I do if a product is out of stock?",
          answer:
            "For out-of-stock items, you can click the 'Notify Me' button on the product page to receive an email when the item is back in stock. Popular items are typically restocked within 2-4 weeks, but some seasonal or limited-edition products may not be restocked.",
        },
        {
          id: "product-specifications",
          question: "Where can I find detailed product specifications?",
          answer:
            "Detailed product specifications are listed on each product page under the 'Specifications' or 'Details' tab. This includes information about materials, dimensions, features, care instructions, and other relevant details. If you need additional information not provided on the product page, please contact our customer service team.",
        },
      ],
    },
  ];

  // Fetch ALl Faq

  const fetchFaqs = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/faq/all`
      );
      setFaqs(data.faqs);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  // Filter questions based on search query
  const filterQuestions = (questions) => {
    if (!searchQuery) return questions;

    return questions.filter(
      (q) =>
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  // Count total questions
  const totalQuestions = faqCategories.reduce(
    (total, category) => total + category.questions.length,
    0
  );

  // Check if any results match the search query
  const hasSearchResults = searchQuery
    ? faqCategories.some(
        (category) => filterQuestions(category.questions).length > 0
      )
    : true;
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-12 px-4 md:px-6">
        {/* Search */}
        <div className="max-w-2xl mx-auto mb-10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search for answers..."
              className="pl-10 py-6 text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {searchQuery
              ? `Showing results for "${searchQuery}"`
              : `Browse through our ${totalQuestions} frequently asked questions`}
          </p>
        </div>

        {/* FAQ Categories */}
        <Tabs defaultValue="general" className="max-w-4xl mx-auto">
          <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-8">
            {faqCategories?.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="flex items-center gap-2"
              >
                {category?.icon}
                <span className="hidden sm:inline">{category?.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {!hasSearchResults && (
            <div className="text-center py-12">
              <h3 className="text-xl font-bold mb-2">No results found</h3>
              <p className="text-gray-600 mb-6">
                We couldn&apos;t find any questions matching &quot;
                {searchQuery}&quot;. Try using different keywords or browse
                through our categories.
              </p>
              <Button
                variant="outline"
                onClick={() => setSearchQuery("")}
                className="bg-[#C6080A] text-white hover:bg-[#a50709] border-none"
              >
                Clear Search
              </Button>
            </div>
          )}

          {faqCategories?.map((category) => {
            const filteredQuestions = filterQuestions(category?.questions);

            return (
              <TabsContent key={category?.id} value={category?.id}>
                <Card>
                  <CardContent className="pt-6">
                    <h2 className="text-2xl font-bold mb-6">
                      {category?.label} Questions
                    </h2>

                    {filteredQuestions?.length > 0 ? (
                      <Accordion
                        type="single"
                        collapsible
                        className="space-y-4"
                      >
                        {filteredQuestions.map((faq) => (
                          <AccordionItem
                            key={faq.id}
                            value={faq.id}
                            className="border rounded-lg px-4"
                          >
                            <AccordionTrigger className="text-left font-medium py-4">
                              {faq?.question}
                            </AccordionTrigger>
                            <AccordionContent className="pb-4 text-gray-700">
                              {faq?.answer}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    ) : searchQuery ? (
                      <p className="text-gray-500 py-4">
                        No questions found in this category matching &quot;
                        {searchQuery}&quot;
                      </p>
                    ) : (
                      <p className="text-gray-500 py-4">
                        No questions available in this category
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            );
          })}
        </Tabs>

        {/* Still Need Help Section */}
        <div className="max-w-4xl mx-auto mt-16">
          <div className="bg-gradient-to-r from-[#C6080A] to-[#ff4b4e] rounded-lg p-8 text-white text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Still Need Help?
            </h2>
            <p className="mb-6 max-w-2xl mx-auto">
              Can&apos;t find the answer you&apos;re looking for? Our customer
              service team is here to help you with any questions or concerns.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={
                  auth.user
                    ? `/profile/${auth?.user?._id}?tab=support`
                    : "/authentication"
                }
                className={`bg-white text-[#C6080A] px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors ${
                  auth.user ? "cursor-pointer" : "cursor-not-allowed"
                }`}
              >
                Contact Support
              </Link>
              <Link
                href={
                  auth.user
                    ? `/profile/${auth?.user?._id}?tab=chat`
                    : "/authentication"
                }
                className={`bg-transparent border border-white px-6 py-3 rounded-md font-medium hover:bg-white/10 transition-colors ${
                  auth.user ? "cursor-pointer" : "cursor-not-allowed"
                }`}
              >
                Start Live Chat
              </Link>
            </div>
          </div>
        </div>

        {/* FAQ Submission */}
        {/* <div className="max-w-2xl mx-auto mt-16 text-center">
            <h2 className="text-2xl font-bold mb-2">Have a Question?</h2>
            <p className="text-gray-600 mb-6">
              If you can&apos;t find your question in our FAQ, you can submit it
              here and we&apos;ll get back to you.
            </p>
            <Button className="bg-[#C6080A] hover:bg-[#a50709]">
              Submit a Question
            </Button>
          </div> */}
      </div>
    </div>
  );
}
