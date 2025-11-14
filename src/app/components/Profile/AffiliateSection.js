import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import { format } from "date-fns";
import { useAuth } from "@/app/content/authContent";
import toast from "react-hot-toast";
import { ImSpinner4 } from "react-icons/im";

export default function AffiliateSection({ userId, countryCode }) {
  const { auth } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEarned: 0,
    approvedEarnings: 0,
    pendingEarnings: 0,
    totalRevenue: 0,
    conversions: 0,
    totalOrders: 0,
  });
  const [recentEarnings, setRecentEarnings] = useState([]);

  const isGerman = countryCode === "DE";

  // Fetch affiliate earnings data
  useEffect(() => {
    const fetchEarnings = async () => {
      if (!userId || !auth?.token) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/order/affiliate/earnings/${userId}`,
          {
            headers: {
              Authorization: auth.token,
            },
          }
        );

        if (data && data.success) {
          setStats(data.stats || stats);
          setRecentEarnings(data.recentEarnings || []);
        }
      } catch (error) {
        console.error("Error fetching affiliate earnings:", error);
        // Don't show error if user has no affiliate data
        if (error.response?.status !== 404) {
          toast.error(
            error.response?.data?.message ||
              (isGerman
                ? "Fehler beim Laden der Affiliate-Daten"
                : "Failed to load affiliate data")
          );
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchEarnings();
    // eslint-disable-next-line
  }, [userId, auth?.token]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount || 0);
  };

  // Calculate conversion rate
  const conversionRate =
    stats.totalOrders > 0
      ? ((stats.conversions / stats.totalOrders) * 100).toFixed(1)
      : "0.0";

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8 flex items-center justify-center">
          <ImSpinner4 className="h-8 w-8 animate-spin text-[#C6080A]" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isGerman ? "Partnerprogramm" : "Affiliate Program"}
        </CardTitle>
        <CardDescription>
          {isGerman
            ? "Verfolgen Sie Ihre Affiliate-Leistung und Einnahmen"
            : "Track your affiliate performance and earnings"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">
                {isGerman ? "Verfügbares Guthaben" : "Available Balance"}
              </p>
              <p className="text-2xl font-bold text-[#C6080A]">
                {formatCurrency(stats.approvedEarnings)}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {isGerman ? "Genehmigte Einnahmen" : "Approved earnings"}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">
                {isGerman ? "Gesamt verdient" : "Total Earned"}
              </p>
              <p className="text-2xl font-bold">
                {formatCurrency(stats.totalEarned)}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {isGerman ? "Lebenszeit-Einnahmen" : "Lifetime earnings"}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">
                {isGerman ? "Ausstehende Zahlung" : "Pending Payment"}
              </p>
              <p className="text-2xl font-bold">
                {formatCurrency(stats.pendingEarnings)}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {isGerman
                  ? "Bearbeitungszeit: 14 Tage"
                  : "Processing period: 14 days"}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">
                {isGerman ? "Gesamtumsatz" : "Total Revenue"}
              </p>
              <p className="text-2xl font-bold">
                {formatCurrency(stats.totalRevenue)}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {isGerman
                  ? "Von Affiliate-Bestellungen"
                  : "From affiliate orders"}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">
                {isGerman ? "Konversionen" : "Conversions"}
              </p>
              <p className="text-2xl font-bold">{stats.conversions}</p>
              <p className="text-xs text-gray-500 mt-2">
                {isGerman ? "Erfolgreiche Bestellungen" : "Successful orders"}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">
                {isGerman ? "Konversionsrate" : "Conversion Rate"}
              </p>
              <p className="text-2xl font-bold">{conversionRate}%</p>
              <p className="text-xs text-gray-500 mt-2">
                {isGerman ? "Von allen Bestellungen" : "Of all orders"}
              </p>
            </CardContent>
          </Card>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4">
            {isGerman ? "Ihre Affiliate-Links" : "Your Affiliate Links"}
          </h3>
          <div className="space-y-3">
            {[
              {
                name: isGerman ? "Startseite" : "Homepage",
                url: `${
                  process.env.NEXT_PUBLIC_CLIENT_URL || window.location.origin
                }?ref=${userId}`,
              },
              {
                name: isGerman ? "Alle Produkte" : "All Products",
                url: `${
                  process.env.NEXT_PUBLIC_CLIENT_URL || window.location.origin
                }/products?ref=${userId}`,
              },
            ].map((link, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex-1 mr-4">
                  <p className="font-medium">{link.name}</p>
                  <p className="text-xs text-gray-500 truncate">{link.url}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(link.url);
                    toast.success(isGerman ? "Link kopiert!" : "Link copied!");
                  }}
                >
                  {isGerman ? "Link kopieren" : "Copy Link"}
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4">
            {isGerman ? "Aktuelle Einnahmen" : "Recent Earnings"}
          </h3>
          {recentEarnings.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>
                {isGerman
                  ? "Noch keine Affiliate-Einnahmen"
                  : "No affiliate earnings yet"}
              </p>
              <p className="text-sm mt-2">
                {isGerman
                  ? "Teilen Sie Ihre Affiliate-Links, um Einnahmen zu generieren"
                  : "Share your affiliate links to start earning"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">
                      {isGerman ? "Bestellnummer" : "Order #"}
                    </th>
                    <th className="text-left py-3 px-4 font-medium">
                      {isGerman ? "Kunde" : "Customer"}
                    </th>
                    <th className="text-left py-3 px-4 font-medium">
                      {isGerman ? "Datum" : "Date"}
                    </th>
                    <th className="text-right py-3 px-4 font-medium">
                      {isGerman ? "Provision" : "Commission"}
                    </th>
                    <th className="text-right py-3 px-4 font-medium">
                      {isGerman ? "Status" : "Status"}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentEarnings.map((earning) => (
                    <tr key={earning.id} className="border-b">
                      <td className="py-3 px-4">
                        <span className="font-semibold text-blue-600">
                          #{earning.orderNumber}
                        </span>
                      </td>
                      <td className="py-3 px-4">{earning.customer}</td>
                      <td className="py-3 px-4 text-gray-500">
                        {format(new Date(earning.date), "MMM dd, yyyy")}
                      </td>
                      <td className="py-3 px-4 text-right font-medium">
                        {formatCurrency(earning.commission)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Badge
                          variant={
                            earning.status === "Approved"
                              ? "default"
                              : "outline"
                          }
                          className={
                            earning.status === "Approved"
                              ? "bg-green-500"
                              : "text-amber-500"
                          }
                        >
                          {earning.status === "Approved"
                            ? isGerman
                              ? "Genehmigt"
                              : "Approved"
                            : isGerman
                            ? "Ausstehend"
                            : "Pending"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
