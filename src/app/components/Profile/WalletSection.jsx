"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  Download,
  Clock,
  CheckCircle,
  XCircle,
  CreditCard,
  Landmark,
} from "lucide-react";
import toast from "react-hot-toast";
import WalletWithdrawalModal from "./WalletWithdrawalModal";

export default function WalletSection({ countryCode, auth }) {
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false);
  const isGerman = countryCode === "DE";

  const serverUri = process.env.NEXT_PUBLIC_SERVER_URI;

  const fetchWalletData = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${serverUri}/api/v1/wallet/me`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      if (data.success) {
        setWallet(data.wallet);
      }
    } catch (error) {
      console.error("Error fetching wallet:", error);
      toast.error(isGerman ? "Fehler beim Laden der Wallet" : "Failed to load wallet");
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      const { data } = await axios.get(
        `${serverUri}/api/v1/wallet/me/transactions`,
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        }
      );
      if (data.success) {
        setTransactions(data.transactions || []);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const fetchWithdrawals = async () => {
    try {
      const { data } = await axios.get(
        `${serverUri}/api/v1/wallet/me/withdrawals`,
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        }
      );
      if (data.success) {
        setWithdrawals(data.withdrawals || []);
      }
    } catch (error) {
      console.error("Error fetching withdrawals:", error);
    }
  };

  useEffect(() => {
    if (auth.token) {
      fetchWalletData();
      fetchTransactions();
      fetchWithdrawals();
    }
  }, [auth.token]);

  const handleWithdrawalSuccess = () => {
    fetchWalletData();
    fetchWithdrawals();
    setIsWithdrawalModalOpen(false);
    toast.success(
      isGerman
        ? "Auszahlungsantrag erfolgreich erstellt"
        : "Withdrawal request created successfully"
    );
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case "credit":
      case "refund":
        return <ArrowDownLeft className="h-4 w-4 text-green-500" />;
      case "debit":
      case "purchase":
      case "withdrawal":
        return <ArrowUpRight className="h-4 w-4 text-red-500" />;
      default:
        return <RefreshCw className="h-4 w-4 text-blue-500" />;
    }
  };

  const getTransactionColor = (type) => {
    switch (type) {
      case "credit":
      case "refund":
        return "text-green-600";
      case "debit":
      case "purchase":
      case "withdrawal":
        return "text-red-600";
      default:
        return "text-blue-600";
    }
  };

  const getTransactionSign = (type) => {
    switch (type) {
      case "credit":
      case "refund":
        return "+";
      case "debit":
      case "purchase":
      case "withdrawal":
        return "-";
      default:
        return "";
    }
  };

  const getWithdrawalStatusBadge = (status) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      processing: "bg-blue-100 text-blue-800 border-blue-200",
      completed: "bg-green-100 text-green-800 border-green-200",
      failed: "bg-red-100 text-red-800 border-red-200",
      cancelled: "bg-gray-100 text-gray-800 border-gray-200",
    };
    return styles[status] || styles.pending;
  };

  const getWithdrawalStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "failed":
      case "cancelled":
        return <XCircle className="h-4 w-4" />;
      case "processing":
        return <RefreshCw className="h-4 w-4 animate-spin" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{isGerman ? "Wallet" : "Wallet"}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-32 bg-gray-200 rounded-lg"></div>
            <div className="h-64 bg-gray-200 rounded-lg"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-[#C6080A]" />
              {isGerman ? "Mein Wallet" : "My Wallet"}
            </CardTitle>
            <CardDescription>
              {isGerman
                ? "Verwalten Sie Ihr Guthaben und Ihre Transaktionen"
                : "Manage your balance and transactions"}
            </CardDescription>
          </div>
          <Button
            onClick={() => setIsWithdrawalModalOpen(true)}
            className="bg-[#C6080A] hover:bg-[#a50709]"
            disabled={!wallet || wallet.balance <= 0}
          >
            <Download className="h-4 w-4 mr-2" />
            {isGerman ? "Auszahlen" : "Withdraw"}
          </Button>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">
                {isGerman ? "Übersicht" : "Overview"}
              </TabsTrigger>
              <TabsTrigger value="transactions">
                {isGerman ? "Transaktionen" : "Transactions"}
              </TabsTrigger>
              <TabsTrigger value="withdrawals">
                {isGerman ? "Auszahlungen" : "Withdrawals"}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Balance Card */}
              <div className="bg-gradient-to-br from-[#C6080A] to-[#a50709] rounded-xl p-6 text-white">
                <p className="text-white/80 text-sm mb-1">
                  {isGerman ? "Verfügbares Guthaben" : "Available Balance"}
                </p>
                <h3 className="text-4xl font-bold">
                  €{wallet?.balance?.toFixed(2) || "0.00"}
                </h3>
                <p className="text-white/60 text-sm mt-2">
                  {isGerman ? "Währung" : "Currency"}: {wallet?.currency || "EUR"}
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-4">
                    <p className="text-sm text-green-600 mb-1">
                      {isGerman ? "Gesamt erhalten" : "Total Credited"}
                    </p>
                    <p className="text-xl font-bold text-green-700">
                      €{wallet?.totalCredited?.toFixed(2) || "0.00"}
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-red-50 border-red-200">
                  <CardContent className="p-4">
                    <p className="text-sm text-red-600 mb-1">
                      {isGerman ? "Gesamt ausgegeben" : "Total Debited"}
                    </p>
                    <p className="text-xl font-bold text-red-700">
                      €{wallet?.totalDebited?.toFixed(2) || "0.00"}
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4">
                    <p className="text-sm text-blue-600 mb-1">
                      {isGerman ? "Auszahlungen" : "Withdrawn"}
                    </p>
                    <p className="text-xl font-bold text-blue-700">
                      €{wallet?.totalWithdrawn?.toFixed(2) || "0.00"}
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-purple-50 border-purple-200">
                  <CardContent className="p-4">
                    <p className="text-sm text-purple-600 mb-1">
                      {isGerman ? "Transaktionen" : "Transactions"}
                    </p>
                    <p className="text-xl font-bold text-purple-700">
                      {transactions.length}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <div>
                <h4 className="font-semibold mb-3">
                  {isGerman ? "Letzte Aktivität" : "Recent Activity"}
                </h4>
                {transactions.slice(0, 5).length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 px-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                    <div className="relative mb-4">
                      <div className="absolute inset-0 bg-gradient-to-r from-[#C6080A]/10 to-orange-500/10 rounded-full blur-lg animate-pulse"></div>
                      <div className="relative p-4 bg-white rounded-full shadow-sm">
                        <Wallet className="h-8 w-8 text-gray-400" />
                      </div>
                    </div>
                    <p className="text-gray-500 text-center mb-2">
                      {isGerman
                        ? "Noch keine Transaktionen"
                        : "No transactions yet"}
                    </p>
                    <p className="text-xs text-gray-400 text-center max-w-xs">
                      {isGerman
                        ? "Ihre Wallet-Aktivitäten werden hier angezeigt"
                        : "Your wallet activities will appear here"}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {transactions.slice(0, 5).map((tx) => (
                      <div
                        key={tx._id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white rounded-full">
                            {getTransactionIcon(tx.type)}
                          </div>
                          <div>
                            <p className="font-medium capitalize">{tx.type}</p>
                            <p className="text-sm text-gray-500">
                              {format(new Date(tx.createdAt), "MMM d, yyyy")}
                            </p>
                          </div>
                        </div>
                        <p className={`font-semibold ${getTransactionColor(tx.type)}`}>
                          {getTransactionSign(tx.type)}€{tx.amount?.toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="transactions">
              <div className="space-y-4">
                {transactions.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    {isGerman
                      ? "Noch keine Transaktionen"
                      : "No transactions yet"}
                  </p>
                ) : (
                  transactions.map((tx) => (
                    <div
                      key={tx._id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-gray-100 rounded-full">
                          {getTransactionIcon(tx.type)}
                        </div>
                        <div>
                          <p className="font-medium capitalize">{tx.type}</p>
                          <p className="text-sm text-gray-500">
                            {tx.description || "No description"}
                          </p>
                          <p className="text-xs text-gray-400">
                            {format(new Date(tx.createdAt), "MMM d, yyyy HH:mm")}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${getTransactionColor(tx.type)}`}>
                          {getTransactionSign(tx.type)}€{tx.amount?.toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {isGerman ? "Guthaben nachher" : "Balance after"}: €
                          {tx.balanceAfter?.toFixed(2)}
                        </p>
                        <Badge
                          variant={tx.status === "completed" ? "default" : "secondary"}
                          className="mt-1"
                        >
                          {tx.status}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="withdrawals">
              <div className="space-y-4">
                {withdrawals.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    {isGerman
                      ? "Noch keine Auszahlungen"
                      : "No withdrawals yet"}
                  </p>
                ) : (
                  withdrawals.map((withdrawal) => (
                    <div
                      key={withdrawal._id}
                      className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {withdrawal.paymentMethod?.type === "bank_transfer" ? (
                            <Landmark className="h-4 w-4 text-gray-500" />
                          ) : (
                            <CreditCard className="h-4 w-4 text-gray-500" />
                          )}
                          <span className="font-medium capitalize">
                            {withdrawal.paymentMethod?.type?.replace("_", " ")}
                          </span>
                        </div>
                        <Badge
                          className={getWithdrawalStatusBadge(withdrawal.status)}
                        >
                          <span className="flex items-center gap-1">
                            {getWithdrawalStatusIcon(withdrawal.status)}
                            {withdrawal.status}
                          </span>
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500">
                            {isGerman ? "Betrag" : "Amount"}: €
                            {withdrawal.amount?.toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {isGerman ? "Netto" : "Net"}: €
                            {withdrawal.netAmount?.toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {format(
                              new Date(withdrawal.createdAt),
                              "MMM d, yyyy HH:mm"
                            )}
                          </p>
                        </div>
                        {withdrawal.transactionId && (
                          <p className="text-xs text-gray-400">
                            TX: {withdrawal.transactionId}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <WalletWithdrawalModal
        isOpen={isWithdrawalModalOpen}
        onClose={() => setIsWithdrawalModalOpen(false)}
        onSuccess={handleWithdrawalSuccess}
        wallet={wallet}
        auth={auth}
        countryCode={countryCode}
      />
    </>
  );
}
