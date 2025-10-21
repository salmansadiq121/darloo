"use client";
import MainLayout from "@/app/components/Layout/Layout";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Lock, ShieldCheck, KeyRound, EyeOff } from "lucide-react";
import { useAuth } from "@/app/content/authContent";

const countryList = [
  { code: "US", value: "USD", label: "English (United States)", symbol: "$" },
  { code: "DE", value: "EUR", label: "Germany (Deutschland)", symbol: "€" },
];

export default function AccountSecurity() {
  const { countryCode } = useAuth();
  const isGerman = countryCode === "DE";

  return (
    <MainLayout
      title={
        isGerman ? "Kontosicherheit - Darloo" : "Account Security - Darloo"
      }
      description={
        isGerman
          ? "Wie wir Ihr Konto schützen und was Sie tun können, um es sicher zu halten."
          : "How we keep your account safe and what you can do to protect it."
      }
    >
      <div className="min-h-screen bg-transparent relative z-10">
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
                    {isGerman ? "Einleitung" : "Introduction"}
                  </h2>
                  <p className="text-gray-700 mb-4">
                    {isGerman
                      ? "Bei Darloo hat die Sicherheit Ihrer persönlichen und Kontoinformationen oberste Priorität. Diese Richtlinie erklärt unsere Sicherheitspraktiken und welche Maßnahmen Sie ergreifen können, um Ihr Konto zu schützen."
                      : "At Darloo, we prioritize the security of your personal and account information. This policy explains our security practices and what steps you can take to ensure your account remains protected."}
                  </p>
                  <p className="text-gray-700">
                    {isGerman
                      ? "Durch die Nutzung unserer Dienste stimmen Sie den folgenden Richtlinien zu, um Ihre Daten zu schützen."
                      : "By using our services, you agree to adhere to the following guidelines to help safeguard your data."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Password Guidelines */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-red-50 rounded-full">
                  <KeyRound className="h-6 w-6 text-[#C6080A]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-3">
                    {isGerman ? "Passwort-Richtlinien" : "Password Guidelines"}
                  </h2>
                  <p className="text-gray-700 mb-4">
                    {isGerman
                      ? "Verwenden Sie starke, einzigartige Passwörter für Ihr Konto. Vermeiden Sie gängige Wörter, Namen oder leicht zu erratende Informationen."
                      : "Use strong, unique passwords for your account. Avoid using common words, names, or easily guessed information."}
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>
                      {isGerman
                        ? "Verwenden Sie mindestens 8 Zeichen, einschließlich Groß- und Kleinbuchstaben, Zahlen und Symbole"
                        : "Use at least 8 characters, including uppercase, lowercase, numbers, and symbols"}
                    </li>
                    <li>
                      {isGerman
                        ? "Verwenden Sie nicht dasselbe Passwort für mehrere Websites"
                        : "Avoid using the same password across multiple websites"}
                    </li>
                    <li>
                      {isGerman
                        ? "Ändern Sie Ihr Passwort regelmäßig und teilen Sie es nicht mit anderen"
                        : "Change your password periodically and avoid sharing it with others"}
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Two-Factor Authentication */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-red-50 rounded-full">
                  <ShieldCheck className="h-6 w-6 text-[#C6080A]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-3">
                    {isGerman
                      ? "Zwei-Faktor-Authentifizierung (2FA)"
                      : "Two-Factor Authentication (2FA)"}
                  </h2>
                  <p className="text-gray-700 mb-4">
                    {isGerman
                      ? "Aktivieren Sie 2FA für Ihr Darloo-Konto, um eine zusätzliche Sicherheitsebene zu erhalten. Dies schützt Ihr Konto selbst dann, wenn Ihr Passwort kompromittiert wird."
                      : "Enable 2FA on your Darloo account for an extra layer of security. This helps protect your account even if your password is compromised."}
                  </p>
                  <p className="text-gray-700">
                    {isGerman
                      ? "Wir unterstützen SMS und Authentifikator-Apps für 2FA. Sie können Ihre 2FA-Einstellungen in Ihren Kontosicherheitsoptionen verwalten."
                      : "We support SMS and authenticator apps for 2FA. You can manage your 2FA settings in your account security preferences."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Login Alerts */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-red-50 rounded-full">
                  <EyeOff className="h-6 w-6 text-[#C6080A]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-3">
                    {isGerman ? "Login-Benachrichtigungen" : "Login Alerts"}
                  </h2>
                  <p className="text-gray-700 mb-4">
                    {isGerman
                      ? "Bleiben Sie über Aktivitäten in Ihrem Konto informiert. Wir senden Ihnen eine Benachrichtigung über verdächtige Anmeldeversuche."
                      : "Stay informed about activity on your account. We’ll send you an alert for any suspicious login or access attempt."}
                  </p>
                  <p className="text-gray-700">
                    {isGerman
                      ? "Wenn Sie eine Benachrichtigung erhalten, die nicht von Ihnen stammt, ändern Sie Ihr Passwort sofort und kontaktieren Sie unser Support-Team."
                      : "If you receive an alert that wasn’t you, change your password immediately and contact our support team."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Secure Your Devices */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-red-50 rounded-full">
                  <Lock className="h-6 w-6 text-[#C6080A]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-3">
                    {isGerman
                      ? "Sichern Sie Ihre Geräte"
                      : "Secure Your Devices"}
                  </h2>
                  <p className="text-gray-700 mb-4">
                    {isGerman
                      ? "Halten Sie Ihre Geräte sicher, indem Sie aktuelle Software und Antiviren-Tools verwenden. Vermeiden Sie die Nutzung öffentlicher Geräte, um auf Ihr Darloo-Konto zuzugreifen."
                      : "Keep your devices secure by using updated software and antivirus tools. Avoid using public or shared devices to access your Darloo account."}
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>
                      {isGerman
                        ? "Verwenden Sie Gerätesperren oder biometrische Sicherheit"
                        : "Use device passwords or biometric locks"}
                    </li>
                    <li>
                      {isGerman
                        ? "Halten Sie Betriebssysteme und Apps aktuell"
                        : "Keep operating systems and apps up to date"}
                    </li>
                    <li>
                      {isGerman
                        ? "Seien Sie vorsichtig mit Phishing-E-Mails oder verdächtigen Links"
                        : "Be cautious of phishing emails or suspicious links"}
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Security Team */}
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-bold mb-3">
                {isGerman
                  ? "Benötigen Sie Hilfe zur Kontosicherheit?"
                  : "Need Help with Account Security?"}
              </h2>
              <p className="text-gray-700 mb-4">
                {isGerman
                  ? "Wenn Sie glauben, dass Ihr Konto kompromittiert wurde, oder Fragen zur Kontosicherheit haben, wenden Sie sich bitte an unser Sicherheitsteam:"
                  : "If you believe your account has been compromised or have questions about account security, reach out to our security support team:"}
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium">
                  {isGerman
                    ? "Darloo Sicherheitsteam"
                    : "Darloo Security Support"}
                </p>
                <p>Email: security@darloo.com</p>
                {/* <p>
                  {isGerman
                    ? "Telefon: +1 (555) 123-4567"
                    : "Phone: +1 (555) 123-4567"}
                </p>
                <p>
                  {isGerman
                    ? "Arbeitszeiten: Montag–Freitag, 9–18 Uhr MEZ"
                    : "Hours: Monday–Friday, 9am–6pm EST"}
                </p> */}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
