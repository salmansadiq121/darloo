"use client";
import MainLayout from "@/app/components/Layout/Layout";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertCircle,
  ArrowLeftRight,
  Clock,
  Package,
  CreditCard,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/app/content/authContent";

const countryList = [
  { code: "US", value: "USD", label: "English (United States)", symbol: "$" },
  { code: "DE", value: "EUR", label: "Germany (Deutschland)", symbol: "€" },
];

export default function RefundPolicy() {
  const { countryCode } = useAuth();
  const isGerman = countryCode === "DE";

  return (
    <MainLayout title="Refund Policy - Darloo">
      <div className="min-h-screen bg-gray-50 z-10 relative">
        <div className="container mx-auto py-6 px-4 md:px-6">
          {/* Last Updated */}
          <div className="mb-8 text-right">
            <p className="text-gray-500">
              {isGerman
                ? "Zuletzt aktualisiert: 14. April 2025"
                : "Last Updated: April 14, 2025"}
            </p>
          </div>

          {/* Introduction */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-red-50 rounded-full">
                  <AlertCircle className="h-6 w-6 text-[#C6080A]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-3">
                    {isGerman ? "Einführung" : "Introduction"}
                  </h2>
                  <p className="text-gray-700 mb-4">
                    {isGerman
                      ? "Im Darloo Store möchten wir, dass Sie mit Ihrem Kauf vollständig zufrieden sind. Wenn Sie mit Ihrer Bestellung nicht ganz zufrieden sind, helfen wir Ihnen gerne weiter. Diese Rückerstattungsrichtlinie beschreibt unsere Richtlinien für Rückgaben, Umtausch und Rückerstattungen."
                      : "At Darloo store, we want you to be completely satisfied with your purchase. If you're not entirely happy with your order, we're here to help. This refund policy outlines our guidelines for returns, exchanges, and refunds."}
                  </p>
                  <p className="text-gray-700">
                    {isGerman
                      ? "Bitte lesen Sie diese Richtlinie sorgfältig, bevor Sie einen Kauf tätigen. Durch das Aufgeben einer Bestellung bei uns stimmen Sie den Bedingungen dieser Rückerstattungsrichtlinie zu."
                      : "Please read this policy carefully before making a purchase. By placing an order with us, you agree to the terms of this refund policy."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Return Eligibility */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-red-50 rounded-full">
                  <CheckCircle className="h-6 w-6 text-[#C6080A]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-3">
                    {isGerman ? "Rückgabeberechtigung" : "Return Eligibility"}
                  </h2>
                  <p className="text-gray-700 mb-4">
                    {isGerman
                      ? "Um für eine Rückgabe berechtigt zu sein, stellen Sie bitte sicher, dass:"
                      : "To be eligible for a return, please make sure that:"}
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                    {isGerman ? (
                      <>
                        <li>
                          Der Artikel wurde in den letzten 14 Tagen gekauft.
                        </li>
                        <li>
                          Der Artikel befindet sich in der Originalverpackung.
                        </li>
                        <li>
                          Der Artikel ist unbenutzt, ungetragen und in demselben
                          Zustand, in dem Sie ihn erhalten haben.
                        </li>
                        <li>Sie haben die Quittung oder den Kaufbeleg.</li>
                      </>
                    ) : (
                      <>
                        <li>The item was purchased within the last 14 days.</li>
                        <li>The item is in its original packaging.</li>
                        <li>
                          The item is unused, unworn, and in the same condition
                          that you received it.
                        </li>
                        <li>You have the receipt or proof of purchase.</li>
                      </>
                    )}
                  </ul>

                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                    <p className="text-yellow-800">
                      <span className="font-bold">
                        {isGerman ? "Bitte beachten Sie:" : "Please Note:"}
                      </span>{" "}
                      {isGerman
                        ? "Aus hygienischen Gründen sind bestimmte Artikel von der Rückgabe ausgeschlossen, darunter:"
                        : "Certain items are non-returnable for hygiene reasons, including:"}
                    </p>
                    <ul className="list-disc pl-6 space-y-1 text-yellow-800 mt-2">
                      {isGerman ? (
                        <>
                          <li>Intime Kleidung</li>
                          <li>Produkte zur Körperpflege</li>
                          <li>Ohrringe und Körperschmuck</li>
                          <li>Geöffnete Schönheitsprodukte</li>
                        </>
                      ) : (
                        <>
                          <li>Intimate apparel</li>
                          <li>Personal care products</li>
                          <li>Earrings and body jewelry</li>
                          <li>Opened beauty products</li>
                        </>
                      )}
                    </ul>
                  </div>
                  <p className="text-gray-700">
                    {isGerman
                      ? "Verkaufsartikel können vom Umtausch ausgeschlossen sein, wie zum Zeitpunkt des Kaufs angegeben."
                      : "Sale items may be final sale and not eligible for return, as specified at the time of purchase."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Return Process */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-red-50 rounded-full">
                  <ArrowLeftRight className="h-6 w-6 text-[#C6080A]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-3">
                    {isGerman ? "Rückgabeprozess" : "Return Process"}
                  </h2>
                  <p className="text-gray-700 mb-4">
                    {isGerman
                      ? "Um eine Rückgabe einzuleiten, befolgen Sie bitte diese Schritte:"
                      : "To initiate a return, please follow these steps:"}
                  </p>
                  <ol className="list-decimal pl-6 space-y-3 text-gray-700 mb-4">
                    {isGerman ? (
                      <>
                        <li>
                          <span className="font-medium">
                            Kundendienst kontaktieren:
                          </span>{" "}
                          Senden Sie uns eine E-Mail an support@darloo.com oder
                          rufen Sie uns unter +44 7888 865833 an, um eine
                          Rückgabe zu beantragen.
                        </li>
                        <li>
                          <span className="font-medium">
                            Rückgabeautorisierung erhalten:
                          </span>{" "}
                          Nach Genehmigung Ihrer Anfrage erhalten Sie eine
                          Rücksendenummer (RMA) und Anweisungen zur Rücksendung.
                        </li>
                        <li>
                          <span className="font-medium">
                            Verpacken Sie Ihre Rücksendung:
                          </span>{" "}
                          Verpacken Sie den Artikel sicher in der
                          Originalverpackung mit allem Zubehör, Handbüchern und
                          Gratisgeschenken.
                        </li>
                        <li>
                          <span className="font-medium">
                            Rücksendeformular beilegen:
                          </span>{" "}
                          Legen Sie das Formular mit Ihrer RMA-Nummer in das
                          Paket.
                        </li>
                        <li>
                          <span className="font-medium">
                            Senden Sie die Rücksendung ab:
                          </span>{" "}
                          Senden Sie das Paket an die angegebene Adresse. Wir
                          empfehlen einen verfolgbaren Versand.
                        </li>
                      </>
                    ) : (
                      <>
                        <li>
                          <span className="font-medium">
                            Contact Customer Service:
                          </span>{" "}
                          Email us at support@darloo.com or call us at +44 7888
                          865833 to request a return authorization.
                        </li>
                        <li>
                          <span className="font-medium">
                            Receive Return Authorization:
                          </span>{" "}
                          Once your return request is approved, we will provide
                          you with a Return Merchandise Authorization (RMA)
                          number and return instructions.
                        </li>
                        <li>
                          <span className="font-medium">
                            Package Your Return:
                          </span>{" "}
                          Pack the item securely in its original packaging along
                          with all accessories, manuals, and free gifts that
                          came with it.
                        </li>
                        <li>
                          <span className="font-medium">
                            Include Return Form:
                          </span>{" "}
                          Include the return form with your RMA number inside
                          the package.
                        </li>
                        <li>
                          <span className="font-medium">Ship Your Return:</span>{" "}
                          Send your return to the address provided in the return
                          instructions. We recommend using a trackable shipping
                          method.
                        </li>
                      </>
                    )}
                  </ol>
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                    <p className="text-blue-800">
                      <span className="font-bold">
                        {isGerman ? "Tipp:" : "Tip:"}
                      </span>{" "}
                      {isGerman
                        ? "Machen Sie Fotos des Artikels, bevor Sie ihn versenden, falls das Paket während des Transports beschädigt wird."
                        : "Take photos of the item before shipping it back to us, in case the package gets damaged during transit."}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Refund Process */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-red-50 rounded-full">
                  <CreditCard className="h-6 w-6 text-[#C6080A]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-3">
                    {isGerman ? "Rückerstattungsprozess" : "Refund Process"}
                  </h2>
                  <p className="text-gray-700 mb-4">
                    {isGerman
                      ? "Sobald wir Ihre Rücksendung erhalten und überprüft haben, informieren wir Sie über den Status Ihrer Rückerstattung:"
                      : "Once we receive and inspect your return, we will notify you about the status of your refund:"}
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                    {isGerman ? (
                      <>
                        <li>
                          <span className="font-medium">
                            Genehmigte Rückerstattungen:
                          </span>{" "}
                          Wenn Ihre Rücksendung genehmigt wird, leiten wir eine
                          Rückerstattung an Ihre ursprüngliche Zahlungsmethode
                          ein. Die Dauer hängt vom Zahlungsanbieter ab, in der
                          Regel 5–10 Werktage.
                        </li>
                        <li>
                          <span className="font-medium">
                            Gutschrift im Shop:
                          </span>{" "}
                          In manchen Fällen bieten wir stattdessen eine
                          Gutschrift an.
                        </li>
                        <li>
                          <span className="font-medium">
                            Abgelehnte Rücksendungen:
                          </span>{" "}
                          Wenn die Rückgabe nicht unseren Kriterien entspricht,
                          senden wir den Artikel zurück.
                        </li>
                      </>
                    ) : (
                      <>
                        <li>
                          <span className="font-medium">Approved Refunds:</span>{" "}
                          If your return is approved, we will initiate a refund
                          to your original payment method. The time it takes
                          depends on your payment provider, typically 5-10
                          business days.
                        </li>
                        <li>
                          <span className="font-medium">Store Credit:</span> In
                          some cases, we may offer store credit instead of a
                          refund.
                        </li>
                        <li>
                          <span className="font-medium">Rejected Returns:</span>{" "}
                          If your return doesn&lsquo;t meet eligibility
                          criteria, we may reject it and send it back.
                        </li>
                      </>
                    )}
                  </ul>
                  <p className="text-gray-700 mb-4">
                    {isGerman
                      ? "Rückerstattungen umfassen den Produktpreis und anfallende Steuern. Versandkosten sind nicht erstattungsfähig, es sei denn, der Fehler liegt bei uns (z. B. falscher oder defekter Artikel)."
                      : "Refunds include the product price and applicable taxes. Shipping costs are non-refundable unless due to our error (e.g., incorrect or defective item)."}
                  </p>
                  <div className="bg-green-50 border-l-4 border-green-400 p-4">
                    <p className="text-green-800">
                      <span className="font-bold">
                        {isGerman ? "Gut zu wissen:" : "Good to Know:"}
                      </span>{" "}
                      {isGerman
                        ? "Sie können den Status Ihrer Rückerstattung über Ihr Konto oder den Kundendienst prüfen."
                        : "You can check the status of your refund by logging into your account or contacting our customer service team."}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Exchanges */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-red-50 rounded-full">
                  <Package className="h-6 w-6 text-[#C6080A]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-3">
                    {isGerman ? "Umtausch" : "Exchanges"}
                  </h2>
                  <p className="text-gray-700 mb-4">
                    {isGerman
                      ? "Wenn Sie einen Artikel in einer anderen Größe, Farbe oder Variante umtauschen möchten, befolgen Sie bitte diese Schritte:"
                      : "If you'd like to exchange an item for a different size, color, or product, please follow these steps:"}
                  </p>
                  <ol className="list-decimal pl-6 space-y-2 text-gray-700 mb-4">
                    {isGerman ? (
                      <>
                        <li>
                          Leiten Sie eine Rückgabe wie oben beschrieben ein.
                        </li>
                        <li>
                          Geben Sie eine neue Bestellung für den gewünschten
                          Artikel auf.
                        </li>
                      </>
                    ) : (
                      <>
                        <li>
                          Initiate a return using the process described above.
                        </li>
                        <li>
                          Place a new order for the item you want instead.
                        </li>
                      </>
                    )}
                  </ol>
                  <p className="text-gray-700">
                    {isGerman
                      ? "Auf diese Weise erhalten Sie den gewünschten Artikel schneller. Wenn Sie Fragen haben, kontaktieren Sie bitte unseren Kundendienst."
                      : "This approach ensures you get the item you want quickly. If you have any questions about exchanges, contact our customer service team."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Late or Missing Refunds */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-red-50 rounded-full">
                  <Clock className="h-6 w-6 text-[#C6080A]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-3">
                    {isGerman
                      ? "Verspätete oder fehlende Rückerstattungen"
                      : "Late or Missing Refunds"}
                  </h2>
                  <p className="text-gray-700 mb-4">
                    {isGerman
                      ? "Wenn Sie Ihre Rückerstattung nicht innerhalb des erwarteten Zeitraums erhalten haben:"
                      : "If you haven't received your refund within the expected timeframe:"}
                  </p>
                  <ol className="list-decimal pl-6 space-y-2 text-gray-700 mb-4">
                    {isGerman ? (
                      <>
                        <li>
                          Überprüfen Sie Ihr Bankkonto oder Ihre
                          Kreditkartenabrechnung erneut.
                        </li>
                        <li>
                          Kontaktieren Sie Ihre Bank oder Ihr
                          Kreditkartenunternehmen, da die Buchung Zeit in
                          Anspruch nehmen kann.
                        </li>
                        <li>
                          Wenden Sie sich an unseren Kundendienst, falls das
                          Problem weiterhin besteht.
                        </li>
                      </>
                    ) : (
                      <>
                        <li>
                          Check your bank account or credit card statement
                          again.
                        </li>
                        <li>
                          Contact your bank or credit card company, as it may
                          take time for the refund to post.
                        </li>
                        <li>
                          Contact our customer service team if the above steps
                          don&lsquo;t resolve the issue.
                        </li>
                      </>
                    )}
                  </ol>
                  <p className="text-gray-700">
                    {isGerman
                      ? "Wenn Sie alle Schritte durchgeführt haben und die Rückerstattung immer noch nicht erhalten haben, kontaktieren Sie uns bitte unter support@darloo.com mit Ihrer Bestellnummer."
                      : "If you've done all of this and still haven't received your refund, please contact us at support@darloo.com with your order number and refund details."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Damaged or Defective Items */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <h2 className="text-xl font-bold mb-3">
                {isGerman
                  ? "Beschädigte oder fehlerhafte Artikel"
                  : "Damaged or Defective Items"}
              </h2>
              <p className="text-gray-700 mb-4">
                {isGerman
                  ? "Wenn Sie einen beschädigten oder fehlerhaften Artikel erhalten, kontaktieren Sie uns bitte umgehend unter support@darloo.com mit Fotos des Artikels und der Verpackung. Wir werden das Problem schnell lösen, entweder durch Ersatz oder vollständige Rückerstattung inklusive Versandkosten."
                  : "If you receive a damaged or defective item, please contact us immediately at support@darloo.com with photos of the product and packaging. We'll resolve the issue quickly with either a replacement or a full refund including shipping costs."}
              </p>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-bold mb-3">
                {isGerman ? "Kontaktinformationen" : "Contact Information"}
              </h2>
              <p className="text-gray-700 mb-4">
                {isGerman
                  ? "Wenn Sie Fragen zu dieser Rückerstattungsrichtlinie haben, kontaktieren Sie uns bitte unter:"
                  : "If you have any questions about this refund policy, please contact us at:"}
              </p>
              <p className="text-gray-700">
                <strong>Email:</strong> support@darloo.com <br />
                <strong>Phone:</strong> +44 7888 865833
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
