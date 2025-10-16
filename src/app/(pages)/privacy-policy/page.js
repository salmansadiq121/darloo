"use client";
import MainLayout from "@/app/components/Layout/Layout";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  ShieldCheck,
  Lock,
  Smartphone,
  AlertTriangle,
  Eye,
  KeyRound,
  CreditCard,
  UserCheck,
} from "lucide-react";
import axios from "axios";
import { useAuth } from "@/app/content/authContent";

// 🌍 Country List
export const countryList = [
  { code: "US", value: "USD", label: "English (United States)", symbol: "$" },
  { code: "DE", value: "EUR", label: "Germany (Deutschland)", symbol: "€" },
];

export default function PrivacyPolicy() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { countryCode } = useAuth();
  const isGerman = countryCode === "DE";

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/privacy/fetch/privacy`
      );
      setData(data.privacy);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <MainLayout
      title={
        isGerman ? "Datenschutzrichtlinie - Darloo" : "Privacy Policy - Darloo"
      }
    >
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto py-6 px-4 md:px-6">
          {/* Introduction */}
          <div className="max-w-3xl mx-auto mb-12 text-center">
            <ShieldCheck className="h-16 w-16 text-[#C6080A] mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              {isGerman
                ? "Ihre Sicherheit hat für uns oberste Priorität"
                : "Your Security Is Our Priority"}
            </h2>
            <p className="text-gray-700">
              {isGerman
                ? "Bei Darloo E-Commerce setzen wir branchenführende Sicherheitsmaßnahmen ein, um Ihre persönlichen Daten zu schützen und sichere Transaktionen zu gewährleisten. Diese Seite beschreibt die Maßnahmen, die wir zum Schutz Ihres Kontos ergreifen, und gibt Ihnen Tipps, wie Sie Ihre Sicherheit weiter verbessern können."
                : "At Darloo E-commerce, we implement industry-leading security measures to protect your personal information and ensure safe transactions. This page outlines the steps we take to secure your account and provides guidance on how you can enhance your security."}
            </p>
          </div>

          {/* Security Features */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-center">
              {isGerman
                ? "Unsere Sicherheitsfunktionen"
                : "Our Security Features"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Secure Authentication */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-red-50 rounded-full">
                      <Lock className="h-6 w-6 text-[#C6080A]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold mb-2">
                        {isGerman
                          ? "Sichere Authentifizierung"
                          : "Secure Authentication"}
                      </h3>
                      <p className="text-gray-700">
                        {isGerman
                          ? "Wir verwenden fortschrittliche Authentifizierungsprotokolle, um Ihre Identität beim Anmelden zu überprüfen. Unser System unterstützt starke Passwortrichtlinien und die Multi-Faktor-Authentifizierung für zusätzliche Sicherheit."
                          : "We use advanced authentication protocols to verify your identity when you log in. Our system supports strong password requirements and multi-factor authentication for enhanced security."}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Secure Payments */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-red-50 rounded-full">
                      <CreditCard className="h-6 w-6 text-[#C6080A]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold mb-2">
                        {isGerman ? "Sichere Zahlungen" : "Secure Payments"}
                      </h3>
                      <p className="text-gray-700">
                        {isGerman
                          ? "Alle Zahlungsinformationen werden mit branchenüblicher SSL/TLS-Verschlüsselung geschützt. Wir erfüllen die PCI DSS-Standards und speichern niemals Ihre vollständigen Kreditkartendaten auf unseren Servern."
                          : "All payment information is encrypted using industry-standard SSL/TLS encryption. We comply with PCI DSS standards to ensure secure credit card processing, and we never store your full credit card details on our servers."}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Data Protection */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-red-50 rounded-full">
                      <Eye className="h-6 w-6 text-[#C6080A]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold mb-2">
                        {isGerman ? "Datenschutz" : "Data Protection"}
                      </h3>
                      <p className="text-gray-700">
                        {isGerman
                          ? "Ihre persönlichen Daten werden mit modernster Verschlüsselungstechnologie geschützt. Wir führen regelmäßige Sicherheitsprüfungen durch, um mögliche Schwachstellen zu erkennen und zu beheben."
                          : "Your personal data is protected using advanced encryption techniques. We regularly update our security systems and conduct security audits to identify and address potential vulnerabilities."}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Fraud Detection */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-red-50 rounded-full">
                      <AlertTriangle className="h-6 w-6 text-[#C6080A]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold mb-2">
                        {isGerman ? "Betrugserkennung" : "Fraud Detection"}
                      </h3>
                      <p className="text-gray-700">
                        {isGerman
                          ? "Unser fortschrittliches Betrugserkennungssystem überwacht Transaktionen in Echtzeit, um verdächtige Aktivitäten zu erkennen. Wenn wir ungewöhnliche Aktivitäten feststellen, werden Sie sofort benachrichtigt."
                          : "Our advanced fraud detection system monitors transactions in real-time to identify suspicious activities. If we detect unusual activity on your account, we’ll alert you immediately and take steps to secure your account."}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Security Best Practices */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-center">
              {isGerman
                ? "Sicherheitsbewährte Verfahren"
                : "Security Best Practices"}
            </h2>
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h3 className="text-xl font-bold mb-4">
                {isGerman ? "Schützen Sie Ihr Konto" : "Protect Your Account"}
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="p-1 bg-red-50 rounded-full mt-0.5">
                    <KeyRound className="h-4 w-4 text-[#C6080A]" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {isGerman
                        ? "Erstellen Sie ein starkes Passwort"
                        : "Create a Strong Password"}
                    </p>
                    <p className="text-gray-700">
                      {isGerman
                        ? "Verwenden Sie ein eindeutiges Passwort mit Groß- und Kleinbuchstaben, Zahlen und Sonderzeichen. Vermeiden Sie leicht zu erratende Informationen wie Geburtstage oder Namen."
                        : "Use a unique password that includes a mix of uppercase and lowercase letters, numbers, and special characters. Avoid using easily guessable information like birthdays or names."}
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="p-1 bg-red-50 rounded-full mt-0.5">
                    <Smartphone className="h-4 w-4 text-[#C6080A]" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {isGerman
                        ? "Zwei-Faktor-Authentifizierung (2FA) aktivieren"
                        : "Enable Two-Factor Authentication (2FA)"}
                    </p>
                    <p className="text-gray-700">
                      {isGerman
                        ? "Aktivieren Sie 2FA in den Kontoeinstellungen, um eine zusätzliche Sicherheitsebene hinzuzufügen. Dies erfordert einen Bestätigungscode zusätzlich zu Ihrem Passwort, wenn Sie sich von einem neuen Gerät anmelden."
                        : "Add an extra layer of security by enabling 2FA in your account settings. This requires a verification code in addition to your password when logging in from a new device."}
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="p-1 bg-red-50 rounded-full mt-0.5">
                    <UserCheck className="h-4 w-4 text-[#C6080A]" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {isGerman
                        ? "Überprüfen Sie regelmäßig Ihre Kontobewegungen"
                        : "Regularly Review Your Account Activity"}
                    </p>
                    <p className="text-gray-700">
                      {isGerman
                        ? "Überprüfen Sie regelmäßig Ihre Bestellhistorie und Kontoaktivitäten. Melden Sie verdächtige Aktivitäten sofort."
                        : "Check your order history and account activity regularly. If you notice any unauthorized transactions or suspicious activity, report it immediately."}
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-bold mb-4">
                {isGerman ? "Sicheres Einkaufen" : "Safe Shopping Tips"}
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="p-1 bg-red-50 rounded-full mt-0.5">
                    <Lock className="h-4 w-4 text-[#C6080A]" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {isGerman
                        ? "Nur über sichere Verbindungen einkaufen"
                        : "Shop on Secure Connections"}
                    </p>
                    <p className="text-gray-700">
                      {isGerman
                        ? 'Stellen Sie sicher, dass Sie über eine sichere Verbindung ("https://") einkaufen. Vermeiden Sie Einkäufe über öffentliches WLAN.'
                        : 'Always ensure you’re on a secure connection (look for "https://") when shopping online. Avoid making purchases or accessing your account on public Wi-Fi networks.'}
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="p-1 bg-red-50 rounded-full mt-0.5">
                    <AlertTriangle className="h-4 w-4 text-[#C6080A]" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {isGerman
                        ? "Achten Sie auf Phishing-Versuche"
                        : "Be Wary of Phishing Attempts"}
                    </p>
                    <p className="text-gray-700">
                      {isGerman
                        ? "Wir werden Sie niemals per E-Mail oder SMS nach vertraulichen Informationen fragen. Klicken Sie nicht auf verdächtige Links oder geben Sie keine Daten weiter."
                        : "We will never ask for sensitive information via email or text message. If you receive suspicious communications claiming to be from Darloo E-commerce, do not click on any links or provide any information."}
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="p-1 bg-red-50 rounded-full mt-0.5">
                    <CreditCard className="h-4 w-4 text-[#C6080A]" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {isGerman
                        ? "Überwachen Sie Ihre Zahlungsmethoden"
                        : "Monitor Your Payment Methods"}
                    </p>
                    <p className="text-gray-700">
                      {isGerman
                        ? "Überprüfen Sie regelmäßig Ihre Kreditkarten- und Kontoauszüge auf unautorisierte Abbuchungen. Aktivieren Sie Benachrichtigungen für ungewöhnliche Aktivitäten."
                        : "Regularly check your credit card and bank statements for unauthorized charges. Set up alerts with your financial institutions to be notified of unusual activity."}
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Security Alerts */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-center">
              {isGerman
                ? "Aktuelle Sicherheitswarnungen"
                : "Current Security Alerts"}
            </h2>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-red-50 rounded-full">
                    <AlertTriangle className="h-6 w-6 text-[#C6080A]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-2">
                      {isGerman
                        ? "Phishing-Warnung: April 2025"
                        : "Phishing Alert: April 2025"}
                    </h3>
                    <p className="text-gray-700 mb-4">
                      {isGerman
                        ? 'Wir haben Phishing-E-Mails entdeckt, die angeblich von Darloo E-Commerce stammen und Kunden auffordern, ihre Zahlungsinformationen aufgrund "Sicherheitsbedenken" zu aktualisieren. Diese E-Mails stammen NICHT von uns.'
                        : 'We’ve detected phishing emails claiming to be from Darloo E-commerce asking customers to update their payment information due to "security concerns." These emails are NOT from us.'}
                    </p>
                    <div className="bg-red-50 border-l-4 border-red-500 p-4">
                      <p className="text-red-800 font-bold">
                        {isGerman
                          ? "So erkennen Sie Phishing-Versuche:"
                          : "How to identify phishing attempts:"}
                      </p>
                      <ul className="list-disc pl-6 space-y-1 text-red-800 mt-2">
                        <li>
                          {isGerman
                            ? "Überprüfen Sie sorgfältig die Absenderadresse."
                            : "Check the sender’s email address carefully."}
                        </li>
                        <li>
                          {isGerman
                            ? "Achten Sie auf Grammatikfehler oder ungewöhnliches Format."
                            : "Look for grammatical errors or unusual formatting."}
                        </li>
                        <li>
                          {isGerman
                            ? "Fahren Sie mit der Maus über Links, um die tatsächliche URL zu sehen."
                            : "Hover over links before clicking to see the actual URL."}
                        </li>
                        <li>
                          {isGerman
                            ? "Seien Sie vorsichtig bei dringenden oder bedrohlichen Nachrichten."
                            : "Be suspicious of urgent requests or threats."}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Report Security Issues */}
          <div className="bg-gradient-to-r z-10 relative from-[#C6080A] to-[#ff4b4e] rounded-lg p-8 text-white">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl font-bold mb-4">
                {isGerman
                  ? "Sicherheitsprobleme melden"
                  : "Report Security Issues"}
              </h2>
              <p className="mb-6">
                {isGerman
                  ? "Wenn Sie vermuten, dass Ihr Konto kompromittiert wurde oder ein Sicherheitsproblem melden möchten, kontaktieren Sie bitte sofort unser Sicherheitsteam."
                  : "If you suspect your account has been compromised or want to report a security concern, please contact our security team immediately."}
              </p>
              <div className="inline-block bg-white text-[#C6080A] rounded-lg p-4">
                <p className="font-bold">
                  {isGerman
                    ? "Kontaktinformationen für Sicherheitsfragen:"
                    : "Security Contact Information:"}
                </p>
                <p>Email: security@darloo.com</p>
                <p>
                  {isGerman
                    ? "Telefon: +1 (555) 987-6543"
                    : "Phone: +1 (555) 987-6543"}
                </p>
                <p>
                  {isGerman
                    ? "Rund um die Uhr verfügbar für Sicherheitsnotfälle"
                    : "Available 24/7 for security emergencies"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
