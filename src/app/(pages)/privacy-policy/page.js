"use client";
import MainLayout from "@/app/components/Layout/Layout";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Lock, Eye, FileText, Database, Bell } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <MainLayout title="Privacy Policy - Ayoob">
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto py-12 px-4 md:px-6">
          {/* Last Updated */}
          <div className="mb-8 text-right">
            <p className="text-gray-500">Last Updated: April 14, 2025</p>
          </div>

          {/* Introduction */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-red-50 rounded-full">
                  <Shield className="h-6 w-6 text-[#C6080A]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-3">Introduction</h2>
                  <p className="text-gray-700 mb-4">
                    At Ayoob E-commerce (&quot;we&quot;, &quot;our&quot;, or
                    &quot;us&quot;), we respect your privacy and are committed
                    to protecting your personal data. This privacy policy will
                    inform you about how we look after your personal data when
                    you visit our website and tell you about your privacy rights
                    and how the law protects you.
                  </p>
                  <p className="text-gray-700">
                    This privacy policy applies to all information collected
                    through our website, mobile application, and any related
                    services, sales, marketing, or events (collectively, the
                    &quot;Services&quot;).
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Information We Collect */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-red-50 rounded-full">
                  <Database className="h-6 w-6 text-[#C6080A]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-3">
                    Information We Collect
                  </h2>
                  <p className="text-gray-700 mb-4">
                    We collect several types of information from and about users
                    of our Services, including:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                    <li>
                      <span className="font-medium">Personal Identifiers:</span>{" "}
                      Name, email address, postal address, phone number, and
                      other similar identifiers.
                    </li>
                    <li>
                      <span className="font-medium">Account Information:</span>{" "}
                      Username, password, purchase history, and account
                      preferences.
                    </li>
                    <li>
                      <span className="font-medium">
                        Financial Information:
                      </span>{" "}
                      Credit card numbers, bank account details, and billing
                      addresses.
                    </li>
                    <li>
                      <span className="font-medium">Technical Data:</span> IP
                      address, browser type and version, time zone setting,
                      browser plug-in types and versions, operating system and
                      platform, and other technology on the devices you use to
                      access our Services.
                    </li>
                    <li>
                      <span className="font-medium">Usage Data:</span>{" "}
                      Information about how you use our website, products, and
                      services.
                    </li>
                  </ul>
                  <p className="text-gray-700">
                    We collect this information when you register on our site,
                    place an order, subscribe to our newsletter, respond to a
                    survey, fill out a form, or otherwise interact with our
                    Services.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* How We Use Your Information */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-red-50 rounded-full">
                  <Eye className="h-6 w-6 text-[#C6080A]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-3">
                    How We Use Your Information
                  </h2>
                  <p className="text-gray-700 mb-4">
                    We use the information we collect about you for various
                    purposes, including:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                    <li>To provide and maintain our Services</li>
                    <li>To process and fulfill your orders</li>
                    <li>To manage your account and provide customer support</li>
                    <li>
                      To send you order confirmations, updates, and security
                      alerts
                    </li>
                    <li>
                      To respond to your comments, questions, and requests
                    </li>
                    <li>
                      To personalize your experience and deliver content and
                      product offerings relevant to your interests
                    </li>
                    <li>To improve our website, products, and services</li>
                    <li>
                      To administer promotions, contests, surveys, or other site
                      features
                    </li>
                    <li>To protect our Services, users, and the public</li>
                    <li>To comply with legal obligations</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Information Sharing */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-red-50 rounded-full">
                  <FileText className="h-6 w-6 text-[#C6080A]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-3">
                    Information Sharing and Disclosure
                  </h2>
                  <p className="text-gray-700 mb-4">
                    We may share your personal information in the following
                    situations:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                    <li>
                      <span className="font-medium">Service Providers:</span> We
                      may share your information with third-party vendors,
                      service providers, contractors, or agents who perform
                      services for us.
                    </li>
                    <li>
                      <span className="font-medium">Business Transfers:</span>{" "}
                      We may share or transfer your information in connection
                      with, or during negotiations of, any merger, sale of
                      company assets, financing, or acquisition of all or a
                      portion of our business.
                    </li>
                    <li>
                      <span className="font-medium">Legal Requirements:</span>{" "}
                      We may disclose your information where required to do so
                      by law or in response to valid requests by public
                      authorities.
                    </li>
                    <li>
                      <span className="font-medium">With Your Consent:</span> We
                      may disclose your personal information for any other
                      purpose with your consent.
                    </li>
                  </ul>
                  <p className="text-gray-700">
                    We do not sell, trade, or otherwise transfer your personally
                    identifiable information to outside parties without your
                    consent, except as described above.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Security */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-red-50 rounded-full">
                  <Lock className="h-6 w-6 text-[#C6080A]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-3">Data Security</h2>
                  <p className="text-gray-700 mb-4">
                    We have implemented appropriate technical and organizational
                    security measures designed to protect the security of any
                    personal information we process. However, despite our
                    safeguards and efforts to secure your information, no
                    electronic transmission over the Internet or information
                    storage technology can be guaranteed to be 100% secure.
                  </p>
                  <p className="text-gray-700">
                    We regularly monitor our systems for possible
                    vulnerabilities and attacks and regularly review our
                    information collection, storage, and processing practices to
                    update our physical, technical, and organizational security
                    measures.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Your Rights */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-red-50 rounded-full">
                  <Bell className="h-6 w-6 text-[#C6080A]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-3">
                    Your Privacy Rights
                  </h2>
                  <p className="text-gray-700 mb-4">
                    Depending on your location, you may have certain rights
                    regarding your personal information, including:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                    <li>
                      The right to access personal information we hold about you
                    </li>
                    <li>
                      The right to request correction of inaccurate personal
                      information
                    </li>
                    <li>
                      The right to request deletion of your personal information
                    </li>
                    <li>
                      The right to object to processing of your personal
                      information
                    </li>
                    <li>The right to data portability</li>
                    <li>The right to withdraw consent</li>
                  </ul>
                  <p className="text-gray-700">
                    To exercise these rights, please contact us using the
                    contact information provided below. We will respond to your
                    request within a reasonable timeframe.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <h2 className="text-xl font-bold mb-3">Contact Us</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about this privacy policy or our
                privacy practices, please contact us at:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium">Ayoob E-commerce</p>
                <p>Email: privacy@ayoobecommerce.com</p>
                <p>Phone: +1 (555) 123-4567</p>
                <p>Address: 123 Commerce Street, Business City, Country</p>
              </div>
            </CardContent>
          </Card>

          {/* Changes to Privacy Policy */}
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-bold mb-3">
                Changes to This Privacy Policy
              </h2>
              <p className="text-gray-700 mb-4">
                We may update our privacy policy from time to time. We will
                notify you of any changes by posting the new privacy policy on
                this page and updating the &quot;Last Updated&quot; date at the
                top of this page.
              </p>
              <p className="text-gray-700">
                You are advised to review this privacy policy periodically for
                any changes. Changes to this privacy policy are effective when
                they are posted on this page.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
